import { AuditLog } from "../models/AuditLog.js";
import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

function riskFromSpend(spend, monthlyBudget) {
  if (!monthlyBudget) return spend > 50000 ? "Medium" : "Low";
  const usage = spend / monthlyBudget;
  if (usage >= 1) return "High";
  if (usage >= 0.8) return "Medium";
  return "Low";
}

function publicAdminUser(user, spend = 0) {
  const status = user.emailVerified ? "Verified" : "Pending OTP";
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role ?? "user",
    status,
    monthlyBudget: user.monthlyBudget ?? 0,
    monthlyIncome: user.monthlyIncome ?? 0,
    monthlySpend: spend,
    risk: riskFromSpend(spend, user.monthlyBudget)
  };
}

export async function getAdminOverview(_req, res, next) {
  try {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [users, spendByUser, budgets, notifications, auditLogs] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).limit(100),
      Expense.aggregate([
        { $match: { spentAt: { $gte: monthStart } } },
        { $group: { _id: "$userId", monthlySpend: { $sum: "$amount" } } }
      ]),
      Budget.find({}),
      Notification.find({}).sort({ createdAt: -1 }).limit(25).populate("userId", "name email"),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(25).populate("userId", "name email")
    ]);

    const spendMap = new Map(spendByUser.map((item) => [String(item._id), item.monthlySpend]));
    const userRows = users.map((user) => publicAdminUser(user, spendMap.get(String(user._id)) ?? 0));
    const riskAlerts = userRows.filter((user) => user.risk !== "Low").length;
    const highRisk = userRows.filter((user) => user.risk === "High").length;
    const verified = userRows.filter((user) => user.status === "Verified").length;
    const budgetRisk = budgets.filter((budget) => budget.limit && budget.spent / budget.limit >= budget.alertThreshold).length;
    const unreadNotifications = notifications.filter((item) => !item.readAt).length;

    res.json({
      metrics: {
        totalUsers: await User.countDocuments(),
        verifiedUsers: verified,
        riskAlerts: riskAlerts + budgetRisk + unreadNotifications,
        highRisk
      },
      users: userRows,
      alerts: notifications.map((item) => ({
        id: item._id,
        title: item.title,
        detail: item.message,
        level: item.type === "security" ? "High" : item.type === "bill" ? "Medium" : "Low",
        user: item.userId?.name ?? "Unknown user",
        createdAt: item.createdAt,
        readAt: item.readAt
      })),
      activity: auditLogs.map((log) => ({
        id: log._id,
        action: log.action,
        entity: log.entity,
        user: log.userId?.name ?? "Unknown user",
        createdAt: log.createdAt
      })),
      health: [
        { service: "Backend API", status: "Online", detail: "Express routes responding" },
        { service: "Database", status: "Online", detail: `${userRows.length} users loaded in overview` },
        { service: "Notifications", status: unreadNotifications ? "Warning" : "Online", detail: `${unreadNotifications} unread alerts` },
        { service: "Budgets", status: budgetRisk ? "Warning" : "Online", detail: `${budgetRisk} budgets at risk` }
      ]
    });
  } catch (error) {
    next(error);
  }
}
