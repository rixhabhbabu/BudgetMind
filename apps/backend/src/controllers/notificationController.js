import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";

export async function listNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { readAt: new Date() }, { new: true });
    res.json({ notification });
  } catch (error) {
    next(error);
  }
}

export async function getNotificationPreferences(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      preferences: user.notificationPreferences || {
        budgetAlerts: true,
        expenseNotifications: false,
        weeklyReports: true,
        alertThreshold: 80
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateNotificationPreferences(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { notificationPreferences: req.body },
      { new: true }
    );
    
    res.json({
      message: "Notification preferences updated",
      preferences: user.notificationPreferences
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleBudgetAlerts(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const prefs = user.notificationPreferences || {};
    prefs.budgetAlerts = !prefs.budgetAlerts;
    
    await User.findByIdAndUpdate(req.user.id, { notificationPreferences: prefs });
    
    res.json({
      message: `Budget alerts ${prefs.budgetAlerts ? 'enabled' : 'disabled'}`,
      budgetAlerts: prefs.budgetAlerts
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleExpenseNotifications(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const prefs = user.notificationPreferences || {};
    prefs.expenseNotifications = !prefs.expenseNotifications;
    
    await User.findByIdAndUpdate(req.user.id, { notificationPreferences: prefs });
    
    res.json({
      message: `Expense notifications ${prefs.expenseNotifications ? 'enabled' : 'disabled'}`,
      expenseNotifications: prefs.expenseNotifications
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAlertThreshold(req, res, next) {
  try {
    const { threshold } = req.body;
    
    if (threshold < 0 || threshold > 100) {
      return res.status(400).json({ error: "Threshold must be between 0 and 100" });
    }
    
    const user = await User.findById(req.user.id);
    const prefs = user.notificationPreferences || {};
    prefs.alertThreshold = threshold;
    
    await User.findByIdAndUpdate(req.user.id, { notificationPreferences: prefs });
    
    res.json({
      message: `Alert threshold updated to ${threshold}%`,
      alertThreshold: threshold
    });
  } catch (error) {
    next(error);
  }
}
