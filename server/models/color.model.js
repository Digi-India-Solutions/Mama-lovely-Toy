const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    hexCode: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Color', colorSchema);
