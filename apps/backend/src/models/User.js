import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  encryptedUpiId: String,
  monthlyBudget: { type: Number, default: 0 },
  financialScore: { type: Number, default: 650 },
  googleId: String,
  resetToken: String,
  resetTokenExpiresAt: Date
}, { timestamps: true });

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.createWithPassword = async function createWithPassword(payload) {
  return this.create({ name: payload.name, email: payload.email, passwordHash: await bcrypt.hash(payload.password, 10) });
};

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
