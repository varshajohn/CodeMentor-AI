const PDFDocument = require("pdfkit");

const generatePDF = (session, res) => {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${session.title}.pdf"`
  );

  doc.pipe(res);

  /* ----------------------------- */

  doc
    .fontSize(24)
    .fillColor("#2563eb")
    .text("CodeMentor AI", {
      align: "center",
    });

  doc.moveDown();

  doc
    .fontSize(18)
    .fillColor("black")
    .text("Study Notes");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(15)
    .text("Problem Statement", {
      underline: true,
    });

  doc
    .fontSize(12)
    .text(session.prompt);

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(15)
    .text("Programming Language", {
      underline: true,
    });

  doc
    .fontSize(12)
    .text(session.language);

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(15)
    .text("Generated Code", {
      underline: true,
    });

  doc
    .font("Courier")
    .fontSize(10)
    .text(session.generatedCode);

  doc.moveDown();

  /* ----------------------------- */

  doc
    .font("Helvetica")
    .fontSize(15)
    .text("Optimized Code", {
      underline: true,
    });

  doc
    .font("Courier")
    .fontSize(10)
    .text(session.optimizedCode);

  doc.moveDown();

  /* ----------------------------- */

  doc
    .font("Helvetica")
    .fontSize(15)
    .text("Study Notes", {
      underline: true,
    });

  doc
    .font("Helvetica")
    .fontSize(12)
    .text(session.studyNotes);

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(11)
    .fillColor("gray")
    .text(
      "Generated using CodeMentor AI",
      {
        align: "center",
      }
    );

  doc.end();
};

module.exports = generatePDF;