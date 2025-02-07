import { Response, NextFunction } from "express";
import { UserRequest } from "../interfaces/UserRequest";

function verifyPerm(req: UserRequest, res: Response, next: NextFunction) {
   if (req.role !== "admin" && req.role !== "representante")
      return res.status(403).json({ status: "sem permissao" });
   next();
}

export default verifyPerm;
