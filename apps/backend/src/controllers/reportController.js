import PDFDocument from "pdfkit";

export function exportReport(_req, res) {
  const doc = new PDFDocument({ margin: 48 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=budgetmind-report.pdf");
  doc.pipe(res);
  doc.fontSize(24).text("BudgetMind Monthly Report");
  doc.moveDown().fontSize(12).text("Financial score: 786");
  doc.text("Savings rate: 31%");
  doc.text("Recommended action: reduce discretionary food spend.");
  doc.end();
}
