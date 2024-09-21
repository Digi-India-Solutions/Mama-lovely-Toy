const Product = require('../models/product.model');
const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');

// Create a new Product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, detailDescription, category, subCategory, variants } = req.body;
        console.log("Body : ", req.body);
        console.log("File : ", req.file);

        // Check if the product already exists
        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists"
            });
        }

        // Check for required fields
        if (!name || !category || !variants || variants.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product Name, Category, and at least one Variant are required'
            });
        }

        // Initialize the new product
        const product = new Product({
            name,
            description,
            detailDescription,
            category,
            subCategory,
            variants: JSON.parse(variants) // Parse variants from JSON string
        });

        // Handle image upload
        if (req.file) {
            try {
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;
                product.productImage.url = image;
                product.productImage.public_id = public_id;

                // Delete local file after upload
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.log('Error deleting file from local storage', error);
                }
            } catch (error) {
                console.log('Image upload failed', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload product image'
                });
            }
        }

        // Save product to the database
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category subCategory variants.size variants.color').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a Product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category subCategory variants.size variants.color');
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            message: 'Product found',
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

exports.getProductByCategoryAndSubCategory = async (req, res) => {
    try {
        const { categoryName, subCategoryName } = req.params;

        // Find category by name
        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Find subcategory by name
        const subCategory = await SubCategory.findOne({ name: subCategoryName });
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }

        // Now fetch products by category and subcategory IDs
        const products = await Product.find({
            category: category._id,
            subCategory: subCategory._id
        })
        .populate('category subCategory variants.size variants.color')
        .sort({ createdAt: -1 });

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found for the given category and subcategory"
            });
        }

        res.status(200).json({
            success: true,
            message: 'Products found',
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by category and subcategory:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




// Get a product by name
exports.getProductByName = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name })
            .populate('category subCategory variants.size variants.color');
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Product found',
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update a Product by ID
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const updates = req.body;

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Handle updating fields
        if (updates.name) product.name = updates.name;
        if (updates.description) product.description = updates.description;
        if (updates.detailDescription) product.detailDescription = updates.detailDescription;
        if (updates.category) product.category = updates.category;
        if (updates.subCategory) product.subCategory = updates.subCategory;
        if (updates.variants) product.variants = JSON.parse(updates.variants);

        // Handle image update
        if (req.file) {
            try {
                // Delete old image from Cloudinary
                if (product.productImage.public_id) {
                    await deleteImageFromCloudinary(product.productImage.public_id);
                }

                // Upload new image to Cloudinary
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;
                product.productImage.url = image;
                product.productImage.public_id = public_id;

                // Delete local image file
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.log('Error deleting local file', error);
                }
            } catch (error) {
                console.log('Image update failed', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update product image'
                });
            }
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Delete a Product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete image from Cloudinary
        if (product.productImage.public_id) {
            await deleteImageFromCloudinary(product.productImage.public_id);
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
