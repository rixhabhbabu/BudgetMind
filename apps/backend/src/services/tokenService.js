import crypto from "node:crypto";

export function createResetToken() {
  return {
    token: crypto.randomBytes(24).toString("hex"),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000)
  };
}
