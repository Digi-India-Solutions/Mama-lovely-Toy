const SubCategory = require('../models/subCategory.model');
const Category = require('../models/category.model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs')

// Create a new subcategory
exports.createSubCategory = async (req, res) => {
    try {
        const { name, category, description } = req.body;
        console.log("Body : ", req.body);
        console.log("File : ", req.file);

        const existingSubCategory = await SubCategory.findOne({ name });
        if (existingSubCategory) {
            return res.status(400).json({
                success: false,
                message: "Sub Category already exists"
            });
        }
        // Validate if the category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID.'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Sub Category Image is must required"
            })
        }

        const newSubCategory = new SubCategory({
            name,
            category,
            description
        });

        // Handle image upload
        try {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            
            // Set the subCategoryImage field on the newSubCategory instance
            newSubCategory.subCategoryImage = {
                url: image,
                public_id: public_id
            };
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

        const savedSubCategory = await newSubCategory.save();
        res.status(201).json({
            success: true,
            message: 'Sub Category created successfully',
            data: savedSubCategory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all subcategories
exports.getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category');
        res.status(200).json({
            success: true,
            message: 'Sub Category Found',
            data: subCategories
        });
    } catch (error) {
        console.error('Error fetching Sub categories:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a subcategory by ID
exports.getSubCategoryById = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('category');
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sub Category Found',
            data: subCategory
        });
    } catch (error) {
        console.error('Error fetching Sub category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get a subcategory by name
exports.getSubCategoryByName = async (req, res) => {
    try {
        const subCategory = await SubCategory.findOne({ name: req.params.name }).populate('category');
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Sub Category Found',
            data: subCategory
        });
    } catch (error) {
        console.error('Error fetching Sub category:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all subcategories by category name
exports.getSubCategoryByCategoryName = async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const subCategories = await SubCategory.find()
            .populate({
                path: 'category',
                match: { name: categoryName }
            });

        // Filter out any subcategories where the category didn't match
        const filteredSubCategories = subCategories.filter(subCat => subCat.category);

        if (filteredSubCategories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No subcategories found for the specified category.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subcategories found.',
            data: filteredSubCategories
        });
    } catch (error) {
        console.error('Error fetching subcategories by category name:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.updateSubCategory = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        const { name, category, description } = req.body;
        let subCategory = await SubCategory.findById(req.params.id);
        const updates = req.body;
        
        // Check if subcategory exists
        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            });
        }

        // Validate if the category exists if category is being updated
        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category ID.'
                });
            }
            subCategory.category = category; // Update the category if valid
        }

        // Update other fields
        if (name) subCategory.name = name;
        if (description) subCategory.description = description;

        if (typeof updates.description !== 'undefined') {
            subCategory.description = updates.description; // This allows empty strings to be saved
        }
        // Handle image update if an image file is uploaded
        if (req.file) {
            try {
                // Delete the old image from Cloudinary if it exists
                if (subCategory.subCategoryImage.public_id) {
                    await deleteImageFromCloudinary(subCategory.subCategoryImage.public_id);
                }

                // Upload the new image to Cloudinary
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;

                // Update the subcategory image
                subCategory.subCategoryImage.url = image;
                subCategory.subCategoryImage.public_id = public_id;

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
                    message: 'Failed to update image' 
                });
            }
        }

        // Save updated subcategory
        const updatedSubCategory = await subCategory.save();

        // Populate the category reference before sending the response
        await updatedSubCategory.populate('category');

        res.status(200).json({
            success: true, // Correct the success flag
            message: 'SubCategory updated successfully',
            data: updatedSubCategory
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// Delete a subcategory by ID
exports.deleteSubCategory = async (req, res) => {
    try {
        const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
        if (!deletedSubCategory) {
            return res.status(404).json({
                success: false,
                message: 'SubCategory not found.'
            });
        }
        await deleteImageFromCloudinary(deletedSubCategory.subCategoryImage.public_id)

        res.status(200).json({
            success: true,
            message: 'Sub Category Delete Successfully',
            data: deletedSubCategory
        })
    } catch (error) {
        console.error('Error deleting Sub category:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};