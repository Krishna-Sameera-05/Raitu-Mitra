import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Calendar, Droplet, Mountain, User, X } from 'lucide-react';
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
    ownerId?: {
        fullName: string;
        email: string;
    };
}

export default function BrowseLands() {
    const [lands, setLands] = useState<Land[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLand, setSelectedLand] = useState<Land | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);

    const handleContactClick = (land: Land) => {
        setSelectedLand(land);
        setShowContactModal(true);
    };

    const handleCloseModal = () => {
        setShowContactModal(false);
        setSelectedLand(null);
    };

    useEffect(() => {
        fetchLands();
    }, []);

    const fetchLands = async () => {
        try {
            const response = await landsAPI.browseLands();
            if (response.success) {
                setLands(response.lands);
            }
        } catch (error) {
            console.error('Error fetching lands:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLands = lands.filter((land) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            land.landType.toLowerCase().includes(searchLower) ||
            land.cropType.toLowerCase().includes(searchLower) ||
            land.location.toLowerCase().includes(searchLower) ||
            land.soilType.toLowerCase().includes(searchLower) ||
            land.waterSource.toLowerCase().includes(searchLower)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Browse Available Lands</h2>
                <p className="text-gray-600">Explore farming opportunities from landowners</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by land type, crop, location, soil, or water source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
            </div>

            {/* Lands Grid */}
            {filteredLands.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <Mountain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {searchTerm ? 'No lands found' : 'No lands available yet'}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Check back later for new farming opportunities'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLands.map((land) => (
                        <div
                            key={land._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Land Image */}
                            {land.landImage ? (
                                <div className="w-full h-48 overflow-hidden">
                                    <img
                                        src={land.landImage}
                                        alt={land.landType}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                                    <Mountain className="w-16 h-16 text-green-600 opacity-50" />
                                </div>
                            )}

                            <div className="p-6">
                                {/* Land Details */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">{land.landType}</h3>
                                    <p className="text-green-600 font-semibold text-lg">{land.cropType}</p>
                                </div>

                                {/* Owner Info */}
                                {land.ownerId && (
                                    <div className="mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <User className="w-4 h-4 mr-2 text-green-600" />
                                            <span className="font-medium">{land.ownerId.fullName}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Contact & Location Info */}
                                <div className="space-y-2 text-sm mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span>{land.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span>{land.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span className="truncate">{land.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                                        <span>{land.duration} days</span>
                                    </div>
                                </div>

                                {/* Land Specs */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-gray-500 text-xs mb-1">Acres</p>
                                        <p className="font-semibold text-gray-800">{land.acres}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-gray-500 text-xs mb-1">Soil Type</p>
                                        <p className="font-semibold text-gray-800">{land.soilType}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3 col-span-2">
                                        <p className="text-gray-500 text-xs mb-1">Water Source</p>
                                        <p className="font-semibold text-gray-800 flex items-center">
                                            <Droplet className="w-3 h-3 mr-1 text-blue-500" />
                                            {land.waterSource}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Button */}
                                <button
                                    onClick={() => handleContactClick(land)}
                                    className="w-full mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Contact Landowner
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results Count */}
            {filteredLands.length > 0 && (
                <div className="mt-6 text-center text-gray-600">
                    Showing {filteredLands.length} of {lands.length} available lands
                </div>
            )}

            {/* Contact Modal */}
            {showContactModal && selectedLand && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Modal Header */}
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Contact Information
                            </h3>
                            <p className="text-gray-600">
                                Get in touch with the landowner
                            </p>
                        </div>

                        {/* Landowner Details */}
                        <div className="space-y-4">
                            {/* Owner Name */}
                            {selectedLand.ownerId && (
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="bg-green-600 rounded-full p-2 mr-3">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Landowner</p>
                                            <p className="font-semibold text-gray-800">
                                                {selectedLand.ownerId.fullName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Phone Number */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-blue-600 rounded-full p-2 mr-3">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                        <a
                                            href={`tel:${selectedLand.phoneNumber}`}
                                            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                                        >
                                            {selectedLand.phoneNumber}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-purple-600 rounded-full p-2 mr-3">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                        <a
                                            href={`mailto:${selectedLand.email}`}
                                            className="font-semibold text-gray-800 hover:text-purple-600 transition-colors block truncate"
                                        >
                                            {selectedLand.email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="bg-orange-600 rounded-full p-2 mr-3">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">Location</p>
                                        <p className="font-semibold text-gray-800">
                                            {selectedLand.location}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                            <a
                                href={`tel:${selectedLand.phoneNumber}`}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors text-center flex items-center justify-center"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                Call Now
                            </a>
                            <a
                                href={`mailto:${selectedLand.email}`}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors text-center flex items-center justify-center"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
