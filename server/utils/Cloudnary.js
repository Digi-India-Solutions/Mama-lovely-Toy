const cloudinary = require('cloudinary').v2;

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY || "899193287131934",
    api_secret: process.env.CLOUDINARY_SECRET_KEY || "RN9ldy9uHfeWDTqWRPOX2-cvgMg",
    cloud_name: process.env.CLOUD_NAME || "dohzhn0ny"
});

const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: "image"
        });
        return { image: result.secure_url, public_id: result.public_id };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload Image');
    }
};


const deleteImageFromCloudinary = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        console.log("Image Deleted");
    } catch (error) {
        console.error("Error deleting Image from Cloudinary", error);
        throw new Error('Failed to delete Image from Cloudinary');
    }
};


module.exports = {
    uploadImage, deleteImageFromCloudinary,
};