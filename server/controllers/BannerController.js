const Banner = require('../models/banner.model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary');
const fs = require('fs');

// Create a new Banner
exports.createBanner = async (req, res) => {
    try {
        const { title, type, status } = req.body;
        console.log("Body:", req.body);
        console.log("File:", req.file);

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Banner title is required'
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Banner image is required'
            });
        }

        const banner = new Banner({
            title,
            type,
            status
        });

        // Handle image upload
        try {
            const imgUrl = await uploadImage(req.file.path);
            const { image, public_id } = imgUrl;
            banner.bannerImage.url = image;
            banner.bannerImage.public_id = public_id;

            // Delete the image from local storage
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.log('Error deleting file from local storage', error);
            }
        } catch (error) {
            console.log('Image upload failed', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
        }

        await banner.save();

        res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: banner
        });
    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all Banners
exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Banners retrieved successfully',
            data: banners
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get active Banners
exports.getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: 'Active banners retrieved successfully',
            data: banners
        });
    } catch (error) {
        console.error('Error fetching active banners:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get Banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }
        res.status(200).json({
            success: true,
            message: 'Banner retrieved successfully',
            data: banner
        });
    } catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a Banner by ID
exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        const updates = req.body;

        // Check if the banner exists
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        // Update fields
        if (updates.title) banner.title = updates.title;
        if (updates.type) banner.type = updates.type;
        if (updates.status) banner.status = updates.status;

        // Handle image update
        if (req.file) {
            try {
                // Delete the old image from Cloudinary if it exists
                if (banner.bannerImage.public_id) {
                    await deleteImageFromCloudinary(banner.bannerImage.public_id);
                }

                // Upload the new image to Cloudinary
                const imgUrl = await uploadImage(req.file.path);
                const { image, public_id } = imgUrl;

                // Update the banner image
                banner.bannerImage.url = image;
                banner.bannerImage.public_id = public_id;

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

        // Save updated banner
        await banner.save();

        res.status(200).json({
            success: true,
            message: 'Banner updated successfully',
            data: banner
        });
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete a Banner by ID
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }

        // Delete the image from Cloudinary
        if (banner.bannerImage.public_id) {
            await deleteImageFromCloudinary(banner.bannerImage.public_id);
        }

        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully',
            data: banner
        });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
