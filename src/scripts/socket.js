module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle events from the client
    socket.on("message", (data) => {
      console.log("Message received:", data);

      // Broadcast message to all connected clients
      io.emit("message", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
