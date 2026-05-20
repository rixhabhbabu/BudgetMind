import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createResetToken } from "../services/tokenService.js";
import { httpError } from "../utils/httpError.js";

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, env.jwtSecret, { expiresIn: "7d" });
}

export async function register(req, res, next) {
  try {
    const user = await User.createWithPassword(req.body);
    res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.verifyPassword(req.body.password))) throw httpError(401, "Invalid email or password");
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const reset = createResetToken();
      user.resetToken = reset.token;
      user.resetTokenExpiresAt = reset.expiresAt;
      await user.save();
    }
    res.json({ message: "If the email exists, a reset link has been generated." });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const user = await User.findOne({ resetToken: req.body.token, resetTokenExpiresAt: { $gt: new Date() } });
    if (!user) throw httpError(400, "Invalid or expired reset token");
    user.passwordHash = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
}

export async function googleOAuth(req, res, next) {
  try {
    const email = req.body.email;
    const name = req.body.name ?? "Google User";
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.createWithPassword({ name, email, password: `google-${req.body.googleId ?? Date.now()}` });
      user.googleId = req.body.googleId;
      await user.save();
    }
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
}
