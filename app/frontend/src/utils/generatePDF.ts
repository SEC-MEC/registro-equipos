import { format } from 'date-fns';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


interface EquipoPDF {
    id_equipo: number;
    nombre_pc: string;
    nro_serie: string;
    id_inventario: string | null;
    tipo: string;
    oficina: string | null;
    piso: number | null;
    UE: string | null;
    last_update: string ;
    Tecnico: string | null;
    Usuario: string | null;
    dominio: boolean;
    aplicaciones: { nombre: string; version: string }[];
}



export async function generatePDF(equipo: EquipoPDF) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const titleSize = 18;
  const textSize = 12;
  const lineHeight = 20;
  const tableTop = height - 120;
  const cellPadding = 5;
  const cellHeight = 25;
  const cellWidth = 200;

  const logoPdf = "https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_oficial_del_Ministerio_de_Educaci%C3%B3n_y_Cultura.png"
  const imageBytes = await fetch(logoPdf).then(res => res.arrayBuffer());
  const image = await pdfDoc.embedPng(imageBytes);
  const imageWidth = 150;
  const imageHeight = (image.height / image.width) * imageWidth;

  const imageX = (width - imageWidth) / 2;
  page.drawImage(image, {
    x: imageX,
    y: height  - 80,
    width: imageWidth,
    height: imageHeight,
  });

  const title = "Guía para configuración de PC-MEC y unidades ejecutoras";
  const titleWidth = font.widthOfTextAtSize(title, titleSize);
  const titleX = (width - titleWidth) / 2;
  page.drawText(title, {
    x: titleX,
    y: height - imageHeight - 50,
    size: titleSize,
    font,
    color: rgb(0, 0, 0),
  });

  const fechaFormateada = equipo.last_update ? format(new Date(equipo.last_update), 'yyyy-MM-dd') : 'N/A';

  const data = [
    ["Nombre del PC", equipo.nombre_pc],
    ["Número de Serie", equipo.nro_serie],
    ["Unidad", equipo.UE],
    ["Tecnico asignado", equipo.Tecnico],
    ["Fecha", fechaFormateada],
  ];


  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const y = tableTop - rowIndex * cellHeight;
      const x = 50 + cellIndex * cellWidth;

      page.drawRectangle({
        x,
        y: y - cellHeight + cellPadding,
        width: cellWidth,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      // Dibujar texto de la celda
      page.drawText(cell ?? '', {
        x: x + cellPadding,
        y: y - lineHeight + cellPadding,
        size: textSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  });

  const appsTitleY = tableTop - data.length * cellHeight - 40;
  page.drawText(``, {
    x: 50,
    y: appsTitleY,
    size: textSize,
    font,
    color: rgb(0, 0, 0),
  });
  
  equipo.aplicaciones.forEach((app, index) => {
    page.drawText(`- ${app.nombre} ${app.version}`, {
      x: 70,
      y: appsTitleY - (index + 1) * lineHeight,
      size: textSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}


export function downloadPDF(pdfBytes: Uint8Array, fileName: string) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}