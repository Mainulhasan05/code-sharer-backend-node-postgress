const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Snippet = sequelize.define(
  "Snippet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users", // Table name
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Snippet;
