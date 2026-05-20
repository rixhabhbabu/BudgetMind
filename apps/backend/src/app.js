import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { demoRateLimit } from "./middleware/rateLimit.js";
import { sanitizeInput } from "./middleware/security.js";
import { registerRoutes } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(demoRateLimit);
app.use(sanitizeInput);

app.get("/health", (_, res) => res.json({ status: "ok", service: "budgetmind-api" }));
registerRoutes(app);
app.use(errorHandler);
