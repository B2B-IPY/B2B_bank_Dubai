import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import speakeasy from "speakeasy";
import config from "../../DB/config";
import mysql from "mysql2";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

export interface editSubConta {
  cashin_fixo: number;
  cashin_porcent: number;
  cashout_fixo: number;
  cashout_porcent: number;
  comprovante: null;
  cpfCnpj: string;
  created_at: string;
  email: string;
  id_logins: number;
  nome: string;
  password: string;
  required_2fa: number;
  role: string;
  secret: string;
  taxas_representante: any[];
  user: string;
  valor: number;
}

async function atualizarConta(req: UserRequest, res: Response) {
  const body: editSubConta = req.body;
  const id = req.params.id;
  const auth = new SDK_DubaiCash_B2B();
  const connection = mysql.createConnection(config);
  const data = await auth.sign.getLoginInfoByUser(req.user!, connection);
  connection.end();
  if (!data) return res.status(404).json({ status: "usuario nao encontrado" });
  // const tokenValidates = speakeasy.totp.verify({
  //   secret: data[0].secret, // O secret armazenado no banco de dados
  //   encoding: "base32",
  //   token: (body.code || "000000").replace(" ", "")!, // O token que o usuário inseriu
  // });

  // if (!tokenValidates && req.required_2fa) {
  //   return res.status(401).json({
  //     error: "Codigo inválido",
  //   });
  // }

  const conn = mysql.createConnection(config);
  conn.query(
    "UPDATE logins SET nome = ?, cpfCnpj = ?, role = ?, taxas_representante = ?, cashin_porcent = ?, cashin_fixo = ?, cashout_porcent = ?, cashout_fixo = ? WHERE id_logins = ?",
    [
      body.nome,
      body.cpfCnpj,
      body.role,
      body.taxas_representante,
      body.cashin_porcent,
      body.cashin_fixo,
      body.cashout_porcent,
      body.cashout_fixo,
      id,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Erro ao atualizar conta" });
      }
      return res.status(200).json({ status: "Conta atualizada" });
    }
  );
  conn.end();
}

export default atualizarConta;
