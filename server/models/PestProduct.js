import mongoose from 'mongoose';

const PestProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Organic', 'Biological', 'Botanical', 'Chemical', 'Other'],
        default: 'Other'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    inStock: {
        type: Boolean,
        default: true
    },
    isNewArrival: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('PestProduct', PestProductSchema);
