const Size = require('../models/size.model');

// Create a new size
exports.createSize = async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check if the size already exists
        const existingSize = await Size.findOne({ name });
        if (existingSize) {
            return res.status(400).json({ message: 'Size already exists' });
        }
        
        const newSize = new Size({ name });
        await newSize.save();
        res.status(201).json({ message: 'Size created successfully', size: newSize });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all sizes
exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.find();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single size by ID
exports.getSizeById = async (req, res) => {
    try {
        const { id } = req.params;
        const size = await Size.findById(id);
        
        if (!size) {
            return res.status(404).json({ message: 'Size not found' });
        }
        
        res.status(200).json(size);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a size by ID
exports.updateSize = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Find the size by ID and update it
        const updatedSize = await Size.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedSize) {
            return res.status(404).json({ message: 'Size not found' });
        }

        res.status(200).json({ message: 'Size updated successfully', size: updatedSize });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a size by ID
exports.deleteSize = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSize = await Size.findByIdAndDelete(id);

        if (!deletedSize) {
            return res.status(404).json({ message: 'Size not found' });
        }

        res.status(200).json({ message: 'Size deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

