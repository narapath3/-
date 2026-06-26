const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Parses user input to identify intent and details.
 * Intents: 'CHAT', 'REMEMBER_NAME', 'ADD_TODO'
 */
async function processMessageCommand(message, userProfile) {
    const prompt = `You are the brain of a LINE chatbot named "Abdul" (อับดุล).
You are talking to a user.
User profile info: ${JSON.stringify(userProfile)}

Your task is to classify the user's message intent and provide a JSON response. 
The intents are:
1. "REMEMBER_NAME": The user is asking you to remember their name (e.g., "ชื่อของฉันคือแจ็ค", "จำไว้ว่าฉันชื่อมายด์").
2. "ADD_TODO": The user wants to add a reminder or a to-do item (e.g., "เตือนฉันให้ซื้อนม", "จดไว้ว่าต้องไปหาหมอพรุ่งนี้").
3. "CHAT": Any other general question, greeting, or conversation.

For "REMEMBER_NAME", extract the name the user wants to be called.
For "ADD_TODO", extract the task description.
For "CHAT", provide a helpful, friendly, and concise response in Thai.

Always return ONLY a valid JSON string (no markdown formatting like \`\`\`json) with the following structure:
For REMEMBER_NAME: {"intent": "REMEMBER_NAME", "name": "extracted_name"}
For ADD_TODO: {"intent": "ADD_TODO", "task": "extracted_task"}
For CHAT: {"intent": "CHAT", "reply": "your_response_in_thai"}

User Message: "${message}"
`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        // Clean up potential markdown formatting
        let cleanJson = responseText;
        if (cleanJson.startsWith('\`\`\`json')) {
            cleanJson = cleanJson.replace(/^\`\`\`json\n?/, '').replace(/\n?\`\`\`$/, '');
        } else if (cleanJson.startsWith('\`\`\`')) {
            cleanJson = cleanJson.replace(/^\`\`\`\n?/, '').replace(/\n?\`\`\`$/, '');
        }
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('Error generating AI response:', error);
        return { intent: "CHAT", reply: "ขออภัยครับ อับดุลกำลังมึนงงชั่วคราว ลองใหม่อีกครั้งนะครับ" };
    }
}

module.exports = {
    processMessageCommand,
};
