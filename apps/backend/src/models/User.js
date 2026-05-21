import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, unique: true, sparse: true, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profilePicture: String,
  passwordHash: { type: String, required: true },
  encryptedUpiId: String,
  monthlyIncome: { type: Number, default: 0 },
  savingsTarget: { type: Number, default: 30 },
  monthlyBudget: { type: Number, default: 0 },
  financialScore: { type: Number, default: 650 },
  googleId: String,
  emailVerified: { type: Boolean, default: false },
  mobileVerified: { type: Boolean, default: false },
  signupEmailOtpHash: String,
  signupMobileOtpHash: String,
  signupOtpExpiresAt: Date,
  resetToken: String,
  resetTokenExpiresAt: Date
}, { timestamps: true });

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createWithPassword = async function createWithPassword(payload) {
  return this.create({
    name: payload.name,
    email: payload.email,
    mobile: payload.mobile,
    role: payload.role ?? "user",
    profilePicture: payload.profilePicture,
    passwordHash: await bcrypt.hash(payload.password, 10),
    emailVerified: Boolean(payload.emailVerified),
    mobileVerified: Boolean(payload.mobileVerified)
  });
};

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
