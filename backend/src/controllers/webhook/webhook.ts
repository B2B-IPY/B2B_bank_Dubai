import { Request, Response } from "express";

function webhook(req: Request, res: Response) {
   const webhook_respose = req.body;
   console.log(webhook_respose);

   return res.status(200).json({
      isLogged: true,
   });
}

export default webhook;
