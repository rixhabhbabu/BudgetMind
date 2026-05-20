const merchants = [
  ["Swiggy", "Food"],
  ["Myntra", "Shopping"],
  ["Uber", "Travel"],
  ["Netflix", "Subscriptions"],
  ["Apollo Pharmacy", "Health"],
  ["BYJU'S", "Education"],
  ["Zerodha", "Investments"],
  ["BSES Rajdhani", "Bills"]
];

export function generateMockTransactions(source = "Google Pay", count = 12) {
  return Array.from({ length: count }, (_, index) => {
    const [merchant, category] = merchants[index % merchants.length];
    return {
      transactionType: "debit",
      paymentSource: source.includes("Card") ? "Card" : "UPI",
      amount: 199 + index * 137,
      category,
      merchant,
      reference: `${source.replace(/\s/g, "").toUpperCase()}-${Date.now()}-${index}`,
      timestamp: new Date(Date.now() - index * 86_400_000)
    };
  });
}
