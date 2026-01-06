import express from 'express';
import Land from '../models/Land.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/lands/browse - Get all lands from all landowners (for farmers to browse)
router.get('/browse', authenticateToken, async (req, res) => {
    try {
        const lands = await Land.find().sort({ createdAt: -1 }).populate('ownerId', 'fullName email');

        res.json({
            success: true,
            lands
        });
    } catch (error) {
        console.error('Error fetching all lands:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lands'
        });
    }
});

// GET /api/lands - Get all lands for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const lands = await Land.find({ ownerId: req.user.userId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            lands
        });
    } catch (error) {
        console.error('Error fetching lands:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lands'
        });
    }
});

// POST /api/lands - Create a new land listing
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            landType,
            cropType,
            duration,
            location,
            phoneNumber,
            email,
            soilType,
            waterSource,
            acres,
            landImage
        } = req.body;

        // Validate required fields
        if (!landType || !cropType || !duration || !location || !phoneNumber || !email || !soilType || !waterSource || !acres) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newLand = new Land({
            ownerId: req.user.userId,
            landType,
            cropType,
            duration,
            location,
            phoneNumber,
            email,
            soilType,
            waterSource,
            acres,
            landImage: landImage || ''
        });

        await newLand.save();

        res.status(201).json({
            success: true,
            message: 'Land added successfully',
            land: newLand
        });
    } catch (error) {
        console.error('Error adding land:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add land'
        });
    }
});

// PUT /api/lands/:id - Update a land listing
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            landType,
            cropType,
            duration,
            location,
            phoneNumber,
            email,
            soilType,
            waterSource,
            acres,
            landImage
        } = req.body;

        // Find the land and verify ownership
        const land = await Land.findOne({ _id: id, ownerId: req.user.userId });

        if (!land) {
            return res.status(404).json({
                success: false,
                message: 'Land not found or unauthorized'
            });
        }

        // Update fields
        land.landType = landType || land.landType;
        land.cropType = cropType || land.cropType;
        land.duration = duration || land.duration;
        land.location = location || land.location;
        land.phoneNumber = phoneNumber || land.phoneNumber;
        land.email = email || land.email;
        land.soilType = soilType || land.soilType;
        land.waterSource = waterSource || land.waterSource;
        land.acres = acres || land.acres;
        if (landImage !== undefined) land.landImage = landImage;

        await land.save();

        res.json({
            success: true,
            message: 'Land updated successfully',
            land
        });
    } catch (error) {
        console.error('Error updating land:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update land'
        });
    }
});

// DELETE /api/lands/:id - Delete a land listing
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the land, verifying ownership
        const land = await Land.findOneAndDelete({ _id: id, ownerId: req.user.userId });

        if (!land) {
            return res.status(404).json({
                success: false,
                message: 'Land not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Land deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting land:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete land'
        });
    }
});

export default router;
