import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, X, Edit2 } from 'lucide-react';
import { profileAPI } from '../lib/api';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    location: string;
    profilePicture: string;
}

export default function FarmerProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        email: '',
        phone: '',
        location: '',
        profilePicture: '',
    });
    const [createdAt, setCreatedAt] = useState<string>('');

    const [editedData, setEditedData] = useState<ProfileData>(profileData);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Fetch profile data from MongoDB on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileAPI.getProfile();
                if (response.success && response.profile) {
                    const profile = response.profile;
                    const data = {
                        name: profile.name || '',
                        email: profile.email || '',
                        phone: profile.phone || '',
                        location: profile.location || '',
                        profilePicture: profile.profilePicture || '',
                    };
                    setProfileData(data);
                    setEditedData(data);
                    setCreatedAt(profile.createdAt || '');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        setEditedData(profileData);
        setImagePreview(profileData.profilePicture);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedData(profileData);
        setImagePreview(profileData.profilePicture);
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await profileAPI.updateProfile(editedData);
            if (response.success) {
                setProfileData(editedData);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof ProfileData, value: string) => {
        setEditedData({ ...editedData, [field]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setEditedData({ ...editedData, profilePicture: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatMemberSince = (dateString: string) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-32"></div>

                {/* Profile Content */}
                <div className="px-8 pb-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                        <div className="flex items-end space-x-5">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center overflow-hidden">
                                    {(isEditing ? imagePreview : profileData.profilePicture) ? (
                                        <img
                                            src={isEditing ? imagePreview : profileData.profilePicture}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
                                            {getInitials(isEditing ? editedData.name : profileData.name)}
                                        </span>
                                    )}
                                </div>
                                {isEditing && (
                                    <label
                                        htmlFor="profile-upload"
                                        className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors border-2 border-white"
                                    >
                                        <Camera className="w-5 h-5 text-white" />
                                        <input
                                            id="profile-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="pb-2">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {isEditing ? editedData.name : profileData.name}
                                </h2>
                                <p className="text-gray-500">Farmer</p>
                            </div>
                        </div>

                        {/* Edit/Save Buttons */}
                        <div className="mt-4 md:mt-0 md:pb-2">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-md"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center space-x-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Save</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {/* Full Name */}
                        <div>
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                <User className="w-4 h-4 text-green-600" />
                                <span>Full Name</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                    {profileData.name}
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                <Mail className="w-4 h-4 text-green-600" />
                                <span>Email Address</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editedData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your email"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                    {profileData.email}
                                </div>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                <Phone className="w-4 h-4 text-green-600" />
                                <span>Phone Number</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editedData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your phone number"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                    {profileData.phone}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span>Location</span>
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedData.location}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your location"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 font-medium">
                                    {profileData.location}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs text-gray-600 mb-1">Account Type</p>
                                <p className="text-sm font-semibold text-green-700">Farmer</p>
                            </div>
                            <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs text-gray-600 mb-1">Member Since</p>
                                <p className="text-sm font-semibold text-green-700">{formatMemberSince(createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
