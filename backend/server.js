const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/connection.js');
const notesRouter = require('./routes/note.js');
const variablesRouter = require('./routes/variable.js');
const authRouter = require('./routes/auth.js');
const layoutRouter = require('./routes/layout.js');
const auth = require('./middleware/auth.js');

const app = express();




app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello From the Job Hunter Notes Backend');
});

app.use('/api/auth', authRouter);
app.use('/api/notes', auth, notesRouter);
app.use('/api/variables', auth, variablesRouter);
app.use('/api/layouts', auth, layoutRouter);


app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});


const PORT = process.env.PORT || 4500;
app.listen(PORT, async () => {
    try {
        await connectDB;
        console.log({
            FRONTEND_URL: process.env.FRONTEND_URL,
            MONGODB_URI: process.env.MONGODB_URI,
            JWT_SECRET: process.env.JWT_SECRET,
            PORT: process.env.PORT,
        })
        console.log('Connected to Database');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;