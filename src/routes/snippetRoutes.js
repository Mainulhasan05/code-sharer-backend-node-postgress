const router = require('express').Router();
const snippetController = require('../controllers/snippetController');

router.post('/', snippetController.createSnippet);
router.put('/:snippetId', snippetController.updateSnippet);
router.get('/:sessionCode', snippetController.getSnippetBySessionCode);


module.exports = router;