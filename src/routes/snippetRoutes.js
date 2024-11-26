const router = require("express").Router();
const snippetController = require("../controllers/snippetController");
const checkToken = require("../middlewares/checkToken");
const verifyToken = require("../middlewares/verifyToken");

router.post("/", checkToken, snippetController.createSnippet);
router.get("/usersnippets", checkToken, snippetController.getUserSnippets);

router.delete("/:snippetId", verifyToken, snippetController.deleteSnippet);
router.put("/:snippetId", snippetController.updateSnippet);
router.get("/:sessionCode", snippetController.getSnippetBySessionCode);

module.exports = router;
