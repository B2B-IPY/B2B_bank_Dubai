import { Request, Response } from "express";

function vanilla(req: Request, res: Response) {
  return res.status(200).json({
    isLogged: true,
  });
}

export default vanilla;
