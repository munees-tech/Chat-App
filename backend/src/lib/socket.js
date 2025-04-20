import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

export function getReciverSocketId(userId){
    return userSocketMap[userId]
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Retrieve userId from handshake query
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id; // Map userId to socket.id
  }

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove the user from the map
    for (const [key, value] of Object.entries(userSocketMap)) {
      if (value === socket.id) {
        delete userSocketMap[key];
        break;
      }
    }

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };