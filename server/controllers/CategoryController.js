
const Category = require('../models/category.model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs')

// Create a new Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log("Body : ",req.body);
        console.log("File : ",req.file);
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Category Name is required'
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Category Image is required'
            });
        }

        const category = new Category({
            name,
            description
        });

        // Handle image upload
        try {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            category.categoryImage.url = image;
            category.categoryImage.public_id = public_id;
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error)
            }
        } catch (error) {
            console.log('Image upload failed', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
        }

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });


    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 }); // Sorting by newest first
        res.status(200).json({
            success: true,
            message: 'Category Found',
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a Category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params._id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category Found',
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a Category by Name
exports.getCategoryByName = async (req, res) => {
    try {
        const category = await Category.findOne({ name: req.params.name });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: 'Category Found',
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a Category by ID
exports.updateCategory = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        const category = await Category.findById(req.params._id);
        const updates = req.body;


        // Check if category exists
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Check if there are no fields to update
        if (Object.keys(updates).length === 0 && !req.file) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        // Update the category fields if they exist in the request body
        if (updates.name) category.name = updates.name;
        if (updates.description) category.description = updates.description;
        // Update the category fields if they exist in the request body
        if (typeof updates.name !== 'undefined') {
            category.name = updates.name;
        }
        if (typeof updates.description !== 'undefined') {
            category.description = updates.description; // This allows empty strings to be saved
        }


        // Handle image update
        if (req.file) {
            try {
                // Delete the old image from Cloudinary if it exists
                if (category.categoryImage.public_id) {
                    await deleteImageFromCloudinary(category.categoryImage.public_id);
                }

                // Upload the new image to Cloudinary
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;

                // Update the category image
                category.categoryImage.url = image;
                category.categoryImage.public_id = public_id;

                // Delete the image from local storage
                try {
                    fs.unlinkSync(req.file.path);
                } catch (error) {
                    console.error("Error deleting local image file:", error);
                }

            } catch (error) {
                console.log('Image update failed', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update image',
                });
            }
        }


        // Save the updated category
        await category.save();

        // Respond with success message and updated category data
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Delete a Category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            })
        }
        await deleteImageFromCloudinary(category.categoryImage.public_id)

        res.status(200).json({
            success: true,
            message: 'Category Delete Successfully',
            data: category
        })

    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};
