const amountPattern = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
const merchantPattern = /to\s+([a-z0-9 ._-]+)/i;
const refPattern = /(?:ref|utr)\s*([a-z0-9]+)/i;

export function parseUpiMessage(message) {
  const amount = Number((message.match(amountPattern)?.[1] ?? "0").replaceAll(",", ""));
  return {
    amount,
    merchant: message.match(merchantPattern)?.[1]?.trim() ?? "Unknown merchant",
    reference: message.match(refPattern)?.[1] ?? null,
    method: "UPI",
    category: amount > 1000 ? "Bills" : "Food"
  };
}
