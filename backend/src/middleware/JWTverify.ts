import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRequest } from "../interfaces/UserRequest";

function JWTverify(req: UserRequest, res: Response, next: NextFunction) {
   const token: string = req.headers["x-access-token"] as string;
   const hash: string = process.env.ACCESS_TOKEN_SECRET as string;

   jwt.verify(token, hash, (err, decoded) => {
      if (err) return res.status(401).json({ status: "nao autenticado" });

      req.id_logins = (decoded as jwt.JwtPayload).id_logins;
      req.email = (decoded as jwt.JwtPayload).email;
      req.user = (decoded as jwt.JwtPayload).user;
      req.valor = (decoded as jwt.JwtPayload).valor;
      req.cashin_fixo = (decoded as jwt.JwtPayload).cashin_fixo;
      req.cashin_porcent = (decoded as jwt.JwtPayload).cashin_porcent;
      req.cashout_fixo = (decoded as jwt.JwtPayload).cashout_fixo;
      req.cashout_porcent = (decoded as jwt.JwtPayload).cashout_porcent;
      req.role = (decoded as jwt.JwtPayload).role;
      req.cpfCnpj = (decoded as jwt.JwtPayload).cpfCnpj;
      req.nome = (decoded as jwt.JwtPayload).nome;

      next();
   });
}

export default JWTverify;
