import { Response, NextFunction } from "express";
import { UserRequest } from "../interfaces/UserRequest";

function representantePerm(
   req: UserRequest,
   res: Response,
   next: NextFunction
) {
   if (req.role != "admin" && req.role != "representante")
      return res.status(403).json({ error: "sem permissao" });
   next();
}

export default representantePerm;
