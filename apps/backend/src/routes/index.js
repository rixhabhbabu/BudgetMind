import { aiRoutes } from "./aiRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { auditRoutes } from "./auditRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { budgetRoutes } from "./budgetRoutes.js";
import { billRoutes } from "./billRoutes.js";
import { cardRoutes } from "./cardRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { expenseRoutes } from "./expenseRoutes.js";
import { goalRoutes } from "./goalRoutes.js";
import { notificationRoutes } from "./notificationRoutes.js";
import { ocrRoutes } from "./ocrRoutes.js";
import { paymentRoutes } from "./paymentRoutes.js";
import { reportRoutes } from "./reportRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { upiRoutes } from "./upiRoutes.js";

export function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/budgets", budgetRoutes);
  app.use("/api/goals", goalRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/upi", upiRoutes);
  app.use("/api/cards", cardRoutes);
  app.use("/api/ocr", ocrRoutes);
  app.use("/api/bills", billRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/audit", auditRoutes);
}
