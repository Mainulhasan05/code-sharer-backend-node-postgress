const { models } = require("../config/db");
const { Snippet } = models;
// define Op
const { Op } = require("sequelize");

// Function to generate a random 6-character session code (numbers and both uppercase and lowercase letters)
const generateSessionCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let sessionCode = "";
  for (let i = 0; i < 6; i++) {
    sessionCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return sessionCode;
};

// Function to ensure the session code is unique
const isSessionCodeUnique = async (sessionCode) => {
  const snippet = await Snippet.findOne({
    where: { session_code: sessionCode },
  });
  return !snippet; // Return true if code is unique, false if it already exists
};

// Service to create a new snippet
const createSnippet = async (userId) => {
  try {
    let sessionCode;
    let isUnique = false;

    // Ensure the session code is unique by checking the database
    while (!isUnique) {
      sessionCode = generateSessionCode();
      isUnique = await isSessionCodeUnique(sessionCode); // Check if the generated code is unique
    }

    // Create the new snippet with the unique session code
    const snippet = await Snippet.create({
      session_code: sessionCode,
      userId: userId,
    });

    return snippet;
  } catch (error) {
    throw new Error("Error creating snippet: " + error.message);
  }
};

// Service to update an existing snippet
const updateSnippet = async (snippetId, { title, code, expiresAt, userId }) => {
  try {
    const snippet = await Snippet.findOne({ where: { id: snippetId } });

    if (!snippet) {
      const error = new Error(
        "Snippet not found or you are not authorized to update it."
      );
      error.statusCode = 404;
      throw error;
    }

    // Update snippet details
    snippet.title = title || snippet.title;
    snippet.code = code || snippet.code;
    snippet.expiresAt = expiresAt || snippet.expiresAt;

    // Save the updated snippet
    await snippet.save();

    return snippet;
  } catch (error) {
    throw new Error("Error updating snippet: " + error.message);
  }
};

// Service to get a snippet by session code
const getSnippetBySessionCode = async (sessionCode) => {
  try {
    const snippet = await Snippet.findOne({
      where: { session_code: sessionCode },
    });
    if (!snippet) {
      const error = new Error("Snippet not found.");
      error.statusCode = 404;
      throw error;
    }

    return snippet;
  } catch (error) {
    throw new Error("Error fetching snippet: " + error.message);
  }
};

// Service to get user snippets with pagination, sorting, and search
// Service to get user snippets with pagination, sorting, and search
const getUserSnippets = async (userId, query) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
    } = query;

    // Pagination parameters
    const offset = (page - 1) * limit;

    // Search condition
    const searchCondition = {
      [Op.or]: [
        { title: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { session_code: { [Op.like]: `%${search}%` } },
      ],
    };

    // Fetch snippets with pagination, sorting, and search
    const { count, rows } = await Snippet.findAndCountAll({
      where: {
        userId,
        ...searchCondition,
      },
      order: [[sortBy, order]], // Default: Sort by createdAt in descending order
      offset,
      limit: parseInt(limit, 10),
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      snippets: rows,
    };
  } catch (error) {
    throw new Error("Error fetching user snippets: " + error.message);
  }
};

// deleteSnippet function
const deleteSnippet = async (snippetId, userId) => {
  try {
    const snippet = await Snippet.findOne({
      where: { id: snippetId, userId },
    });

    if (!snippet) {
      const error = new Error(
        "Snippet not found or you are not authorized to delete it."
      );
      error.statusCode = 404;
      throw error;
    }

    await snippet.destroy();
  } catch (error) {
    throw new Error("Error deleting snippet: " + error.message);
  }
};

module.exports = {
  createSnippet,
  updateSnippet,
  getSnippetBySessionCode,
  getUserSnippets,
  deleteSnippet,
};
