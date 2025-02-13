import { Response } from "express";
import speakeasy from "speakeasy";
import mysql from "mysql2";
import config from "../../DB/config";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function login2fa(req: UserRequest, res: Response) {
  const { user, password, code } = req.body;
  if (!user || !password || !code) {
    return res
      .status(400)
      .json({ status: "informe todos os campos (user, password)" });
  }
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

    const tokenValidates = speakeasy.totp.verify({
      secret: data[0].secret, // O secret armazenado no banco de dados
      encoding: "base32",
      token: code.replace(" ", "")!, // O token que o usuário inseriu
    });

    if (!tokenValidates) {
      return res.status(401).json({
        error: "Codigo inválido",
      });
    }

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
    });
  } catch (err: any) {
    console.log(err);

    return res.status(err.status || 500).json({ erro: err.message });
  } finally {
    conn.end();
  }
}

export default login2fa;
