import { Router } from "express";
import multer from "multer";
import { createExpenseFromBill, listBills, uploadBill } from "../controllers/billController.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
export const billRoutes = Router();

billRoutes.use(requireAuth);
billRoutes.get("/", listBills);
billRoutes.post("/upload", upload.single("receipt"), uploadBill);
billRoutes.post("/:id/expense", createExpenseFromBill);
