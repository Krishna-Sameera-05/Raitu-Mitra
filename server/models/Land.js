import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    landType: {
        type: String,
        required: true,
        trim: true
    },
    cropType: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    soilType: {
        type: String,
        required: true,
        trim: true
    },
    waterSource: {
        type: String,
        required: true,
        trim: true
    },
    acres: {
        type: Number,
        required: true
    },
    landImage: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
landSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Land = mongoose.model('Land', landSchema);

export default Land;
