const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', LogController.getLogs);
router.get('/:entity_type/:entity_id', LogController.getLogsByEntity);

module.exports = router;
