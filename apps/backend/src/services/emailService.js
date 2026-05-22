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
