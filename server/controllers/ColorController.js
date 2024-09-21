const Color = require('../models/color.model'); // Adjust the path as necessary

exports.createColor = async (req, res) => {
    try {
        const { name, hexCode } = req.body;

        // Create a new color
        const newColor = new Color({ name, hexCode });
        await newColor.save();

        res.status(201).json({
            success: true,
            data: newColor,
            message: 'Color created successfully'
        });
    } catch (error) {
        console.error('Error creating color:', error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.find();

        res.status(200).json({
            success: true,
            data: colors
        });
    } catch (error) {
        console.error('Error fetching colors:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.getColorById = async (req, res) => {
    try {
        const color = await Color.findById(req.params.id);

        if (!color) {
            return res.status(404).json({
                success: false,
                message: 'Color not found'
            });
        }

        res.status(200).json({
            success: true,
            data: color
        });
    } catch (error) {
        console.error('Error fetching color:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.updateColor = async (req, res) => {
    try {
        const { name, hexCode } = req.body;

        const color = await Color.findByIdAndUpdate(
            req.params.id,
            { name, hexCode },
            { new: true, runValidators: true }
        );

        if (!color) {
            return res.status(404).json({
                success: false,
                message: 'Color not found'
            });
        }

        res.status(200).json({
            success: true,
            data: color,
            message: 'Color updated successfully'
        });
    } catch (error) {
        console.error('Error updating color:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.deleteColor = async (req, res) => {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);

        if (!color) {
            return res.status(404).json({
                success: false,
                message: 'Color not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Color deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting color:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
