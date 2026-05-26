import { io } from "socket.io-client";

let socket = null;

export function initializeSocket(token) {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
    auth: {
      token
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on("connect", () => {
    console.log("✅ WebSocket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ WebSocket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ WebSocket disconnected:", reason);
  });

  socket.on("error", (error) => {
    console.error("❌ WebSocket error:", error);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function onNotification(callback) {
  if (!socket) return;
  socket.on("notification", callback);
}

export function offNotification(callback) {
  if (!socket) return;
  socket.off("notification", callback);
}

export function onBroadcastNotification(callback) {
  if (!socket) return;
  socket.on("broadcast_notification", callback);
}

export function offBroadcastNotification(callback) {
  if (!socket) return;
  socket.off("broadcast_notification", callback);
}
