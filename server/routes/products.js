import express from 'express';
import PestProduct from '../models/PestProduct.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all pest products
// @access  Public (Farmers need to see them too)
router.get('/', async (req, res) => {
    try {
        const products = await PestProduct.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/products
// @desc    Add a new pest product
// @access  Protected (Admin only ideally, but using auth for now)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, isNewArrival } = req.body;

        // Basic validation
        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        const newProduct = new PestProduct({
            name,
            description,
            price,
            category,
            imageUrl,
            isNewArrival: isNewArrival !== undefined ? isNewArrival : true
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Protected
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await PestProduct.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await PestProduct.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
