import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { firebaseAuth as firebase } from "../config/firebase.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createResetToken } from "../services/tokenService.js";
import { sendSignupOtp } from "../services/emailService.js";
import { httpError } from "../utils/httpError.js";

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role ?? "user" }, env.jwtSecret, { expiresIn: "7d" });
}

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

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function setSignupOtp(user) {
  const emailOtp = generateOtp();
  user.signupEmailOtpHash = await bcrypt.hash(emailOtp, 10);
  user.signupOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  const delivery = await sendSignupOtp(user.email, emailOtp);
  return { emailOtp, sent: delivery.sent };
}

function otpResponse(user, otpResult) {
  return {
    requiresOtp: true,
    user: publicUser(user),
    message: otpResult.sent ? "Email OTP sent for signup verification." : "Email OTP generated. Configure SMTP to send it by email.",
    devOtp: process.env.NODE_ENV === "production" || otpResult.sent ? undefined : otpResult.emailOtp
  };
}

export async function register(req, res, next) {
  try {
    const email = String(req.body.email ?? "").toLowerCase().trim();
    if (!req.body.name || !email || !req.body.password) {
      throw httpError(400, "Name, email, and password are required");
    }
    const existing = await User.findOne({ email });
    if (existing?.emailVerified) {
      throw httpError(409, "Account already exists. Please sign in.");
    }
    if (existing) {
      existing.name = req.body.name;
      existing.email = email;
      existing.role = existing.role ?? "user";
      existing.passwordHash = await bcrypt.hash(req.body.password, 10);
      const otps = await setSignupOtp(existing);
      return res.status(202).json(otpResponse(existing, otps));
    }
    const user = await User.createWithPassword({ ...req.body, email, role: "user" });
    const otps = await setSignupOtp(user);
    res.status(201).json(otpResponse(user, otps));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.identifier ?? req.body.email ?? "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(req.body.password))) throw httpError(401, "Invalid email or password");
    if (!user.role) {
      user.role = "user";
      await user.save();
    }
    if (user.signupEmailOtpHash && !user.emailVerified) {
      const otps = await setSignupOtp(user);
      return res.status(403).json(otpResponse(user, otps));
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function verifySignupOtp(req, res, next) {
  try {
    const email = String(req.body.identifier ?? req.body.email ?? "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user || !user.signupEmailOtpHash || user.signupOtpExpiresAt < new Date()) {
      throw httpError(400, "Invalid or expired OTP");
    }
    const emailOk = await bcrypt.compare(String(req.body.emailOtp ?? ""), user.signupEmailOtpHash);
    if (!emailOk) throw httpError(400, "Invalid email OTP");

    user.emailVerified = true;
    user.signupEmailOtpHash = undefined;
    user.signupOtpExpiresAt = undefined;
    await user.save();
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function resendSignupOtp(req, res, next) {
  try {
    const email = String(req.body.identifier ?? req.body.email ?? "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) throw httpError(404, "Account not found");
    if (user.emailVerified) throw httpError(400, "Account is already verified");
    const otps = await setSignupOtp(user);
    res.json(otpResponse(user, otps));
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

export async function firebaseAuth(req, res, next) {
  try {
    const { token } = req.body;

    if (!token) {
      throw httpError(400, "Firebase token is required");
    }

    // Verify token with Firebase
    const decodedToken = await firebase.verifyIdToken(token);
    
    const email = decodedToken.email;
    const name = decodedToken.name || "Firebase User";
    const firebaseUid = decodedToken.uid;
    const profilePicture = decodedToken.picture;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Firebase
      user = await User.createWithPassword({
        name,
        email,
        password: `firebase-${firebaseUid}`,
        emailVerified: true,
        profilePicture
      });
      user.firebaseUid = firebaseUid;
      await user.save();
    } else if (!user.firebaseUid) {
      // Link Firebase UID to existing user
      user.firebaseUid = firebaseUid;
      if (!user.profilePicture) user.profilePicture = profilePicture;
      await user.save();
    }

    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
