const jwt = require("jsonwebtoken");
const { models } = require("../config/db");
const { User } = models;

const getUserIdByToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return decoded.id;
  } catch (error) {
    return null;
  }
};

module.exports = getUserIdByToken;
