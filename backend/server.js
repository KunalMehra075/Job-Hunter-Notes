const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connection.js');
const notesRouter = require('./routes/note.js');
const variablesRouter = require('./routes/variable.js');
const authRouter = require('./routes/auth.js');
const auth = require('./middleware/auth.js');

const app = express();



app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello From the Job Hunter Notes Backend');
});

app.use('/api/auth', authRouter);
app.use('/api/notes', auth, notesRouter);
app.use('/api/variables', auth, variablesRouter);


app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;