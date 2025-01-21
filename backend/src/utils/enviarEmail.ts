import nodemailer from "nodemailer";

async function enviarEmail(
   destinatario: string,
   titulo: string,
   texto: string,
   attachments: {
      filename: string;
      content: Buffer;
      contentType: string;
   }[]
): Promise<boolean> {
   try {
      const transporter = nodemailer.createTransport({
         host: "smtp.hostinger.com",
         port: 465,
         secure: true,
         auth: {
            user: "no-reply@bancastro.com.br",
            pass: process.env.EMAIL_PASSWORD,
         },
      });

      const mailOptions = {
         from: "no-reply@bancastro.com.br",
         to: destinatario,
         subject: "Microcredito - " + titulo,
         text: texto,

         attachments: attachments,
      };

      await transporter.sendMail(mailOptions);

      return true;
   } catch (error) {
      console.log(error);

      return false;
   }
}
export default enviarEmail;
