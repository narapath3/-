const express = require('express');
const line = require('@line/bot-sdk');
const { webhookHandler, config } = require('../controllers/webhookController');

const router = express.Router();

// Webhook endpoint
// We use line.middleware to validate signatures before handling the request body
router.post('/', line.middleware(config), webhookHandler);

module.exports = router;
