import { httpError } from "../utils/httpError.js";

export function requireAdmin(req, _res, next) {
  if (req.user?.role !== "admin") return next(httpError(403, "Admin access required"));
  next();
}
