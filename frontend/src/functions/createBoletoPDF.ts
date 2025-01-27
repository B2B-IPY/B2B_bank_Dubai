import jsPDF from "jspdf";
import { logo } from "./logo-base64";
import BwipJs from "bwip-js";
import normalizeTimeStamp from "./normalizeTimeStamp";
function gerarCodigoDeBarras(linhaDigitavel: string): string {
  const canvas = document.createElement("canvas"); // Cria o canvas

  // Gera o código de barras no canvas a partir da linha digitável
  BwipJs.toCanvas(canvas, {
    bcid: "code128", // Tipo de código de barras
    text: linhaDigitavel.replace(/\D/g, ""), // Remove caracteres não numéricos da linha digitável
    scale: 3, // Escala do código de barras
    height: 10, // Altura do código de barras
    includetext: true, // Não incluir o texto abaixo do código de barras
  });

  // Converte o conteúdo do canvas para uma imagem base64
  const base64Image = canvas.toDataURL("image/png");

  return base64Image; // Retorna o código base64 da imagem gerada
}
export default async function boletoPdf(
  nome: string,
  CPForCNPJ: string,
  linhadigitavel: string,
  valor: string,
  desc: string,
  vencimento: string,
  horario: string,
  barCode: string
) {
  const codigoDeBarras = await gerarCodigoDeBarras(linhadigitavel);

  const doc = new jsPDF();

  doc.addImage(logo, "PNG", 69, 15, 70, 20, "imglogo", "NONE", 0);

  doc.setTextColor("#2a333a");
  doc.setFontSize(18);
  doc.text("Boleto", 100, 45);
  //direita

  doc.setTextColor("#595959");
  doc.setFontSize(11);
  doc.text("Pagador: ", 22, 62);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text(nome, 22, 69);

  doc.setFontSize(12);
  doc.text("CPF / CNPJ:" + " " + CPForCNPJ, 22, 76);

  //direita

  //esquerda

  //esquerda

  doc.setFontSize(18);
  doc.text("Dados do Pagamento:", 22, 105);

  doc.setTextColor("#bfbfbf");
  doc.setFontSize(18);
  doc.text("______________________________________________", 21, 110);

  doc.setTextColor("#595959");
  doc.setFontSize(12);
  doc.text("Linha Digitável ", 22, 122);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text(linhadigitavel, 65, 122);

  doc.setTextColor("#595959");
  doc.setFontSize(12);
  doc.text("Valor ", 22, 130);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text("R$" + " " + valor, 65, 130);

  doc.setTextColor("#595959");
  doc.setFontSize(12);
  doc.text("Descrição ", 22, 138);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text(desc, 65, 138);

  doc.setTextColor("#595959");
  doc.setFontSize(12);
  doc.text("Vencimento", 22, 146);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text(vencimento, 65, 146);

  doc.setTextColor("#595959");
  doc.setFontSize(12);
  doc.text("Horário", 22, 154);

  doc.setTextColor("#000");
  doc.setFontSize(12);
  doc.text(normalizeTimeStamp(horario), 65, 154);

  doc.addImage(codigoDeBarras, "PNG", 10, 175, 190, 20, "codbarra", "NONE", 0);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
}
