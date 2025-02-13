import {
  CriarSubcontaRequest,
  // criarSubContaZod,
  SubConta,
} from "../types/SubContas";

import config from "../../../DB/config";
import { Connection } from "mysql2/typings/mysql/lib/Connection";
import bcrypt from "bcrypt";
import mysql, { RowDataPacket } from "mysql2";
import dotenv from "dotenv";
import { gerarSenha } from "../../gerarSenha";
import taxas_base from "../../taxas_base";
import enviarEmail from "../../enviarEmail";
import { sanitizeDoc } from "../../sanitizeDoc";
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
    const password = gerarSenha();
    console.log(body);

    const connection = mysql.createConnection(config);
    connection.connect();

    async function hashPassword(password: string) {
      try {
        const hash = await bcrypt.hash(password, 8);
        return {
          status: 200,
          data: hash,
        };
      } catch (err) {
        return {
          status: 500,
          data: "Ocorreu um erro ao criptografar a senha",
        };
      }
    }
    const gerarHash = await hashPassword(password);
    const hash = gerarHash.data;
    try {
      const taxas_representante = JSON.stringify(body.taxas_representante);
      console.log(taxas_representante);

      const sql = await this.Query(
        `INSERT INTO logins (nome, user, password, email, role,  cashin_fixo, cashin_porcent, cashout_fixo, cashout_porcent, valor, cpfCnpj, taxas_representante ) SELECT ? , ? , ? , ? , ? ,  ? , ? , ? , ? , ? , ?, ?  WHERE NOT EXISTS (SELECT 1 FROM logins WHERE user = ? AND cpfCnpj = ?)`,
        [
          body.name,
          body.user,
          hash,
          body.email,
          "cliente",
          taxas_base.cashin_fixo,
          taxas_base.cashin_porcent,
          taxas_base.cashout_fixo,
          taxas_base.cashout_porcent,
          0,
          body.cpfCnpj,
          taxas_representante,
          body.user,
          body.cpfCnpj,
        ],
        connection
      );

      if (sql) {
        await enviarEmail(
          body.email,
          "Acesso ao Sistema",
          `Prezado(a) ${body.name},

         É um prazer recebê-lo(a) em nosso sistema bancário digital. Seguem abaixo as informações necessárias para o seu acesso:

         Usuário: ${sanitizeDoc(body.user)}
         Senha: ${password}
         Link para Acesso: https://binbank.com.br/login`,
          []
        );
      }
      return sql;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      connection.end();
    }
  }
  async addSaldo(id_logins: string, amount: number): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();
    const valorFinal = amount - 0.15;
    try {
      const sql = await this.Query(
        "UPDATE logins SET valor = valor + ? WHERE id_logins = ?",
        [valorFinal, id_logins],
        connection
      );
      return sql;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      connection.end();
    }
  }
  async rmSaldo(id_logins: string, amount: number): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();
    const valorFinal = amount + 0.15;

    try {
      const sql = await this.Query(
        "UPDATE logins SET valor = valor - ? WHERE id_logins = ?",
        [valorFinal, id_logins],
        connection
      );

      return sql;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      connection.end();
    }
  }
  async TranfersRep(id_logins: string, amount: number): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();

    const valorFinal = amount / 2;
    try {
      if (id_logins === "17") {
        const sql = await this.Query(
          "UPDATE logins SET valor = valor + ? WHERE id_logins = ?",
          [amount, id_logins],
          connection
        );

        return sql;
      }
      const sql = await this.Query(
        "UPDATE logins SET valor = valor + ? WHERE id_logins = ?",
        [valorFinal, id_logins],
        connection
      );
      if (sql) {
        const spliContaMae = await this.Query(
          "UPDATE logins SET valor = valor + ? WHERE id_logins = ?",
          [valorFinal, 1],
          connection
        );
      }

      return sql;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      connection.end();
    }
  }

  async tarifar(id_logins: string, tarifa: number): Promise<SubConta[]> {
    const connection = mysql.createConnection(config);
    connection.connect();

    try {
      const sql = await this.Query(
        "UPDATE logins SET valor = valor - ? WHERE id_logins = ?",
        [tarifa, id_logins],
        connection
      );
      if (sql) {
        const spliContaMae = await this.Query(
          "UPDATE logins SET valor = valor + ? WHERE id_logins = ?",
          [tarifa, 1],
          connection
        );
      }

      return sql;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      connection.end();
    }
  }
}
