import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Phone, Mail, Calendar, Droplet, Mountain, Image as ImageIcon, X } from 'lucide-react';
import { landsAPI } from '../lib/api';

interface Land {
    _id: string;
    landType: string;
    cropType: string;
    duration: number;
    location: string;
    phoneNumber: string;
    email: string;
    soilType: string;
    waterSource: string;
    acres: number;
    landImage?: string;
    createdAt: string;
}

interface LandFormData {
    landType: string;
    cropType: string;
    duration: string;
    location: string;
    phoneNumber: string;
    email: string;
    soilType: string;
    waterSource: string;
    acres: string;
}

export default function AddLands() {
    const [showForm, setShowForm] = useState(false);
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<LandFormData>({
        landType: '',
        cropType: '',
        duration: '',
        location: '',
        phoneNumber: '',
        email: '',
        soilType: '',
        waterSource: '',
        acres: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');

    // Fetch lands on component mount
    useEffect(() => {
        fetchLands();
    }, []);

    const fetchLands = async () => {
        try {
            const response = await landsAPI.getLands();
            if (response.success) {
                setLands(response.lands);
            }
        } catch (error) {
            console.error('Error fetching lands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const landData: any = {
                landType: formData.landType,
                cropType: formData.cropType,
                duration: parseInt(formData.duration),
                location: formData.location,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                soilType: formData.soilType,
                waterSource: formData.waterSource,
                acres: parseFloat(formData.acres),
            };

            // Only add landImage if there's a preview
            if (imagePreview) {
                landData.landImage = imagePreview;
            }

            if (editingId) {
                const response = await landsAPI.updateLand(editingId, landData);
                if (response.success) {
                    alert('Land updated successfully!');
                    setEditingId(null);
                }
            } else {
                const response = await landsAPI.addLand(landData);
                if (response.success) {
                    alert('Land added successfully!');
                }
            }

            // Reset form and refresh lands
            setFormData({
                landType: '',
                cropType: '',
                duration: '',
                location: '',
                phoneNumber: '',
                email: '',
                soilType: '',
                waterSource: '',
                acres: '',
            });
            setImagePreview('');
            setShowForm(false);
            fetchLands();
        } catch (error: any) {
            console.error('Error saving land:', error);
            alert(error.message || 'Failed to save land. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (land: Land) => {
        setFormData({
            landType: land.landType,
            cropType: land.cropType,
            duration: land.duration.toString(),
            location: land.location,
            phoneNumber: land.phoneNumber,
            email: land.email,
            soilType: land.soilType,
            waterSource: land.waterSource,
            acres: land.acres.toString(),
        });
        setImagePreview(land.landImage || '');
        setEditingId(land._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this land?')) {
            return;
        }

        try {
            const response = await landsAPI.deleteLand(id);
            if (response.success) {
                alert('Land deleted successfully!');
                fetchLands();
            }
        } catch (error: any) {
            console.error('Error deleting land:', error);
            alert(error.message || 'Failed to delete land. Please try again.');
        }
    };

    const handleCancel = () => {
        setFormData({
            landType: '',
            cropType: '',
            duration: '',
            location: '',
            phoneNumber: '',
            email: '',
            soilType: '',
            waterSource: '',
            acres: '',
        });
        setImagePreview('');
        setEditingId(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">My Lands</h2>
                    <p className="text-gray-600">Manage your land listings</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium shadow-md"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Land</span>
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {editingId ? 'Edit Land' : 'Add New Land'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Land Image Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Land Photo (Optional)
                            </label>
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Land preview"
                                        className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                        title="Remove image"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full max-w-md h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="text-sm text-gray-600 font-medium">Click to upload land photo</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Land Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Land Type *
                            </label>
                            <input
                                type="text"
                                name="landType"
                                value={formData.landType}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Agricultural, Farmland, Orchard"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Crop Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Type to Harvest *
                            </label>
                            <input
                                type="text"
                                name="cropType"
                                value={formData.cropType}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Wheat, Rice, Vegetables"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Duration (Days) *
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="Number of days"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Acres */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Land Size (Acres) *
                            </label>
                            <input
                                type="number"
                                name="acres"
                                value={formData.acres}
                                onChange={handleChange}
                                required
                                min="0.1"
                                step="0.1"
                                placeholder="e.g., 5.5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="City, State"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            />
                        </div>

                        {/* Soil Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Soil Type *
                            </label>
                            <select
                                name="soilType"
                                value={formData.soilType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            >
                                <option value="">Select soil type</option>
                                <option value="Clay">Clay</option>
                                <option value="Sandy">Sandy</option>
                                <option value="Loamy">Loamy</option>
                                <option value="Silty">Silty</option>
                                <option value="Peaty">Peaty</option>
                                <option value="Chalky">Chalky</option>
                            </select>
                        </div>

                        {/* Water Source */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Water Source *
                            </label>
                            <select
                                name="waterSource"
                                value={formData.waterSource}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            >
                                <option value="">Select water source</option>
                                <option value="Well">Well</option>
                                <option value="River">River</option>
                                <option value="Canal">Canal</option>
                                <option value="Rainwater">Rainwater</option>
                                <option value="Borewell">Borewell</option>
                                <option value="Pond">Pond</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{editingId ? 'Updating...' : 'Adding...'}</span>
                                    </>
                                ) : (
                                    <span>{editingId ? 'Update Land' : 'Add Land'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lands List */}
            {lands.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No lands added yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first land listing</p>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium shadow-md inline-flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Your First Land</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lands.map((land) => (
                        <div key={land._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Land Image */}
                            {land.landImage && (
                                <div className="w-full h-48 overflow-hidden">
                                    <img
                                        src={land.landImage}
                                        alt={land.landType}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{land.landType}</h3>
                                        <p className="text-amber-600 font-semibold">{land.cropType}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(land)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(land._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                                        <span>{land.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-amber-600" />
                                        <span>{land.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-amber-600" />
                                        <span>{land.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                                        <span>{land.duration} days</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Acres</p>
                                        <p className="font-semibold text-gray-800">{land.acres}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Soil Type</p>
                                        <p className="font-semibold text-gray-800">{land.soilType}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Water Source</p>
                                        <p className="font-semibold text-gray-800 flex items-center">
                                            <Droplet className="w-3 h-3 mr-1 text-blue-500" />
                                            {land.waterSource}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
