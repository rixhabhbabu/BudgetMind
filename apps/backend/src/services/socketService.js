import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Store active socket connections by userId
const userSockets = new Map();

export function initializeSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.userId = decoded.id;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected with socket ${socket.id}`);
    
    // Store socket reference
    userSockets.set(socket.userId, socket);

    // Join user-specific room
    socket.join(`user-${socket.userId}`);

    // Send confirmation
    socket.emit("connected", { userId: socket.userId });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.userId} disconnected`);
      userSockets.delete(socket.userId);
    });

    // Handle error
    socket.on("error", (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
}

export function getIO() {
  // This will be set in app.js
  return global.io;
}

// Emit expense added notification
export function emitExpenseNotification(userId, expense, budgetStatus = null) {
  const io = getIO();
  if (!io) return;

  const notification = {
    type: "expense_added",
    timestamp: new Date(),
    data: {
      merchant: expense.merchant,
      category: expense.category,
      amount: expense.amount,
      method: expense.method,
      budgetStatus // { spent, budget, percentage, exceeded }
    }
  };

  io.to(`user-${userId}`).emit("notification", notification);
}

// Emit budget alert
export function emitBudgetAlert(userId, budgetData) {
  const io = getIO();
  if (!io) return;

  const alert = {
    type: "budget_alert",
    timestamp: new Date(),
    data: {
      message: `You've reached ${budgetData.percentage}% of your budget`,
      spent: budgetData.spent,
      budget: budgetData.budget,
      percentage: budgetData.percentage,
      remaining: budgetData.remaining,
      severity: budgetData.percentage >= 90 ? "critical" : budgetData.percentage >= 75 ? "warning" : "info"
    }
  };

  io.to(`user-${userId}`).emit("notification", alert);
}

// Emit category spending alert
export function emitCategoryAlert(userId, categoryData) {
  const io = getIO();
  if (!io) return;

  const alert = {
    type: "category_alert",
    timestamp: new Date(),
    data: {
      category: categoryData.category,
      amount: categoryData.amount,
      message: `${categoryData.category} spending has reached ₹${categoryData.amount}`,
      severity: categoryData.severity || "info"
    }
  };

  io.to(`user-${userId}`).emit("notification", alert);
}

// Emit goal progress update
export function emitGoalUpdate(userId, goalData) {
  const io = getIO();
  if (!io) return;

  const update = {
    type: "goal_update",
    timestamp: new Date(),
    data: {
      goalName: goalData.name,
      current: goalData.current,
      target: goalData.target,
      percentage: goalData.percentage,
      completed: goalData.completed
    }
  };

  io.to(`user-${userId}`).emit("notification", update);
}

// Emit AI insight
export function emitAIInsight(userId, insight) {
  const io = getIO();
  if (!io) return;

  const notification = {
    type: "ai_insight",
    timestamp: new Date(),
    data: {
      insight: insight.message,
      recommendation: insight.recommendation,
      category: insight.category
    }
  };

  io.to(`user-${userId}`).emit("notification", notification);
}

// Broadcast to all connected users (for admin features)
export function broadcastNotification(notification) {
  const io = getIO();
  if (!io) return;

  io.emit("broadcast_notification", notification);
}

// Get active user sockets
export function getActiveUsers() {
  return Array.from(userSockets.keys());
}

// Check if user is online
export function isUserOnline(userId) {
  return userSockets.has(userId);
}
