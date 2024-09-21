const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    subCategoryImage:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
