import { aiRoutes } from "./aiRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { cardRoutes } from "./cardRoutes.js";
import { expenseRoutes } from "./expenseRoutes.js";
import { ocrRoutes } from "./ocrRoutes.js";
import { paymentRoutes } from "./paymentRoutes.js";
import { reportRoutes } from "./reportRoutes.js";
import { userRoutes } from "./userRoutes.js";

export function registerRoutes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/expenses", expenseRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/cards", cardRoutes);
  app.use("/api/ocr", ocrRoutes);
  app.use("/api/reports", reportRoutes);
}
