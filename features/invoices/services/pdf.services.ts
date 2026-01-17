import PDFDocument from "pdfkit";
import PdfTable from "voilab-pdf-table";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

import { InvoicePDFData } from "@/features/invoices/invoice.types";
import {
  arNumbers,
  formatCurrencyWithoutSymbols,
  formatNumbers,
  toReversedArabicDigits,
  enNumbers,
} from "@/lib/utils/number.utils";
import { arToLocaleDate, formatArabicDate } from "@/lib/utils/date.utils";
import {
  extractNumbersWithIndex,
  replaceMissedupSymbols,
} from "@/lib/utils/pdf.utils";

const PAGE_TOP = 120;
const PAGE_BOTTOM = 740;
const PAGE_MARGIN = 50;

export async function generateInvoicePDF(
  invoice: InvoicePDFData
): Promise<Buffer> {
  const isArabic = invoice.lang === "ar";

  const fontRegular = path.join(
    process.cwd(),
    "public/fonts/NotoKufiArabic-Regular.ttf"
  );
  const fontBold = path.join(
    process.cwd(),
    "public/fonts/NotoKufiArabic-Bold.ttf"
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE_MARGIN,
    bufferPages: true,
    font: fontRegular,
  });

  doc.registerFont("font-regular", fontRegular);
  doc.registerFont("font-regular-bold", fontBold);

  const table = new PdfTable(doc, {
    bottomMargin: 30,
  });

  const chunks: Uint8Array[] = [];
  doc.on("data", chunks.push.bind(chunks));

  doc.on("pageAdded", () => {
    drawHeader(doc, isArabic);
    doc.y = PAGE_TOP;
  });

  drawHeader(doc, isArabic);
  doc.y = PAGE_TOP;

  doc
    .fontSize(12)

    .text(isArabic ? `الفاتورة #  ` : `Invoice # `, {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
      stroke: true,
      characterSpacing: 0.5,
      continued: true,
    })
    .text(invoice.invoiceNumber, isArabic ? -5 : 50, doc.y, {
      align: isArabic ? "right" : "left",
    })
    .fontSize(10)
    .moveDown()
    .text(isArabic ? `تاريخ الفاتورة: ` : `Issued At: `, {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
      continued: true,
    })
    .text(
      isArabic
        ? formatArabicDate(arToLocaleDate.format(new Date(invoice.issueAt)))
        : invoice.issueAt,
      isArabic ? -10 : 50,
      doc.y,
      {
        align: isArabic ? "right" : "left",
      }
    )
    .text(isArabic ? `تاريخ الاستحقاق: ` : `Due At: `, {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
      continued: true,
    })
    .text(
      isArabic
        ? formatArabicDate(arToLocaleDate.format(new Date(invoice.dueAt)))
        : invoice.dueAt,
      isArabic ? -22 : 50,
      doc.y,
      {
        align: isArabic ? "right" : "left",
      }
    )
    .moveDown(2);

  doc
    .fontSize(11)
    .text(isArabic ? "فاتورة لـ:" : "Bill To:", {
      underline: true,
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
    })
    .fontSize(10)
    .text(invoice.customer.name, {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
    })
    .text(invoice.customer.address ?? "", {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
    })
    .text(invoice.customer.email ?? "", {
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
    })
    .moveDown(2);

  doc
    .fontSize(11)
    .text(isArabic ? "المنتجات:" : "Products:", {
      underline: true,
      align: isArabic ? "right" : "left",
      features: isArabic ? ["rtla"] : [],
    })
    .moveDown();

  doc.fontSize(11);

  const header = table
    .addPlugin(
      new (require("voilab-pdf-table/plugins/fitcolumn"))({
        column: "name",
      })
    )
    .setColumnsDefaults({
      headerBorder: "BLRT",
      align: isArabic ? "left" : "right",
      features: isArabic ? ["rtla"] : [],
    });

  isArabic
    ? header.addColumns([
        {
          id: "total",
          header: "المجموع )ل.س.(",
          width: 100,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "price",
          header: "السعر )ل.س.(",
          width: 90,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "unit",
          header: "الوحدة",
          width: 70,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "quantity",
          header: "الكمية",
          width: 70,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "name",
          header: "المنتج",
          align: "center",
          border: "BLR",
          indent: 3,
          headerFill: true,
          features: ["rtla"],
        },
      ])
    : header.addColumns([
        {
          id: "name",
          header: "Product",
          align: "center",
          border: "BLR",
          indent: 3,
          headerFill: true,
        },
        {
          id: "quantity",
          header: "Quantity",
          width: 70,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "unit",
          header: "Unit",
          width: 70,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "price",
          header: "Price (SYP)",
          width: 90,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
        {
          id: "total",
          header: "Total (SYP)",
          width: 100,
          border: "BLR",
          align: "center",
          headerFill: true,
        },
      ]);

  header
    .onHeaderAdd((t) => {
      t.pdf.font("font-regular-bold").fontSize(12);
    })
    .onHeaderAdded((t) => {
      t.pdf.font("font-regular").fontSize(12);
    })
    .onCellBackgroundAdd((t) => {
      t.pdf.fill("#ccc");
    })
    .onCellBackgroundAdded((t) => t.pdf.fill("#000"))
    .onPageAdded(function (tb) {
      tb.pdf.fontSize(10);
      tb.addHeader();
    });

  const tableBody = invoice.products.map(
    ({ name, quantity, unitPrice, unit }) => {
      const total = quantity * unitPrice;

      return {
        name: extractNumbersWithIndex(replaceMissedupSymbols(name), isArabic),
        quantity: formatNumbers({
          isArabic,
          value: quantity,
          reverseArabicForPDF: true,
        }),
        price: formatCurrencyWithoutSymbols({
          isArabic,
          value: unitPrice,
          reverseArabicForPDF: true,
        }),
        unit: unit,
        total: formatCurrencyWithoutSymbols({
          isArabic,
          value: total,
          reverseArabicForPDF: true,
        }),
      };
    }
  );

  table.addBody(tableBody);

  doc
    .fontSize(11)
    .moveDown(1)
    .text(
      isArabic
        ? `)ل.س.( ${toReversedArabicDigits(invoice.total)} الإجمالي: `
        : `Total: ${enNumbers.format(invoice.total)} (SYP)`,
      50,
      doc.y,
      {
        align: isArabic ? "left" : "right",
        stroke: true,
      }
    );

  if (doc.y > PAGE_BOTTOM - 80) {
    doc.fontSize(10);
    doc.addPage();
  }

  const qrData = `Invoice:${invoice.invoiceNumber}|Total:${invoice.total}`;
  const qrBig = await QRCode.toDataURL(qrData);

  if (doc.y > PAGE_BOTTOM - 160) {
    doc.fontSize(10);
    doc.addPage();
  }

  doc.image(qrBig, isArabic ? 457 : 40, doc.y, {
    width: 100,
    align: "center",
  });

  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    await drawFooter(doc, i + 1, range.count, invoice, isArabic);
  }

  doc.end();

  return await new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

