const { models } = require("../config/db");
const { User } = models;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// codesharer_token
const setAuthCookie = (res, token) => {
  res.cookie("codesharer_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms,
    domain: process.env.COOKIE_DOMAIN, // set domain in production
    path: "/", // apply cookie to all paths
  });
};

// Helper function to generate JWT token
const generateToken = (userId, expiresIn = "60m") => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

// Register a new user
const register = async ({ res, name, email, password }) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id, "7d");

    // Exclude password from returned user object
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, token };
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500; // Default to 500 if no status code is set
    throw error;
  }
};

// Login an existing user
const login = async ({ res, email, password }) => {
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id, "7d");
    setAuthCookie(res, refreshToken);
    // send user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();

    return { user: userWithoutPassword, token };
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500; // Default to 500 if no status code is set
    throw error;
  }
};

// Get user details by user ID
const getUser = async (userId) => {
  try {
    // Fetch user by ID
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Exclude password from the response
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user;
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500; // Default to 500 if no status code is set
    throw error;
  }
};

module.exports = {
  register,
  login,
  getUser,
};
