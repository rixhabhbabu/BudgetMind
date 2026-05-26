import { Router } from "express";
import {
  listNotifications,
  markNotificationRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  toggleBudgetAlerts,
  toggleExpenseNotifications,
  updateAlertThreshold
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);

// Existing endpoints
notificationRoutes.get("/", listNotifications);
notificationRoutes.patch("/:id/read", markNotificationRead);

// New preferences endpoints
notificationRoutes.get("/preferences/get", getNotificationPreferences);
notificationRoutes.patch("/preferences/update", updateNotificationPreferences);
notificationRoutes.patch("/preferences/budget-alerts/toggle", toggleBudgetAlerts);
notificationRoutes.patch("/preferences/expense-notifications/toggle", toggleExpenseNotifications);
notificationRoutes.patch("/preferences/threshold", updateAlertThreshold);
