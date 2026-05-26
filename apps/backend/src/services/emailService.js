import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function hasSmtpConfig() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.smtpFrom);
}

export async function sendSignupOtp(email, otp) {
  if (!hasSmtpConfig()) {
    console.warn("SMTP not configured. Signup OTP is available as devOtp in the API response.");
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: "Your BudgetMind signup OTP",
    text: `Your BudgetMind OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your BudgetMind OTP is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`
  });

  return { sent: true };
}

export async function sendBudgetAlert(email, name, spent, budget, percentage) {
  if (!hasSmtpConfig()) {
    console.warn("SMTP not configured. Budget alert not sent.");
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: `⚠️ Budget Alert - ${percentage}% Used`,
    html: `
      <h2>Budget Alert</h2>
      <p>Hi ${name},</p>
      <p>Your monthly budget is now <strong>${percentage}% used</strong>!</p>
      <p>
        <strong>Spent:</strong> ₹${spent.toLocaleString()}<br/>
        <strong>Budget Limit:</strong> ₹${budget.toLocaleString()}
      </p>
      <p>Be careful with your spending for the rest of the month.</p>
      <p><a href="${env.clientOrigin}/expenses" style="background: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Expenses</a></p>
    `
  });

  return { sent: true };
}

export async function sendExpenseNotification(email, name, expense) {
  if (!hasSmtpConfig()) {
    console.warn("SMTP not configured. Expense notification not sent.");
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: `💰 Expense Added - ₹${expense.amount}`,
    html: `
      <h2>New Expense Added</h2>
      <p>Hi ${name},</p>
      <p>A new expense has been recorded:</p>
      <p>
        <strong>Amount:</strong> ₹${expense.amount.toLocaleString()}<br/>
        <strong>Category:</strong> ${expense.category}<br/>
        <strong>Date:</strong> ${new Date(expense.spentAt || Date.now()).toLocaleDateString()}
      </p>
      ${expense.description ? `<p><strong>Description:</strong> ${expense.description}</p>` : ''}
      <p><a href="${env.clientOrigin}/expenses" style="background: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View All Expenses</a></p>
    `
  });

  return { sent: true };
}

export async function sendWeeklyReport(email, name, expenses, totalSpent, topCategory) {
  if (!hasSmtpConfig()) {
    console.warn("SMTP not configured. Weekly report not sent.");
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  await transporter.sendMail({
    from: env.smtpFrom,
    to: email,
    subject: `📊 Your Weekly Spending Report`,
    html: `
      <h2>Weekly Spending Report</h2>
      <p>Hi ${name},</p>
      <p>Here's your spending summary for this week:</p>
      <p>
        <strong>Total Spent:</strong> ₹${totalSpent.toLocaleString()}<br/>
        <strong>Transactions:</strong> ${expenses.length}<br/>
        <strong>Top Category:</strong> ${topCategory}
      </p>
      <p><a href="${env.clientOrigin}/insights" style="background: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Detailed Analysis</a></p>
    `
  });

  return { sent: true };
}
