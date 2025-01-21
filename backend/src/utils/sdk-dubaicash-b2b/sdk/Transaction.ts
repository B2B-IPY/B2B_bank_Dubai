import axios from "axios";
import { sign } from "./sign";
import config from "../../../DB/config";
import mysql from "mysql2";
import { CreateTransfer } from "../types/Transactions";

export class Transactions {
  private sign: sign;

  constructor(sign: sign) {
    this.sign = sign;
  }

  async pix(body: CreateTransfer): Promise<{ status: number; data: any }> {
    const header = await this.sign.header();
    const url: string = process.env.URL_API as string;

    return await axios.get(url + "/financialTransactions", header);
  }
}
