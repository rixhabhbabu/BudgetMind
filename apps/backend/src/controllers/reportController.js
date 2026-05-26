import PDFDocument from "pdfkit";
import { User } from "../models/User.js";
import { Expense } from "../models/Expense.js";
import { AIReport } from "../models/AIReport.js";

export async function exportReport(req, res) {
  try {
    const userId = req.user._id;
    
    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get current month's expenses
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.find({
      userId,
      spentAt: { $gte: monthStart, $lte: monthEnd }
    }).sort({ spentAt: -1 });

    // Calculate statistics
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categorySpending = {};
    expenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const savingsRate = user.monthlyIncome ? ((user.monthlyIncome - totalSpent) / user.monthlyIncome * 100).toFixed(2) : 0;
    const budgetUsedPercent = user.monthlyBudget ? (totalSpent / user.monthlyBudget * 100).toFixed(2) : 0;
    const budgetRemaining = user.monthlyBudget ? (user.monthlyBudget - totalSpent).toFixed(2) : 0;

    // Get AI insights
    const aiReport = await AIReport.findOne({ userId }).sort({ generatedAt: -1 });

    // Create PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=budget-report-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(28).font("Helvetica-Bold").text("BudgetMind", 40, 40);
    doc.fontSize(12).font("Helvetica").text("Monthly Financial Report", 40, 72);
    doc.moveTo(40, 92).lineTo(555, 92).stroke();
    
    // Report period
    const monthName = monthStart.toLocaleString('default', { month: 'long', year: 'numeric' });
    doc.fontSize(11).text(`Report Period: ${monthName}`, 40, 105);
    doc.fontSize(11).text(`Generated: ${now.toLocaleDateString()}`, 40, 120);

    // User Info
    doc.moveDown();
    doc.fontSize(14).font("Helvetica-Bold").text("Account Holder", 40, 150);
    doc.fontSize(11).font("Helvetica").text(`Name: ${user.name}`, 40, 170);
    doc.fontSize(11).text(`Email: ${user.email}`, 40, 185);
    doc.fontSize(11).text(`Financial Score: ${user.financialScore}`, 40, 200);

    // Key Metrics - Box Layout
    doc.fontSize(14).font("Helvetica-Bold").text("Key Metrics", 40, 230);
    
    const metrics = [
      { label: "Total Spent", value: `₹${totalSpent.toFixed(2)}`, color: "#FF6B6B" },
      { label: "Budget Limit", value: `₹${user.monthlyBudget || 0}`, color: "#4ECDC4" },
      { label: "Budget Used", value: `${budgetUsedPercent}%`, color: "#45B7D1" },
      { label: "Savings Rate", value: `${savingsRate}%`, color: "#96CEB4" }
    ];

    let xPos = 40;
    metrics.forEach((metric, idx) => {
      const boxWidth = 120;
      const boxHeight = 60;
      doc.rect(xPos, 260, boxWidth, boxHeight).fillColor(metric.color).fill();
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#FFFFFF").text(metric.label, xPos + 5, 275, { width: boxWidth - 10 });
      doc.font("Helvetica-Bold").fontSize(16).text(metric.value, xPos + 5, 295, { width: boxWidth - 10 });
      xPos += boxWidth + 10;
    });

    doc.fillColor("#000000");
    doc.moveDown(6);

    // Top Spending Categories
    doc.fontSize(14).font("Helvetica-Bold").text("Top Spending Categories", 40, 360);
    
    const tableTop = 385;
    const colWidth = 200;
    const rowHeight = 25;

    // Table Header
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc.rect(40, tableTop, colWidth, rowHeight).fillColor("#2C3E50").fill();
    doc.text("Category", 50, tableTop + 6);
    doc.rect(40 + colWidth, tableTop, colWidth, rowHeight).fillColor("#2C3E50").fill();
    doc.text("Amount", 50 + colWidth, tableTop + 6);

    // Table Rows
    doc.font("Helvetica").fontSize(10).fillColor("#000000");
    topCategories.forEach((item, idx) => {
      const y = tableTop + rowHeight + (idx * rowHeight);
      const bgColor = idx % 2 === 0 ? "#F5F5F5" : "#FFFFFF";
      doc.rect(40, y, colWidth, rowHeight).fillColor(bgColor).fill();
      doc.rect(40 + colWidth, y, colWidth, rowHeight).fillColor(bgColor).fill();
      doc.fillColor("#000000").text(item.category, 50, y + 6);
      doc.text(`₹${item.amount.toFixed(2)}`, 50 + colWidth, y + 6);
    });

    // Recent Transactions
    doc.moveDown(8);
    doc.fontSize(14).font("Helvetica-Bold").text("Recent Transactions", 40);
    doc.moveDown(0.5);

    const recentExpenses = expenses.slice(0, 10);
    recentExpenses.forEach(exp => {
      const date = new Date(exp.spentAt).toLocaleDateString();
      doc.fontSize(10).font("Helvetica").text(`${date} • ${exp.merchant}`, 40);
      doc.fontSize(9).text(`${exp.category} (${exp.method}) - ₹${exp.amount.toFixed(2)}`, 50, { indent: 10 });
    });

    // AI Insights
    if (aiReport) {
      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("AI Insights & Recommendations", 40, 40);
      doc.moveDown();

      if (aiReport.topSpendingCategory) {
        doc.fontSize(11).font("Helvetica").text(`Top Spending Category: ${aiReport.topSpendingCategory}`, 40);
      }

      if (aiReport.prediction?.nextMonthSpend) {
        doc.fontSize(11).text(`Predicted Next Month Spending: ₹${aiReport.prediction.nextMonthSpend.toFixed(2)}`, 40);
      }

      if (aiReport.savingsPotential) {
        doc.fontSize(11).text(`Savings Potential: ₹${aiReport.savingsPotential.toFixed(2)}`, 40);
      }

      doc.moveDown();
      doc.fontSize(12).font("Helvetica-Bold").text("Recommendations:", 40);
      
      if (aiReport.recommendations && aiReport.recommendations.length > 0) {
        aiReport.recommendations.forEach((rec, idx) => {
          doc.fontSize(10).font("Helvetica").text(`${idx + 1}. ${rec}`, 40, { indent: 20 });
        });
      }
    }

    // Footer
    doc.fontSize(9).fillColor("#999999").text("This report was generated by BudgetMind. Keep your financial data safe.", 40, doc.page.height - 40, { align: "center" });

    doc.end();
  } catch (error) {
    console.error("PDF Export Error:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
}
