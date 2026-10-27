// socket.js
const { Server } = require("socket.io");

let io; // to hold the io instance

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (user) => {
      let {userId,role} =user
      //join own room
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);

      //join room based on roles 
      role = role=="HouseHold-Donor" || role =="Restaurant-Donor"?"donor":role;
      socket.join(role.toLowerCase());
      console.log(`User ${userId} joinde room ${role.toLowerCase()}`)
    });

  });
};

// to get io instance anywhere else in the app
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
