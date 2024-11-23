const authServices = require("../services/authServices");
const sendResponse = require("../utils/sendResponse");

// Register Controller
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await authServices.register({ name, email, password });
    sendResponse(res, 201, true, "User created successfully", user);
  } catch (error) {
    // Use error codes from the service if available
    const statusCode = error.statusCode || 500;
    sendResponse(res, statusCode, false, error.message);
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await authServices.login({ email, password });
    sendResponse(res, 200, true, "User logged in successfully", data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    sendResponse(res, statusCode, false, error.message);
  }
};

// Get Authenticated User Controller
const getUser = async (req, res) => {
  try {
    const user = await authServices.getUser(req.user.id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }
    sendResponse(res, 200, true, "User found", user);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  register,
  login,
  getUser,
};
