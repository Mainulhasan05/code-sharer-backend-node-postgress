const { sequelize, models } = require("../config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection established successfully.");

    await sequelize.sync({ force: true }); // Use { alter: true } for safe updates
    console.log("Database synchronized.");

    process.exit(0);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();
