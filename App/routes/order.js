const controllers = require('../controllers/order');
const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/all', authMiddleware(true), controllers.getAllOrders);

router.get('/', authMiddleware(false), controllers.getUserOrders);

module.exports = router;
