const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
        success: false,
        message: 'Token is required',
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
    
        if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
        }
    
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
        success: false,
        message: 'Invalid token',
        });
    }
    };

module.exports = verifyToken;