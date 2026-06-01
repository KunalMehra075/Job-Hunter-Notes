const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    key: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        default: '',
        trim: true
    },
    color: {
        type: String,
        default: '#22c55e'
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// One variable name per user
variableSchema.index({ userId: 1, key: 1 }, { unique: true });

const Variable = mongoose.model('Variable', variableSchema);

// Default variables seeded for every new user
Variable.DEFAULT_VARS = [
    { key: 'companyName', value: '', color: '#22c55e' },
    { key: 'jobTitle', value: '', color: '#3b82f6' },
    { key: 'jobLink', value: '', color: '#ec4899' },
    { key: 'personName', value: '', color: '#f59e0b' },
];

module.exports = Variable;
