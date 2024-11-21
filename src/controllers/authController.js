const authServices = require('../services/authServices');
const sendResponse = require('../utils/sendResponse');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await authServices.register({ name, email, password });
        sendResponse(res, 201, true, 'User created successfully', user);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await authServices.login({ email, password });
        sendResponse(res, 200, true, 'User logged in successfully', token);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};

const getUser = async (req, res) => {
    try {
        const user = await authServices.getUser(req.user.id);
        sendResponse(res, 200, true, 'User found', user);
    } catch (error) {
        sendResponse(res, 500, false, error.message);
    }
};
