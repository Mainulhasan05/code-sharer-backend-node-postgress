const snippetServices = require("../services/snippetServices");

module.exports = (io) => {
  const debounceTimers = {}; // Map to store debounce timers by sessionId

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

    // Update session code in real-time with debounce
    socket.on("updateSession", ({ sessionId, code }, callback) => {
      try {
        if (!sessionId) {
          console.error("Error: sessionId is required for updateSession.");
          return callback({ success: false, message: "Invalid input." });
        }

        // Broadcast the updated code to all users in the session, including the sender
        socket.to(sessionId).emit("sessionUpdate", {
          sessionId,
          code,
          updatedBy: socket.id,
        });
        // io.in(sessionId).emit("sessionUpdate", {
        //   sessionId,
        //   code,
        //   updatedBy: socket.id,
        // });

        // Clear any existing debounce timer for the session
        if (debounceTimers[sessionId]) {
          clearTimeout(debounceTimers[sessionId]);
        }

        // Set a new debounce timer for the session
        debounceTimers[sessionId] = setTimeout(async () => {
          try {
            // Persist the updated code in the database
            await snippetServices.updateSnippet(sessionId, { code });
          } catch (error) {
            console.error(
              `Error updating database for session ${sessionId}:`,
              error
            );
          } finally {
            delete debounceTimers[sessionId]; // Cleanup the timer
          }
        }, 500); // 1-second debounce delay

        // Acknowledge successful broadcast
        callback({ code, success: true });
      } catch (error) {
        console.error(`Error updating session ${sessionId}:`, error);
        callback({ success: false, message: "Error updating session." });
      }
    });

    // Handle general messages
    socket.on("message", (data) => {
      io.emit("message", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {});
  });
};
