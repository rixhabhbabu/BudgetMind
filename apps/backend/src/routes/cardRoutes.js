import { Router } from "express";
import { createCard, listCards, listCardTransactions } from "../controllers/cardController.js";
import { requireAuth } from "../middleware/auth.js";

export const cardRoutes = Router();

cardRoutes.use(requireAuth);
cardRoutes.get("/", listCards);
cardRoutes.get("/transactions", listCardTransactions);
cardRoutes.post("/", createCard);
cardRoutes.post("/add", createCard);
