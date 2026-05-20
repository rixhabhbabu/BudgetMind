const dangerousKeys = new Set(["$where", "$ne", "$gt", "$gte", "$lt", "$lte", "$regex"]);

function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== "object") {
    return typeof value === "string" ? value.replace(/[<>]/g, "") : value;
  }
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.startsWith("$") && !dangerousKeys.has(key))
      .map(([key, nested]) => [key.replaceAll(".", ""), clean(nested)])
  );
}

export function sanitizeInput(req, _res, next) {
  req.body = clean(req.body);
  req.query = clean(req.query);
  req.params = clean(req.params);
  next();
}
