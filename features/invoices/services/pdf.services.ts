import PDFDocument from "pdfkit";
import PdfTable from "voilab-pdf-table";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

import { InvoicePDFData } from "@/features/invoices/invoice.types";

const PAGE_TOP = 120;
const PAGE_BOTTOM = 740;
const PAGE_MARGIN = 50;

export async function generateInvoicePDF(
  invoice: InvoicePDFData
): Promise<Buffer> {
  const fontRegular = path.join(
    process.cwd(),
    "public/fonts/Inter-Regular.ttf"
  );
  const fontBold = path.join(process.cwd(), "public/fonts/Inter-Bold.ttf");

  const doc = new PDFDocument({
    size: "A4",
    margin: PAGE_MARGIN,
    bufferPages: true,
    font: fontRegular,
  });

  doc.registerFont("Inter-Bold", fontBold);

  const table = new PdfTable(doc, {
    bottomMargin: 30,
  });

  const chunks: Uint8Array[] = [];
  doc.on("data", chunks.push.bind(chunks));

  doc.on("pageAdded", () => {
    drawHeader(doc);
    doc.y = PAGE_TOP;
  });

  drawHeader(doc);
  doc.y = PAGE_TOP;

  doc
    .fontSize(12)
    .text(`Invoice # ${invoice.invoiceNumber}`, {
      align: "left",
      stroke: true,
      characterSpacing: 0.5,
    })
    .fontSize(10)
    .moveDown()
    .text(`Issue At: ${invoice.issueAt}`)
    .text(`Due At: ${invoice.dueAt}`)
    .moveDown(2);

  doc
    .fontSize(11)
    .text(`Bill To:`, { underline: true })
    .fontSize(10)
    .text(invoice.customer.name)
    .text(invoice.customer.address ?? "")
    .text(invoice.customer.email ?? "")
    .moveDown(2);

  doc.fontSize(11).text("Products:", { underline: true }).moveDown();

  doc.fontSize(11);

  table
    .addPlugin(
      new (require("voilab-pdf-table/plugins/fitcolumn"))({
        column: "name",
      })
    )
    .setColumnsDefaults({
      headerBorder: "BLRT",
      align: "right",
    })
    .addColumns([
      {
        id: "name",
        header: "Product",
        align: "left",
        border: "BLR",
        indent: 3,
        headerFill: true,
      },
      {
        id: "quantity",
        header: "Quantity",
        width: 100,
        border: "BLR",
        align: "center",
        headerFill: true,
      },
      {
        id: "price",
        header: "Price ($)",
        width: 100,
        border: "BLR",
        align: "center",
        headerFill: true,
      },
      {
        id: "total",
        header: "Total ($)",
        width: 100,
        border: "BLR",
        align: "center",
        headerFill: true,
      },
    ])
    .onHeaderAdd((t) => {
      t.pdf.font("Inter-Bold").fontSize(12);
    })
    .onHeaderAdded((t) => {
      t.pdf.font("Inter-Regular").fontSize(12);
    })
    .onCellBackgroundAdd((t) => {
      t.pdf.fill("#ccc");
    })
    .onCellBackgroundAdded((t) => t.pdf.fill("#000"))
    .onPageAdded(function (tb) {
      tb.pdf.fontSize(10);
      tb.addHeader();
    });

  const tableBody = invoice.products.map((prod) => {
    return {
      name: prod.name,
      quantity: prod.quantity.toFixed(2),
      price: prod.unitPrice.toFixed(2),
      total: (prod.quantity * prod.unitPrice).toFixed(2),
    };
  });

  table.addBody(tableBody);

  doc
    .fontSize(11)
    .moveDown(1)
    .text(`Total: ${invoice.currency} ${invoice.total.toFixed(2)}`, 50, doc.y, {
      align: "right",
      stroke: true,
    });

  if (doc.y > PAGE_BOTTOM - 80) {
    doc.fontSize(10);
    doc.addPage();
  }

  const qrData = `Invoice:${invoice.invoiceNumber}|Total:${invoice.total}`;
  const qrBig = await QRCode.toDataURL(qrData);

  if (doc.y > PAGE_BOTTOM - 150) {
    doc.fontSize(10);
    doc.addPage();
  }

  doc.image(qrBig, 40, doc.y, {
    width: 100,
    align: "center",
  });

  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    await drawFooter(doc, i + 1, range.count, invoice);
  }

  doc.end();

  return await new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

function drawHeader(doc: typeof PDFDocument) {
  const logoPath = path.join(process.cwd(), "public/logos/logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 50 });
  }

  doc.fontSize(20).text("INVOICE", { align: "right" });
}

async function drawFooter(
  doc: PDFKit.PDFDocument,
  pageNumber: number,
  totalPages: number,
  invoice: InvoicePDFData
) {
  const qrSmall = await QRCode.toDataURL(
    `Invoice:${invoice.invoiceNumber}|Total:${invoice.total}`
  );

  doc.moveTo(50, 760).lineTo(545, 760).stroke();

  doc.fontSize(9);

  doc.text("Invoicely • Damascus, Syria • VAT No: 123456789", 50, 770, {
    align: "center",
  });

  doc.text(`Page ${pageNumber} of ${totalPages}`, 50, 770, {
    align: "right",
  });

  doc.image(qrSmall, 50, 768, { width: 30 });
}
