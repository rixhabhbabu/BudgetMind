const hits = new Map();

export function demoRateLimit(req, _res, next) {
  const key = req.ip ?? "local";
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < 60_000);
  recent.push(now);
  hits.set(key, recent);
  if (recent.length > 120) {
    const error = new Error("Too many requests");
    error.status = 429;
    return next(error);
  }
  next();
}
