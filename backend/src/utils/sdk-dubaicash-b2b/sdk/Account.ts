import axios from "axios";
import { sign } from "./sign";

export class Account {
  private sign: sign;

  constructor(sign: sign) {
    this.sign = sign;
  }

  async balance(): Promise<{ status: number; data: any }> {
    const header = await this.sign.header();
    const url: string = process.env.URL_API as string;

    const result = await axios.get(
      url + "/v1/customers/account/balance",
      header
    );

    return result;
  }
}