function drawHeader(doc: typeof PDFDocument, isArabic: boolean) {
  const logoPath = path.join(process.cwd(), "public/logos/logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, isArabic ? 500 : 50, 40, { width: 50 });
  }

  doc.fontSize(20).text(isArabic ? "فاتورة" : "INVOICE", {
    align: isArabic ? "left" : "right",
  });
}

async function drawFooter(
  doc: PDFKit.PDFDocument,
  pageNumber: number,
  totalPages: number,
  invoice: InvoicePDFData,
  isArabic: boolean
) {
  const qrSmall = await QRCode.toDataURL(
    `Invoice:${invoice.invoiceNumber}|Total:${invoice.total}`
  );

  doc.moveTo(50, 765).lineTo(545, 765).stroke();

  doc.fontSize(9);

  doc.text(
    isArabic
      ? `إنفويسلي • دمشق, سوريا • الرقم الضريبي: ${arNumbers.format(987654321)}`
      : "Invoicely • Damascus, Syria • VAT No: 123456789",
    50,
    770,
    {
      align: "center",
      features: isArabic ? ["rtla"] : [],
    }
  );

  doc.text(
    isArabic
      ? `${toReversedArabicDigits(totalPages)} من ${toReversedArabicDigits(pageNumber)} الصفحة `
      : `Page ${pageNumber} of ${totalPages}`,
    isArabic ? 50 : 480,
    770,
    {
      align: isArabic ? "left" : "right",
    }
  );

  doc.image(qrSmall, isArabic ? 520 : 50, 768, { width: 30 });
}
