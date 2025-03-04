import { Response } from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import mysql from "mysql2";
import config from "../../DB/config";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function login(req: UserRequest, res: Response) {
  const { user, password } = req.body;
  if (!user || !password)
    return res
      .status(400)
      .json({ status: "informe todos os campos (user, password)" });
  const conn = mysql.createConnection(config);
  try {
    const auth = new SDK_DubaiCash_B2B();

    const data = await auth.sign.getLoginInfoByUser(user, conn);
    if (!data[0])
      return res.status(404).json({ status: "usuario nao encontrado" });

    // bcrypt verify
    const bcrypt_verify = await auth.sign.bcrypt(data[0].password, password);
    if (!bcrypt_verify)
      return res.status(401).json({ status: "Usuario ou Senha incorreto" });

    // jwt signature
    const token: string = auth.sign.jwt(
      data[0].user,
      data[0].email,
      data[0].id_logins,
      data[0].role,
      data[0].cashin_fixo,
      data[0].cashin_porcent,
      data[0].cashout_fixo,
      data[0].cashout_porcent,
      data[0].valor,
      data[0].cpfCnpj,
      data[0].nome,
      data[0].required_2fa,
      data[0].secret
    );

    let new_secret: string = "";
    let qr_code: string = "";

    if (!data[0].secret) {
      const secret = speakeasy.generateSecret({
        name: "BinBank: " + data[0].user,
      });
      const qrcodePromisse: Promise<any> = new Promise((resolve, reject) => {
        qrcode.toDataURL(secret.otpauth_url!, (err, data_url) => {
          if (err) return reject(err);
          const secretBase32 = secret.base32;
          resolve({ secretBase32, data_url });
        });
      });

      const { secretBase32, data_url } = await Promise.resolve(qrcodePromisse);
      new_secret = secretBase32;
      qr_code = data_url;
    }

    if (!data[0].required_2fa) {
      return res.status(200).json({
        status: "isLogged",
        "x-access-token": token,
        personData: {
          user: data[0].user,
          email: data[0].email,
          id_logins: data[0].id_logins,
          role: data[0].role,
          valor: data[0].valor,
          cpfCnpj: data[0].cpfCnpj,
          nome: data[0].nome,
        },
        A2fa_Ativada: false,
      });
    }
    if (data[0].required_2fa && !data[0].secret) {
      return res.status(200).json({
        status: "Prossiga com a autenticação 2FA pela rota /login2fa",
        qr_code: qr_code,
        new_secret: new_secret,
        required_2fa: data[0].required_2fa,
        A2fa_Ativada: false,
      });
    }

    return res.status(200).json({
      status: "Prossiga com a autenticação 2FA pela rota /login2fa",
      required_2fa: data[0].required_2fa,
      A2fa_Ativada: true,
    });
  } catch (err: any) {
    console.log(err);

    return res.status(err.status || 500).json({ erro: err.message });
  } finally {
    conn.end();
  }
}

export default login;
