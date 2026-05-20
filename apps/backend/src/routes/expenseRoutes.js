import { Router } from "express";
import { createExpense, deleteExpense, listExpenses, updateExpense } from "../controllers/expenseController.js";
import { requireAuth } from "../middleware/auth.js";

export const expenseRoutes = Router();

expenseRoutes.use(requireAuth);
expenseRoutes.get("/", listExpenses);
expenseRoutes.post("/", createExpense);
expenseRoutes.patch("/:id", updateExpense);
expenseRoutes.delete("/:id", deleteExpense);
