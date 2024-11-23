const express = require("express");
require("dotenv").config();
const { models, sequelize } = require("./config/db");

// Import routes
const snippetRoutes = require("./routes/snippetRoutes");
const authRoutes = require("./routes/authRoutes");

const cors = require("cors");
const http = require("http"); // Required to create the HTTP server for socket.io
const socketHandler = require("./scripts/socket"); // Import socket handler

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on server start
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database synchronized.");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Example route
app.get("/", async (req, res) => {
  const users = await models.Snippet.findAll();
  res.json(users);
});

// Use routes
app.use("/auth", authRoutes);
app.use("/snippets", snippetRoutes);

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Replace '*' with your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// Pass the `io` instance to the socket handler
socketHandler(io);

// Start the server
server.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
