import { Response } from "express";
import taxas_base from "../../utils/taxas_base";
import { UserRequest } from "../../interfaces/UserRequest";

function getTaxas(req: UserRequest, res: Response) {
   const taxas = taxas_base;

   return res.status(200).json(taxas);
}
export default getTaxas;
