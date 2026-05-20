import { connectDatabase } from "../config/db.js";
import { Expense } from "../models/Expense.js";

await connectDatabase();
await Expense.create([
  { merchant: "Swiggy", category: "Food", amount: 620, method: "UPI" },
  { merchant: "Netflix", category: "Subscriptions", amount: 649, method: "Card" }
]);
console.log("Seeded demo expenses");
process.exit(0);
