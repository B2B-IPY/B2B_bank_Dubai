import jsPDF from "jspdf";
import { logo } from "../functions/logo-base64";
export function ComprovanteTransactions(
   description: string,
   valor: string,
   idTransferencia: string,
   horarioPagamento: string,
   tarifa: string,
   direction: string
) {
   const doc = new jsPDF();

   doc.addImage(logo, "PNG", 69, 15, 70, 20, "imglogo");

   doc.setTextColor("#2a333a");
   doc.setFontSize(18);
   doc.text("Comprovante de Pagamento", 65, 45);
   //direita

   doc.setTextColor("#595959");
   doc.setFontSize(11);
   doc.text(direction != "cashout" ? "Destinatário:" : "Remetente: ", 22, 62);

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text("METTADATA TECNOLOGIA LTDA ", 22, 69);

   doc.setFontSize(12);
   doc.text("48.173.509/0001-62 ", 22, 76);

   //esquerda

   doc.setTextColor("#595959");
   doc.setFontSize(11);
   doc.text(
      direction == "cashout" ? "Destinatário: " : "Remetente: ",
      185,
      62,
      {
         align: "right",
      }
   );

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text(
      !description.includes("(") ? description : description.split("(")[0],
      185,
      69,
      { align: "right" }
   );

   doc.setFontSize(12);
   doc.text(
      !description.includes("(")
         ? description
         : description.split("(")[1].replace(")", ""),
      185,
      83,
      {
         align: "right",
      }
   );

   //esquerda
   doc.setFontSize(18);
   doc.text("Dados de Transferência:", 22, 115);

   doc.setTextColor("#bfbfbf");
   doc.setFontSize(18);
   doc.text("______________________________________________", 21, 120);

   doc.setTextColor("#595959");
   doc.setFontSize(12);
   doc.text("Valor ", 22, 132);

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text("R$" + " " + valor, 95, 132);

   doc.setTextColor("#595959");
   doc.setFontSize(12);
   doc.text("ID da Transferência ", 22, 140);

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text(idTransferencia, 95, 140);

   doc.setTextColor("#595959");
   doc.setFontSize(12);
   doc.text("Horário de Pagamento ", 22, 148);

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text(horarioPagamento, 95, 148);

   doc.setTextColor("#595959");
   doc.setFontSize(12);
   doc.text("Tarifa", 22, 164);

   doc.setTextColor("#000");
   doc.setFontSize(12);
   doc.text("R$" + " " + tarifa, 95, 164);

   const pdfBlob = doc.output("blob");
   const pdfUrl = URL.createObjectURL(pdfBlob);
   window.open(pdfUrl, "_blank");
}
