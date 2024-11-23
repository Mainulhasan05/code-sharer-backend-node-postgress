const snippetServices = require("../services/snippetServices");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Generate a session code
    socket.on("generateSessionCode", async (data, callback) => {
      try {
        const { userId } = data;

        const result = await snippetServices.createSnippet(userId);

        if (!result || !result.session_code) {
          console.error("Error: Failed to generate session code.");
          return callback(null);
        }

        callback(result); // Return the generated session code to the client
      } catch (error) {
        console.error("Error generating session code:", error);
        callback(null); // Indicate failure
      }
    });

    // Join a session
    socket.on("joinSession", async ({ sessionId }) => {
      try {
        if (!sessionId) {
          console.error("Error: sessionId is required to join a session.");
          return;
        }
        socket.join(sessionId);
      } catch (error) {
        console.error("Error joining session:", error);
      }
    });

    // Leave a session
    socket.on("leaveSession", ({ sessionId }) => {
      if (sessionId) {
        socket.leave(sessionId);
      } else {
        console.error("Error: sessionId is required to leave a session.");
      }
    });

    // Update session code in real-time
    socket.on("updateSession", async ({ sessionId, code }, callback) => {
      try {
        if (!sessionId || !code) {
          console.error(
            "Error: sessionId and code are required for updateSession."
          );
          return callback({ success: false, message: "Invalid input." });
        }

        // Persist the updated code in the database
        await snippetServices.updateSnippet(sessionId, { code });

        // Broadcast the updated code to all users in the session, including the sender
        io.in(sessionId).emit("sessionUpdate", {
          sessionId, // Include the session ID for context
          code, // Send the updated code
          updatedBy: socket.id, // Optional: Include the ID of the user who made the update
        });

        // Acknowledge successful update
        callback({ code, success: true });
      } catch (error) {
        console.error(`Error updating session ${sessionId}:`, error);
        callback({ success: false, message: "Error updating session." });
      }
    });

    // Handle general messages
    socket.on("message", (data) => {
      // Broadcast the message to all connected clients
      io.emit("message", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {});
  });
};
