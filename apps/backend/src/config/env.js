import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/budgetmind",
  jwtSecret: process.env.JWT_SECRET ?? "budgetmind-local-secret",
  encryptionKey: process.env.ENCRYPTION_KEY ?? "budgetmind-local-encryption-key",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://localhost:8000"
};
