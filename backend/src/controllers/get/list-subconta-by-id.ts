import { Response } from "express";
import { UserRequest } from "../../interfaces/UserRequest";
import SDK_DubaiCash_B2B from "../../utils/sdk-dubaicash-b2b";

async function listSubContasByID(req: UserRequest, res: Response) {
  const SDK = new SDK_DubaiCash_B2B();
  const id = req.params.id as string;
  const result = await SDK.SubContas.get(id);
  if (!result[0]) return res.status(404).json({ message: "não encontrada" });
  res.status(200).json(result);
}

export default listSubContasByID;
