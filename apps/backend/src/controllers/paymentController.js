import { parseUpiMessage } from "../services/upiParser.js";

export function parseUpi(req, res) {
  res.json({ transaction: parseUpiMessage(req.body.message ?? "") });
}
