import { Expense } from "../models/Expense.js";
import { User } from "../models/User.js";
import { sendBudgetAlert, sendExpenseNotification } from "../services/emailService.js";
import { emitExpenseNotification, emitBudgetAlert } from "../services/socketService.js";

export async function listExpenses(req, res, next) {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ spentAt: -1 }).limit(100);
    res.json({ expenses });
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    
    // Send expense notification if enabled
    if (user.notificationPreferences?.expenseNotifications) {
      await sendExpenseNotification(user.email, user.name, expense);
    }
    
    // Emit real-time expense notification
    emitExpenseNotification(user._id.toString(), expense);
    
    // Check budget and send alert if needed
    if (user.notificationPreferences?.budgetAlerts) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const monthlyExpenses = await Expense.aggregate([
        {
          $match: {
            userId: user._id,
            spentAt: { $gte: startOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);
      
      const monthlySpent = monthlyExpenses[0]?.total || 0;
      const budgetLimit = user.monthlyBudget || 70000;
      const percentage = Math.round((monthlySpent / budgetLimit) * 100);
      const threshold = user.notificationPreferences?.alertThreshold || 80;
      
      // Send alert if crossed threshold
      if (percentage >= threshold && percentage < (threshold + 5)) {
        await sendBudgetAlert(user.email, user.name, monthlySpent, budgetLimit, percentage);
        
        // Emit real-time budget alert
        emitBudgetAlert(user._id.toString(), {
          spent: monthlySpent,
          budget: budgetLimit,
          percentage: percentage,
          remaining: budgetLimit - monthlySpent
        });
      }
    }
    
    res.status(201).json({ expense });
  } catch (error) {
    next(error);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    res.json({ expense });
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    await Expense.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
