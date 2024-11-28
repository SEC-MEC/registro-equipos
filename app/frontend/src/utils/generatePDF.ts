import { format } from 'date-fns';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


interface EquipoPDF {
    id_equipo: string;
    nombre_pc: string;
    nro_serie: string;
    id_inventario: string;
    tipo: string;
    oficina: string;
    piso: string;
    UE: string;
    last_update: string;
    Tecnico: string;
    Usuario: string;
    dominio: boolean;
}

// interface Aplicacion {
//     nombre: string;
//     version: string;
// }

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

  const fechaFormateada = format(new Date(equipo.last_update), 'yyyy-MM-dd');

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
      page.drawText(cell, {
        x: x + cellPadding,
        y: y - lineHeight + cellPadding,
        size: textSize,
        font,
        color: rgb(0, 0, 0),
      });
    });
  });

  const appsTitleY = tableTop - data.length * cellHeight - 40;
  page.drawText(`Aplicaciones Instaladas:`, {
    x: 50,
    y: appsTitleY,
    size: textSize,
    font,
    color: rgb(0, 0, 0),
  });

//   if (Array.isArray(aplicaciones) && aplicaciones.length > 0) {
//     aplicaciones.nombre
//     .forEach((app: any, index: number) => {
//         page.drawText(`- ${app.aplicacion.nombre}`, {
//           x: 70,
//           y: appsTitleY - (index + 1) * lineHeight,
//           size: textSize,
//           font,
//           color: rgb(0, 0, 0),
//         });
//       });
//   } else {
//     page.drawText(`No hay aplicaciones instaladas.`, {
//       x: 70,
//       y: appsTitleY - lineHeight,
//       size: textSize,
//       font,
//       color: rgb(0, 0, 0),
//     });
//   }

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