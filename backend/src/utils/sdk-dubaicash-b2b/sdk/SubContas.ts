import {
  CriarSubcontaRequest,
  criarSubContaZod,
  SubConta,
} from "../types/SubContas";

import config from "../../../DB/config";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

import mysql, { RowDataPacket } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export class SubContas {
  private Query(
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
  constructor() {}
  async balance(id_logins: number): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();
    try {
      const sql = await this.Query(
        "SELECT valor FROM logins WHERE id_logins = ?",
        [id_logins],
        connection
      );
      return sql;
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
  async get(id_logins: string): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();
    try {
      const sql = await this.Query(
        "SELECT * FROM logins WHERE id_logins = ?",
        [id_logins],
        connection
      );
      return sql;
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
  async query(): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();
    try {
      const sql = await this.Query("SELECT * FROM logins", [], connection);
      return sql;
    } catch (error) {
      throw error;
    } finally {
      connection.end();
    }
  }
  async create(body: CriarSubcontaRequest) {
    const valid = criarSubContaZod.safeParse(body);
    if (!valid.success)
      return {
        status: 400,
        data: { error: valid.error.issues[0].message },
      };

    return true;
  }
}
