import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import config from "../../DB/config";
import mysql, { RowDataPacket } from "mysql2";

async function listRepresentantes(req: UserRequest, res: Response) {
   const conn = mysql.createConnection(config);

   try {
      conn.query<RowDataPacket[]>(
         "SELECT * FROM logins WHERE role = 'representante'",
         (err, result) => {
            conn.end();
            if (err) {
               console.error(err);
               return res.status(500).json({ error: "Erro ao buscar dados " });
            }

            if (!result[0]) {
               return res.status(404).json({ error: "Nenhum dado encontrado" });
            }

            return res.json(result);
         }
      );
   } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar dados " });
   }
}

export default listRepresentantes;
