import { extractReceipt } from "../services/ocrService.js";

export async function scanReceipt(_req, res) {
  res.json({ bill: await extractReceipt() });
}
