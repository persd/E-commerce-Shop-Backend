const controllers = require('../controllers/account');
const authMiddleware = require('../middleware/authMiddleware');
const router = require('express').Router();

router.get('/', authMiddleware(false), controllers.getUserById);
router.put('/edit', authMiddleware(false), controllers.editUserPersonalData);
router.get('/stats', authMiddleware(true), controllers.storeStats);
module.exports = router;
