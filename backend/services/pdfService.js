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

  const titleSafe = session.title ? session.title.replace(/[^a-zA-Z0-9]/g, "_") : "Study_Notes";

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${titleSafe}.pdf"`
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
    .fontSize(14)
    .fillColor("#1e293b")
    .text("Problem Statement", {
      underline: true,
    });

  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .fillColor("black")
    .text(session.prompt || "No problem statement provided.");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(14)
    .fillColor("#1e293b")
    .text("Programming Language", {
      underline: true,
    });

  doc.moveDown(0.5);

  doc
    .fontSize(11)
    .fillColor("black")
    .text(session.language || "Not specified");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(14)
    .fillColor("#1e293b")
    .text("Generated Code", {
      underline: true,
    });

  doc.moveDown(0.5);

  doc
    .font("Courier")
    .fontSize(9)
    .text(session.generatedCode || "No generated code available.");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("#1e293b")
    .text("Optimized Code", {
      underline: true,
    });

  doc.moveDown(0.5);

  doc
    .font("Courier")
    .fontSize(9)
    .text(session.optimizedCode || "No optimized code available.");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("#1e293b")
    .text("Study Notes & Explanations", {
      underline: true,
    });

  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("black")
    .text(session.studyNotes || "No study notes generated yet.");

  doc.moveDown();

  /* ----------------------------- */

  doc
    .fontSize(10)
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