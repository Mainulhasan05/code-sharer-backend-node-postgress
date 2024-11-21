const Sinppet = require('../models/Snippet');
const { Op } = require("sequelize");

const createSnippet = async (req, res) => {
    const { title, description, code, language } = req.body;
    try {
        const snippet = await Sinppet.create({ title, description, code, language });
        res.status(201).json({ success: true, message: 'Snippet created successfully', data: snippet });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}