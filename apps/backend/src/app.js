import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { registerRoutes } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_, res) => res.json({ status: "ok", service: "budgetmind-api" }));
app.get("/api/dashboard", (_, res) => res.json({ monthlySpend: 38600, savingsRate: 31, financialScore: 786 }));

registerRoutes(app);
app.use(errorHandler);
