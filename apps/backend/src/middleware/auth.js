import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

export function requireAuth(req, _res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next(httpError(401, "Authentication token required"));
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(httpError(401, "Invalid or expired token"));
  }
}
