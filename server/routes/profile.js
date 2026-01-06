import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile - Get user profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            profile: {
                name: user.fullName,
                email: user.email,
                phone: user.phone || '',
                location: user.location || '',
                profilePicture: user.profilePicture || '',
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// PUT /api/profile - Update user profile
router.put('/', authenticateToken, async (req, res) => {
    try {
        const { name, email, phone, location, profilePicture } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.fullName = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile: {
                name: user.fullName,
                email: user.email,
                phone: user.phone,
                location: user.location,
                profilePicture: user.profilePicture,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

export default router;
