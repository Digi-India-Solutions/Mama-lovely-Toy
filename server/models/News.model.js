const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    CreatedBy: {
        type: String,
        required: true
    },
    ImageOfNews:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    Headline: {
        type: String,
        required: true
    },
    SubHeading: {
        type: String,
        required: true
    },
    DateOfNews: {
        type: Date,
        default: Date.now
    },
    NewsData: {
        type: String,
        required: true
    }
}, { timestamps: true });

const News = mongoose.model('News', NewsSchema);

module.exports = News;