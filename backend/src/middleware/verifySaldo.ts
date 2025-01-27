import { Response, NextFunction } from "express";
import SDK_DubaiCash_B2B from "../utils/sdk-dubaicash-b2b";
import mysql from "mysql2";
import config from "../DB/config";
import { UserRequest } from "../interfaces/UserRequest";
export const verifySaldo = async (
   req: UserRequest,
   res: Response,
   next: NextFunction
) => {
   const user = req.user;
   const transactionAmount = req.body.amount;

   console.log(user, transactionAmount);

   if (!user || !transactionAmount) {
      return res.status(400).json({
         message: "ID do usuário e valor da transação são obrigatórios",
      });
   }
   const conn = mysql.createConnection(config);

   try {
      const auth = new SDK_DubaiCash_B2B();
      const data = await auth.sign.getLoginInfoByUser(user, conn);

      if (!data[0])
         return res.status(404).json({ status: "usuario nao encontrado" });

      if (data[0].valor < transactionAmount) {
         return res.status(400).json({ message: "Saldo insuficiente" });
      }

      next();
   } catch (error) {
      return res
         .status(500)
         .json({ message: "Erro interno do servidor", error });
   }
};
