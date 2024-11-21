const express = require("express");
require("dotenv").config();
const { models, sequelize } = require("./config/db");

// Import routes
const snippetRoutes = require("./routes/snippetRoutes");

const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on server start
(async () => {
  try {
    await sequelize.authenticate();
    // sequelize.sync({ force: true });
    await sequelize.sync({ alter: true }); // Use force: true to drop and recreate the tables
    console.log("Database synchronized.");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Example route
app.get("/", async (req, res) => {
  const users = await models.User.findAll();
  res.json(users);
});

// Use snippet routes
app.use("/snippets", snippetRoutes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
