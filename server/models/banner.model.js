const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    bannerImage:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    type: {
        type: String,
        enum: ['desktop', 'mobile', 'both'], // Enum for banner type
        default: 'both'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
