const mongoose = require('mongoose');

// Sub-schema for variant details
const variantSchema = new mongoose.Schema({
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color'
    },
    weight: {
        type: String 
    },
    stock: {
        type: Number,
        required: true
    },
    // Pricing details
    originalPrice: {
        type: Number,
        required: true 
    },
    discountPrice: {
        type: Number 
    },
    discountPercentage: {
        type: Number, 
        min: 0,
        max: 100
    }
}, { _id: false }); // _id: false means Mongoose won't create an `_id` for this sub-document

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    detailDescription: {
        type: String
    },
    productImage:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    variants: [variantSchema], 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
