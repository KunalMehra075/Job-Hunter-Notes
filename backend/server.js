const express = require('express');
const connectDB = require('./database/connection');
const cors = require('cors');
const notesRouter = require('./routes/notes');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
}); 