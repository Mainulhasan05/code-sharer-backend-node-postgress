require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false, // Set to true if you want query logs
  }
);

module.exports = sequelize;

// DB_NAME=your_database
// DB_USER=your_username
// DB_PASSWORD=your_password
// DB_HOST=localhost
