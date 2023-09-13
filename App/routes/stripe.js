const controllers = require('../controllers/stripe');
const router = require('express').Router();
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    controllers.webhook
);

router.post(
    '/create-checkout-session',
    authMiddleware(false),
    controllers.createCheckoutSession
);

module.exports = router;
