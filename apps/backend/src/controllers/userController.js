import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { httpError } from "../utils/httpError.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role ?? "user",
    profilePicture: user.profilePicture,
    monthlyIncome: user.monthlyIncome ?? 0,
    savingsTarget: user.savingsTarget ?? 30,
    monthlyBudget: user.monthlyBudget ?? 0,
    emailVerified: Boolean(user.emailVerified),
    mobileVerified: Boolean(user.mobileVerified)
  };
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, "User not found");
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, "User not found");

    const allowed = ["name", "email", "mobile", "profilePicture", "monthlyIncome", "savingsTarget", "monthlyBudget"];
    for (const field of allowed) {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    }
    await user.save();
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw httpError(404, "User not found");
    if (!(await user.verifyPassword(req.body.currentPassword ?? ""))) {
      throw httpError(400, "Current password is incorrect");
    }
    if (!req.body.newPassword || req.body.newPassword.length < 8) {
      throw httpError(400, "New password must be at least 8 characters");
    }
    user.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}
