const controllers = require('../controllers/login');
const router = require('express').Router();
router.post('/', controllers.loginUser);
router.get('/', controllers.checkUser);
router.post('/logout', controllers.logout);
module.exports = router;
