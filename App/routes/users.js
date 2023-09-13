const controllers = require('../controllers/users');
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/', controllers.registerUser);

router.get('/', authMiddleware(true), controllers.getAllUsers);

module.exports = router;
