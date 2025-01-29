import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";

import speakeasy from "speakeasy";
import config from "../../DB/config";
import mysql from "mysql2";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";
import {
   CriarSubcontaRequest,
   SubConta,
} from "../../utils/sdk-dubaicash-b2b/types/SubContas";

async function criarSubContas(req: UserRequest, res: Response) {
   const body: CriarSubcontaRequest = req.body;

   // const valid = CriarSubcontaRequestzo.safeParse(body);
   // if (!valid.success) {
   //    return res.status(400).json({ error: valid.error.issues[0].message });
   // }
   const auth = new SDK_DubaiCash_B2B();
   const conn = mysql.createConnection(config);
   const data = await auth.sign.getLoginInfoByUser(req.user!, conn);
   conn.end();
   if (!data) return res.status(404).json({ status: "usuario nao encontrado" });

   const connection = mysql.createConnection(config);
   const docAndUser = await auth.sign.verifyDocAndUser(
      body.user,
      body.cpfCnpj,
      connection
   );
   connection.end();

   if (docAndUser[0]) {
      return res.status(409).json({
         error: "Usuario/doc duplicado",
      });
   }

   const SDK = new SDK_DubaiCash_B2B();
   const criarSubConta = await SDK.SubContas.create(body);

   res.status(criarSubConta.status || 200).json(criarSubConta.data);
}

export default criarSubContas;
