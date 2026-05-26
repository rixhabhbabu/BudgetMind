import { createServer } from "http";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./services/socketService.js";

await connectDatabase();

// Create HTTP server for socket.io
const httpServer = createServer(app);

// Initialize socket.io
const io = initializeSocket(httpServer);
global.io = io;

httpServer.listen(env.port, () => {
  console.log(`BudgetMind API running on ${env.port}`);
});
