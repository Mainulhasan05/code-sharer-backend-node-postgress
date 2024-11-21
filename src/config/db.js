const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

console.log(process.env.DB_NAME);
// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false, // Disable query logs
  }
);

// Dynamically load all models
const models = {};
const modelsDir = path.join(__dirname, "../models");

fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js") && file !== "associations.js")
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Apply associations
require("../models/associations")(models);

module.exports = { sequelize, models };
