const jwt = require("jsonwebtoken");
const { models } = require("../config/db");
const { User } = models;
const checkToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = checkToken;
