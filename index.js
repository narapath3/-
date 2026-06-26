const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const webhookRoutes = require('./src/routes/webhookRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
} else {
    console.log('No MONGODB_URI provided. Skipping DB connection.');
}

// Routes
// Note: webhook endpoints MUST handle body parsing themselves or use line.middleware
app.use('/webhook', webhookRoutes);

// For standard endpoints, we can use express.json()
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Abdul LINE Bot is running.');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
