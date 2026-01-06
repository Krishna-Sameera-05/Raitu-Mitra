import express from 'express';
import Order from '../models/Order.js';
import PestProduct from '../models/PestProduct.js'; // To check stock/prices if needed
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Place a new order
// @access  Protected
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'No products in order' });
        }

        const newOrder = new Order({
            userId: req.user.userId, // From auth middleware
            products,
            totalAmount,
            shippingAddress
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: newOrder
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/orders
// @desc    Get logged in user's orders
// @access  Protected
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin only)
// @access  Protected
router.get('/all', authenticateToken, async (req, res) => {
    try {
        // Implement admin check here if strict
        const orders = await Order.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status and delivery date (Admin)
// @access  Protected
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status, deliveryDate } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (status) order.status = status;
        if (deliveryDate) order.deliveryDate = deliveryDate;

        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
