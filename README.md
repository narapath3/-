# อับดุล (Abdul) LINE Bot Backend

Backend for the "Abdul" LINE Bot, an AI-powered assistant built with Node.js and Express. Abdul can have general chats using Gemini 1.5 Flash, remember your name, and keep track of your tasks/to-dos using MongoDB as the storage layer.

## Requirements
- Node.js (v14 or higher)
- MongoDB Database

## Setup Instructions

1. **Clone or Download the Repository**

2. **Install Dependencies**
   Run the following command to install the required packages:
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in the missing values:
   - `LINE_ACCESS_TOKEN`: The Channel Access Token from your LINE Developer Console.
   - `LINE_CHANNEL_SECRET`: The Channel Secret from your LINE Developer Console.
   - `GEMINI_API_KEY`: API Key obtained from Google AI Studio for using Gemini.
   - `MONGODB_URI`: Complete MongoDB connection string (e.g., `mongodb://127.0.0.1:27017/abdul_linebot`).

4. **Running the Server**
   Start the application locally:
   ```bash
   npm run start
   ```

5. **Exposing Webhook via ngrok** (Optional)
   If you are running the bot locally and want LINE to access it, you can use ngrok:
   ```bash
   ngrok http 3000
   ```
   Copy the generated HTTPS URL and append `/webhook` to it. Put it in the LINE Developers Console under the Webhook settings.

## System Architecture
- **Controllers & Routing (`src/controllers`, `src/routes`)**: Handle LINE events.
- **AI Service (`src/services/aiService.js`)**: Interfaces with `@google/generative-ai` to classify user intent (General Chat, Remember Name, Add To-Do).
- **Models (`src/models`)**: Defines MongoDB schemas using Mongoose.
