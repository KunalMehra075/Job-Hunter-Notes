const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connection.js');
const notesRouter = require('./routes/notes.js');
const variablesRouter = require('./routes/variable.js');
const authRouter = require('./routes/auth.js');
const auth = require('./middleware/auth.js');

const app = express();


// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', auth, notesRouter);
app.use('/api/variables', auth, variablesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 