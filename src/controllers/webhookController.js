const line = require('@line/bot-sdk');
const { processMessageCommand } = require('../services/aiService');
const User = require('../models/User');
const Todo = require('../models/Todo');

const config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

// Workaround for creating the client safely even if env cars are missing at module load
let client = null;
if (config.channelAccessToken) {
    client = new line.messagingApi.MessagingApiClient({
        channelAccessToken: config.channelAccessToken
    });
}

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    if (!client) {
        console.error("LINE Client is not initialized due to missing token");
        return Promise.resolve(null);
    }

    const lineUserId = event.source.userId;
    const messageText = event.message.text;

    // Find or create User
    let user = await User.findOne({ lineUserId });
    if (!user) {
        try {
            const profile = await client.getProfile(lineUserId);
            user = await User.create({ lineUserId, displayName: profile.displayName });
        } catch (err) {
            console.error('Error fetching profile:', err);
            user = await User.create({ lineUserId, displayName: 'Unknown' });
        }
    }

    // Use Gemini to parse intent
    const aiResult = await processMessageCommand(messageText, user);

    let replyText = '';

    if (aiResult.intent === 'REMEMBER_NAME') {
        user.knownName = aiResult.name;
        await user.save();
        replyText = `ได้เลยครับ อับดุลจะจำไว้ว่าคุณชื่อ ${aiResult.name} นะครับ`;
    } else if (aiResult.intent === 'ADD_TODO') {
        await Todo.create({ lineUserId, task: aiResult.task });
        replyText = `อับดุลจดไว้เรียบร้อยครับว่าต้อง: "${aiResult.task}"`;
    } else {
        // CHAT
        replyText = aiResult.reply || 'ขออภัยครับ อับดุลไม่ค่อยเข้าใจ';
    }

    return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: replyText }]
    });
}

const webhookHandler = async (req, res) => {
    try {
        const results = await Promise.all(req.body.events.map(handleEvent));
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).end();
    }
};

module.exports = {
    webhookHandler,
    config
};
