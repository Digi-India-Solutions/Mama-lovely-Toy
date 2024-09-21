const News = require('../models/News.model');
const { uploadImage, deleteImageFromCloudinary } = require('../utils/Cloudnary'); // Cloudinary helper functions
const fs = require('fs');

// Create a News
exports.createNews = async (req, res) => {
    try {
        const { CreatedBy, Headline, SubHeading, DateOfNews, NewsData } = req.body;
        let ImageOfNews = null;

        // Handle image upload
        if (req.file) {
            try {
                const imgUrl = await uploadImage(req.file.path);
                ImageOfNews = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };
                // Optionally, delete local image after uploading
                fs.unlinkSync(req.file.path);
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload image'
                });
            }
        }

        const news = new News({
            CreatedBy,
            Headline,
            SubHeading,
            DateOfNews,
            NewsData,
            ImageOfNews
        });

        await news.save();
        res.status(201).json({ message: 'News created successfully', news });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create news', error });
    }
};

// Delete a News
exports.DeleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findByIdAndDelete(id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Delete the associated image from Cloudinary
        if (news.ImageOfNews && news.ImageOfNews.public_id) {
            await deleteImageFromCloudinary(news.ImageOfNews.public_id);
        }

        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete news', error });
    }
};

// Get All News
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find();
        res.status(200).json(newsList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch news', error });
    }
};
// Get Blog by Name
exports.getBlogByName = async (req, res) => {
    try {
        const { name } = req.params; 
        const blog = await News.findOne({ Headline: name });

        if (!blog) {
            return res.status(404).json({ 
                success:false,
                message: 'Blog not found' 
            });
        }

        res.status(200).json({
            success:false,
            message:"Blog Found Successfully",
            data:blog
        });
    } catch (error) {
        console.error('Error fetching Blog:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get a Single News
exports.getSingleNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch news', error });
    }
};

// Update News with image handling
exports.UpdateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { CreatedBy, Headline, SubHeading, DateOfNews, NewsData } = req.body;
        const news = await News.findById(id);

        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Update news fields
        if (CreatedBy) news.CreatedBy = CreatedBy;
        if (Headline) news.Headline = Headline;
        if (SubHeading) news.SubHeading = SubHeading;
        if (DateOfNews) news.DateOfNews = DateOfNews;
        if (NewsData) news.NewsData = NewsData;

        // Handle image update
        if (req.file) {
            try {
                // If there is an existing image, delete it first
                if (news.ImageOfNews && news.ImageOfNews.public_id) {
                    await deleteImageFromCloudinary(news.ImageOfNews.public_id);
                }

                // Upload the new image
                const imgUrl = await uploadImage(req.file.path);
                news.ImageOfNews = {
                    url: imgUrl.image,
                    public_id: imgUrl.public_id
                };

                // Optionally delete local file after upload
                fs.unlinkSync(req.file.path);

            } catch (error) {
                return res.status(500).json({ success: false, message: 'Failed to update image' });
            }
        }

        await news.save();
        res.status(200).json({ message: 'News updated successfully', updatedNews: news });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update news', error });
    }
};
