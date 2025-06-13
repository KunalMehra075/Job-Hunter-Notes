const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Variable = mongoose.model('Variable', variableSchema);

module.exports = Variable; 