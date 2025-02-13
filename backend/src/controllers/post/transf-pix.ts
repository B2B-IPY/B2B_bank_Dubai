import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import {
  CreateTransfer,
  CreateTransferZod,
} from "../../utils/sdk-dubaicash-b2b/types/Transactions";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";
import config from "../../DB/config";
import msql from "mysql2";

import speakeasy from "speakeasy";

async function transferirPix(req: UserRequest, res: Response) {
  const body: CreateTransfer = req.body;

  const document = req.cpfCnpj?.replace(/[^0-9]/g, "");
  const id = req.id_logins;
  if (!id) return res.status(401).json({ error: "Informe o ID " });

  const valid = CreateTransferZod.safeParse(body);
  if (!valid.success) {
    return res.status(400).json({ error: valid.error.issues[0].message });
  }
  const user = req.user || "";

  try {
    const SDK = new SDK_DubaiCash_B2B();
    const conn = msql.createConnection(config);

    const data = await SDK.sign.getLoginInfoByUser(user, conn);
    //2fa
    if (req.required_2fa) {
      const tokenValidates = speakeasy.totp.verify({
        secret: data[0].secret, // O secret armazenado no banco de dados
        encoding: "base32",
        token: body.code!.replace(" ", "")!, // O token que o usuário inseriu
      });
      if (!tokenValidates) {
        return res.status(401).json({
          error: "Codigo inválido",
        });
      }
    }

    const pix = await SDK.Transactions.pix(body, id, document);

    res.status(pix.status || 200).json(pix.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Falha ao transferir PIX" });
  }
}

export default transferirPix;
