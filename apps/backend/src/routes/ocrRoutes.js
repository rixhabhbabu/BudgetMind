import { Router } from "express";
import multer from "multer";
import { scanReceipt } from "../controllers/ocrController.js";
import { requireAuth } from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
export const ocrRoutes = Router();

ocrRoutes.post("/receipt", requireAuth, upload.single("receipt"), scanReceipt);
