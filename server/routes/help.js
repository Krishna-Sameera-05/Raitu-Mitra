import express from 'express';
import HelpRequest from '../models/HelpRequest.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/help
// @desc    Submit a new help request
// @access  Public (or Protected if we require login)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { subject, message, role } = req.body;

        // Ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const newRequest = new HelpRequest({
            senderId: req.user.userId,
            senderName: req.user.email, // Or fetch full name if available, for now using email
            senderRole: role || req.user.role || 'user',
            subject,
            message
        });

        await newRequest.save();

        res.status(201).json({
            success: true,
            message: 'Help request submitted successfully',
            data: newRequest
        });
    } catch (error) {
        console.error('Error submitting help request:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/help
// @desc    Get all help requests (Admin only)
// @access  Protected
router.get('/', authenticateToken, async (req, res) => {
    try {
        // In a real app, check for admin privileges here
        // if (req.user.role !== 'admin') return res.status(403).json(...);

        const requests = await HelpRequest.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        console.error('Error fetching help requests:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
