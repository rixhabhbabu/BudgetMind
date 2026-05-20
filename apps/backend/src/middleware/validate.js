import { httpError } from "../utils/httpError.js";

export function requireFields(...fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === "");
    if (missing.length) return next(httpError(400, `Missing required fields: ${missing.join(", ")}`));
    next();
  };
}
