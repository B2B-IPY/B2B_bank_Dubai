import { RowDataPacket } from "mysql2";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

function Query(
  sql: string,
  params: any[],
  connection: Connection
): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.query<RowDataPacket[]>(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

export default Query;
