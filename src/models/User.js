const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    subscriptionEndDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
