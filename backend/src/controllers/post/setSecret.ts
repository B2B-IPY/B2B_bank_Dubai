import mysql from "mysql2";
import config from "../../DB/config";
import { Response } from "express";

import speakeasy from "speakeasy";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function SetSecret(req: UserRequest, res: Response) {
  const { user, new_secret, password, code } = req.body;
  if (!user || !password || !code || !new_secret)
    return res.status(401).json({
      status: "Informe o nome de usuário, senha. código e o secret",
    });
  const conn = mysql.createConnection(config);
  try {
    const auth = new SDK_DubaiCash_B2B();
    const data = await auth.sign.getLoginInfoByUser(user, conn);
    // bcrypt verify
    const bcrypt_verify = await auth.sign.bcrypt(data[0].password, password);
    if (!bcrypt_verify) {
      return res.status(401).json({ status: "Usuario ou Senha incorreto" });
    }
    if (data[0].secret) {
      return res.status(401).json({
        status: "Este usuário já possui um secret ativado!",
      });
    }

    const tokenValidates = speakeasy.totp.verify({
      secret: new_secret!, // O secret que o usuario inseriu
      encoding: "base32",
      token: code!, // O token que o usuário inseriu
    });
    if (!tokenValidates) {
      return res.status(401).json({
        status: "Codigo inválido",
      });
    }
    conn.query(
      `UPDATE logins SET secret = ? , required_2fa = ? WHERE user = ?`,
      [new_secret, 1, user],
      (err, data, fields) => {
        if (err)
          return res.status(500).json({ status: "ocorreu um erro", erro: err });
        return res.status(200).json({
          status: "autenticação de dois fatores ativada com sucesso!",
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "ocorreu um erro" });
  } finally {
    conn.end();
  }
}

export default SetSecret;
