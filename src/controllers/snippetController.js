const snippetServices = require("../services/snippetServices");
const sendResponse = require("../utils/sendResponse");

// Controller to create a new snippet
const createSnippet = async (req, res) => {
  const userId = req?.user?.id; // Assume userId is passed in the body or obtained from the authenticated user
  console.log(userId);
  try {
    const snippet = await snippetServices.createSnippet(userId);
    sendResponse(res, 201, true, "Snippet created successfully", snippet);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// Controller to update an existing snippet
const updateSnippet = async (req, res) => {
  const { snippetId } = req.params;
  const { title, code, expiresAt } = req.body;
  const userId = req?.user?.id; // Assuming userId is available in the request object after authentication

  try {
    const updatedSnippet = await snippetServices.updateSnippet(snippetId, {
      title,
      code,
      expiresAt,
      ...(userId && { userId }),
    });
    sendResponse(
      res,
      200,
      true,
      "Snippet updated successfully",
      updatedSnippet
    );
  } catch (error) {
    sendResponse(res, error.statusCode || 500, false, error.message);
  }
};

// Controller to get a snippet by session code
const getSnippetBySessionCode = async (req, res) => {
  const { sessionCode } = req.params;
  try {
    const snippet = await snippetServices.getSnippetBySessionCode(sessionCode);
    sendResponse(res, 200, true, "Snippet found", snippet);
  } catch (error) {
    sendResponse(res, error.statusCode || 500, false, error.message);
  }
};

// getUserSnippets
const getUserSnippets = async (req, res) => {
  const userId = req?.user?.id; // Assuming userId is available in the request object after authentication
  try {
    const query = req.query;
    const snippets = await snippetServices.getUserSnippets(userId, query);
    sendResponse(res, 200, true, "User snippets found", snippets);
  } catch (error) {
    sendResponse(res, error.statusCode || 500, false, error.message);
  }
};

// deleteSnippet
const deleteSnippet = async (req, res) => {
  const { snippetId } = req.params;
  const userId = req?.user?.id; // Assuming userId is available in the request object after authentication
  try {
    await snippetServices.deleteSnippet(snippetId, userId);
    sendResponse(res, 200, true, "Snippet deleted successfully");
  } catch (error) {
    sendResponse(res, error.statusCode || 500, false, error.message);
  }
};

module.exports = {
  createSnippet,
  updateSnippet,
  getSnippetBySessionCode,
  getUserSnippets,
  deleteSnippet,
};
