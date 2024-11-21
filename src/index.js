const express = require("express");
require("dotenv").config();
const { models, sequelize } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Test database connection on server start
(async () => {
  try {
    await sequelize.authenticate();
    // sequelize.sync({ force: true });
    await sequelize.sync({ force: true }); // Use force: true to drop and recreate the tables
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

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
