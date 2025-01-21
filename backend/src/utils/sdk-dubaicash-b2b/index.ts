import { sign } from "./sdk/sign";

import { Transactions } from "./sdk/Transaction";
import { Account } from "./sdk/Account";
import { SubContas } from "./sdk/SubContas";

export default class SDK_DubaiCash_B2B {
  public sign: sign;
  public SubContas: SubContas;
  public Transactions: Transactions;
  public Account: Account;

  constructor() {
    this.sign = new sign();
    this.Transactions = new Transactions(this.sign);
    this.Account = new Account(this.sign);
    this.SubContas = new SubContas();
  }
}
