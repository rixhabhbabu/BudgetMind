import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { createResetToken } from "../services/tokenService.js";
import { httpError } from "../utils/httpError.js";

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email, name: user.name }, env.jwtSecret, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    emailVerified: user.emailVerified,
    mobileVerified: user.mobileVerified
  };
}

function normalizeMobile(mobile) {
  return mobile ? String(mobile).replace(/[^\d+]/g, "") : undefined;
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function setSignupOtp(user) {
  const emailOtp = generateOtp();
  const mobileOtp = generateOtp();
  user.signupEmailOtpHash = await bcrypt.hash(emailOtp, 10);
  user.signupMobileOtpHash = await bcrypt.hash(mobileOtp, 10);
  user.signupOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  return { emailOtp, mobileOtp };
}

function otpResponse(user, otps) {
  return {
    requiresOtp: true,
    user: publicUser(user),
    message: "Email and mobile OTP sent for signup verification.",
    devOtps: process.env.NODE_ENV === "production" ? undefined : otps
  };
}

export async function register(req, res, next) {
  try {
    const email = String(req.body.email ?? "").toLowerCase().trim();
    const mobile = normalizeMobile(req.body.mobile);
    if (!req.body.name || !email || !mobile || !req.body.password) {
      throw httpError(400, "Name, email, mobile, and password are required");
    }

    const existing = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existing?.emailVerified && existing?.mobileVerified) {
      throw httpError(409, "Account already exists. Please sign in.");
    }
    if (existing) {
      existing.name = req.body.name;
      existing.email = email;
      existing.mobile = mobile;
      existing.passwordHash = await bcrypt.hash(req.body.password, 10);
      const otps = await setSignupOtp(existing);
      return res.status(202).json(otpResponse(existing, otps));
    }

    const user = await User.createWithPassword({ ...req.body, email, mobile });
    const otps = await setSignupOtp(user);
    res.status(201).json(otpResponse(user, otps));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const identifier = String(req.body.identifier ?? req.body.email ?? "").trim();
    const query = identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { mobile: normalizeMobile(identifier) };
    const user = await User.findOne(query);
    if (!user || !(await user.verifyPassword(req.body.password))) throw httpError(401, "Invalid email/mobile or password");
    if (!user.emailVerified || !user.mobileVerified) {
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
    const identifier = String(req.body.identifier ?? req.body.email ?? "").trim();
    const query = identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { mobile: normalizeMobile(identifier) };
    const user = await User.findOne(query);
    if (
      !user ||
      !user.signupEmailOtpHash ||
      !user.signupMobileOtpHash ||
      user.signupOtpExpiresAt < new Date()
    ) {
      throw httpError(400, "Invalid or expired OTP");
    }
    const emailOk = await bcrypt.compare(String(req.body.emailOtp ?? ""), user.signupEmailOtpHash);
    const mobileOk = await bcrypt.compare(String(req.body.mobileOtp ?? ""), user.signupMobileOtpHash);
    if (!emailOk || !mobileOk) throw httpError(400, "Invalid email or mobile OTP");

    user.emailVerified = true;
    user.mobileVerified = true;
    user.signupEmailOtpHash = undefined;
    user.signupMobileOtpHash = undefined;
    user.signupOtpExpiresAt = undefined;
    await user.save();
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function resendSignupOtp(req, res, next) {
  try {
    const identifier = String(req.body.identifier ?? req.body.email ?? "").trim();
    const query = identifier.includes("@")
      ? { email: identifier.toLowerCase() }
      : { mobile: normalizeMobile(identifier) };
    const user = await User.findOne(query);
    if (!user) throw httpError(404, "Account not found");
    if (user.emailVerified && user.mobileVerified) throw httpError(400, "Account is already verified");
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

export async function googleOAuth(req, res, next) {
  try {
    const email = req.body.email;
    const name = req.body.name ?? "Google User";
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.createWithPassword({
        name,
        email,
        password: `google-${req.body.googleId ?? Date.now()}`,
        emailVerified: true,
        mobileVerified: Boolean(req.body.mobile)
      });
      user.googleId = req.body.googleId;
      user.mobile = normalizeMobile(req.body.mobile);
      await user.save();
    }
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}
