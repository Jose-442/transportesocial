import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { lineasJustificante, type DatosJustificante } from "@/lib/justificante-pago";

function partirLinea(texto: string, max: number): string[] {
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let actual = "";
  for (const palabra of palabras) {
    const siguiente = actual ? `${actual} ${palabra}` : palabra;
    if (siguiente.length > max && actual) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = siguiente;
    }
  }
  if (actual) lineas.push(actual);
  return lineas.length > 0 ? lineas : [""];
}

export async function pdfJustificante(datos: DatosJustificante): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const negrita = await doc.embedFont(StandardFonts.HelveticaBold);
  const margen = 50;
  let y = 780;

  const bloques = lineasJustificante(datos).flatMap((linea) =>
    linea ? partirLinea(linea, 78) : [""]
  );

  for (const [i, linea] of bloques.entries()) {
    const titulo = i === 0;
    page.drawText(linea, {
      x: margen,
      y,
      size: titulo ? 16 : 12,
      font: titulo ? negrita : font,
      color: rgb(0.1, 0.1, 0.12),
    });
    y -= titulo ? 28 : linea === "" ? 14 : 20;
  }

  return doc.save();
}
