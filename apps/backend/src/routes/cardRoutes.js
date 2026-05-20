import { Router } from "express";
import { createCard, listCards } from "../controllers/cardController.js";
import { requireAuth } from "../middleware/auth.js";

export const cardRoutes = Router();

cardRoutes.use(requireAuth);
cardRoutes.get("/", listCards);
cardRoutes.post("/", createCard);
