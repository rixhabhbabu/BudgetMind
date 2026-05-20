import crypto from "node:crypto";
import { env } from "../config/env.js";

function key() {
  return crypto.createHash("sha256").update(env.encryptionKey).digest();
}

export function encryptText(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function maskCardNumber(number) {
  const digits = String(number).replace(/\D/g, "");
  return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`;
}

export function tokenizeCardNumber(number) {
  return crypto.createHash("sha256").update(`${number}:${env.encryptionKey}`).digest("hex");
}
