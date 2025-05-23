import { Server as SocketIOServer } from "socket.io";

let io;

export const initializeSocket = (httpServer, options) => {
  io = new SocketIOServer(httpServer, options);

  io.on("connection", (socket) => {
    console.log("🟢 Connected to Socket.io:", socket.id);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      console.log(`User connected: ${userData.name} (${userData._id})`);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      if (!room) {
        return console.log("⚠️ No room selected by user");
      }
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("typing", (room) => {
      socket.to(room).emit("typing", { senderId: room.senderId });
    });

    socket.on("stop typing", (room) => {
      socket.to(room).emit("stop typing");
    });

    socket.on("new message", (newMessageReceived) => {
      console.log("Server got new message:", newMessageReceived);
      const chat = newMessageReceived.chat;
      if (!chat) return;

      chat.users.forEach((user) => {
        if (user._id === newMessageReceived.sender._id) return;
        console.log(`Sending message to user: ${user._id}`);
        socket.to(user._id).emit("message received", newMessageReceived);
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
