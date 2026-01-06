import { useState } from 'react';
import { Search, Sprout, BrainCircuit, Activity, CheckCircle, TrendingUp, AlertTriangle, Clock, DollarSign, Cloud, FlaskConical, BarChart3 } from 'lucide-react';
import FarmMap from './FarmMap';

interface Crop {
    id: string;
    name: string;
    category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses';
    image: string;
    price: string;
    suitableStates: string[];
}

const cropData: Crop[] = [
    // Vegetables
    { id: '1', name: 'Brinjal (Eggplant)', category: 'Vegetables', image: '/crops/brinjal.png', price: '₹30/kg', suitableStates: ['All'] },
    { id: '2', name: 'Cabbage', category: 'Vegetables', image: '/crops/cabbage.png', price: '₹25/kg', suitableStates: ['All'] },
    { id: '3', name: 'Cauliflower', category: 'Vegetables', image: '/crops/cauliflower.png', price: '₹40/kg', suitableStates: ['All'] },
    { id: '4', name: 'Spinach', category: 'Vegetables', image: '/crops/spinach.png', price: '₹25/kg', suitableStates: ['All'] },
    { id: '5', name: 'Okra (Lady\'s Finger)', category: 'Vegetables', image: '/crops/okra.png', price: '₹50/kg', suitableStates: ['Maharashtra', 'Gujarat', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Madhya Pradesh'] },
    { id: '6', name: 'Cucumber', category: 'Vegetables', image: '/crops/cucumber.png', price: '₹25/kg', suitableStates: ['All'] },
    { id: '7', name: 'Bell Pepper (Capsicum)', category: 'Vegetables', image: '/crops/bell_pepper.png', price: '₹70/kg', suitableStates: ['Himachal Pradesh', 'Karnataka', 'Tamil Nadu', 'Kerala'] },
    { id: '8', name: 'Radish', category: 'Vegetables', image: '/crops/radish.png', price: '₹25/kg', suitableStates: ['All'] },

    // Fruits
    { id: '9', name: 'Apple', category: 'Fruits', image: '/crops/apple.png', price: '₹120/kg', suitableStates: ['Himachal Pradesh', 'Jammu & Kashmir', 'Uttarakhand'] },
    { id: '10', name: 'Banana', category: 'Fruits', image: '/crops/banana.png', price: '₹40/kg', suitableStates: ['All'] },
    { id: '11', name: 'Mango', category: 'Fruits', image: '/crops/mango.png', price: '₹90/kg', suitableStates: ['Maharashtra', 'Uttar Pradesh', 'Andhra Pradesh', 'Karnataka'] },
    { id: '12', name: 'Grapes', category: 'Fruits', image: '/crops/grapes.png', price: '₹80/kg', suitableStates: ['Maharashtra', 'Karnataka', 'Tamil Nadu'] },

    // Grains
    { id: '13', name: 'Wheat', category: 'Grains', image: '/crops/wheat.png', price: '₹25/kg', suitableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'] },
    { id: '14', name: 'Rice (Paddy)', category: 'Grains', image: '/crops/rice.png', price: '₹30/kg', suitableStates: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Odisha', 'Andhra Pradesh'] },

    // Pulses
    { id: '15', name: 'Chickpeas (Chana)', category: 'Pulses', image: '/crops/chickpeas.png', price: '₹60/kg', suitableStates: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh'] }
];

const STATE_COORDINATES: Record<string, [number, number]> = {
    "Andhra Pradesh": [15.9129, 79.7400], "Arunachal Pradesh": [28.2180, 94.7278], "Assam": [26.2006, 92.9376], "Bihar": [25.0961, 85.3131], "Chhattisgarh": [21.2787, 81.8661], "Goa": [15.2993, 74.1240], "Gujarat": [22.2587, 71.1924], "Haryana": [29.0588, 76.0856], "Himachal Pradesh": [31.1048, 77.1734], "Jharkhand": [23.6102, 85.2799], "Karnataka": [15.3173, 75.7139], "Kerala": [10.8505, 76.2711], "Madhya Pradesh": [22.9734, 78.6569], "Maharashtra": [19.7515, 75.7139], "Manipur": [24.6637, 93.9063], "Meghalaya": [25.4670, 91.3662], "Mizoram": [23.1645, 92.9376], "Nagaland": [26.1584, 94.5624], "Odisha": [20.9517, 85.0985], "Punjab": [31.1471, 75.3412], "Rajasthan": [27.0238, 74.2179], "Sikkim": [27.5330, 88.5122], "Tamil Nadu": [11.1271, 78.6569], "Telangana": [18.1124, 79.0193], "Tripura": [23.9408, 91.9882], "Uttar Pradesh": [26.8467, 80.9462], "Uttarakhand": [30.0668, 79.0193], "West Bengal": [22.9868, 87.8550], "Delhi": [28.7041, 77.1025]
};

interface AIResult {
    survivalProbability: string;
    expectedYield: string;
    marketValue: string;
    harvestTime: string;
    estimatedNetProfit: string;
    roi: string;
    recommendations: string[];
    risks: Array<{ name: string; level: 'HIGH' | 'MEDIUM' | 'LOW'; description: string }>;
}

export default function SmartFarmingDashboard() {
    const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All Crops');
    const [searchTerm, setSearchTerm] = useState('');
    const [addressInput, setAddressInput] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);

    const [formData, setFormData] = useState({
        growingSeason: '',
        soilType: '',
        landArea: '',
        state: '',
        city: '',
        soilQuality: '',
        phLevel: '7',
        nitrogen: '50',
        phosphorus: '30',
        potassium: '40',
        organicMatter: '3.5'
    });

    const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
    const [aiResult, setAiResult] = useState<AIResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`);
            const data = await response.json();
            const addr = data.display_name;
            const state = data.address?.state || '';
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || data.address?.state_district || data.address?.municipality || '';

            setLocation({ lat, lng, address: addr });
            setAddressInput(addr);
            setFormData(prev => ({ ...prev, state: state, city: city }));
        } catch (error) {
            console.error("Error fetching address:", error);
            setLocation({ lat, lng, address: `${lat}, ${lng}` });
        }
    };

    const handleAddressSearch = async () => {
        if (!addressInput) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=jsonv2&limit=1&addressdetails=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name, address } = data[0];
                const latNum = parseFloat(lat);
                const lngNum = parseFloat(lon);
                setLocation({ lat: latNum, lng: lngNum, address: display_name });
                setMapCenter([latNum, lngNum]);
                setFormData(prev => ({
                    ...prev,
                    state: address?.state || '',
                    city: address?.city || address?.town || address?.village || address?.county || address?.state_district || address?.municipality || ''
                }));
            } else {
                alert("Location not found!");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Error searching location");
        }
    };

    const handleStateChange = (stateName: string) => {
        setFormData(prev => ({ ...prev, state: stateName }));
        const coords = STATE_COORDINATES[stateName];
        if (coords) {
            setMapCenter(coords);
            handleLocationSelect(coords[0], coords[1]);
        }
    };

    const handlePredict = async () => {
        if (!selectedCrop || !location) {
            alert("Please complete all sections first.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    crop: selectedCrop,
                    location,
                    formData
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Prediction failed");
            }

            setAiResult(data);
        } catch (error: any) {
            console.error("Prediction Error:", error);
            alert(`Prediction Service Error: ${error.message}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    const filteredCrops = cropData.filter(c => {
        // Filter by Category
        if (selectedCategory !== 'All Crops' && c.category !== selectedCategory) {
            return false;
        }

        // Filter by Search Term
        if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Filter by Location Strategy (Optional: User can disable/enable this, defaulting to allowing all if search is explicit)
        // If state is selected, prioritize suitable crops, but if searching specially, maybe show all?
        // Let's stick to showing simplified filtering for now to match User Request about Categories
        return true;
    });

    const categories = ['All Crops', 'Fruits', 'Vegetables', 'Grains', 'Pulses'];

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Crop Price Prediction Platform</h1>
                <p className="text-gray-600">Forecast market prices and optimize your farming strategy based on location and seasonality.</p>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                    Weather & Cloud Map
                </h2>
                <div className="mb-4 flex gap-2">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
                            placeholder="Enter address or city..."
                            className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    <button onClick={handleAddressSearch} className="bg-green-600 text-white px-6 rounded-xl font-medium hover:bg-green-700 transition-colors">Locate</button>
                </div>
                <div className="h-96 rounded-xl overflow-hidden shadow-inner border border-gray-200 relative z-0">
                    <FarmMap onLocationSelect={handleLocationSelect} center={mapCenter} />
                    {location && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] opacity-95">
                            <p className="font-semibold text-gray-800 flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                Selected: {location.address}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Crop Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Sprout className="w-5 h-5 mr-2 text-green-600" />
                    Select Crop Type
                </h2>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search crops..."
                        className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-gray-50"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                ? 'bg-green-100 text-green-800 border-2 border-green-200 shadow-sm'
                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Crop Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {filteredCrops.length > 0 ? filteredCrops.map(crop => (
                        <div
                            key={crop.id}
                            onClick={() => setSelectedCrop(crop)}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 group ${selectedCrop?.id === crop.id ? 'border-green-500 ring-2 ring-green-200' : 'border-transparent hover:border-gray-200 shadow-md'
                                }`}
                        >
                            <div className="h-40 overflow-hidden bg-gray-100 relative">
                                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                    {crop.category}
                                </div>
                            </div>
                            <div className="p-3 text-center">
                                <h3 className="font-bold text-gray-800 text-lg">{crop.name}</h3>
                                <p className="text-xs text-gray-500">{crop.category}</p>
                                <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{crop.price}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            <p>No crops found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Farm Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                    Farm Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Growing Season</label>
                        <select value={formData.growingSeason} onChange={(e) => setFormData({ ...formData, growingSeason: e.target.value })} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="">Select Season</option>
                            <option value="Kharif (June-October)">Kharif (June-October)</option>
                            <option value="Rabi (November-April)">Rabi (November-April)</option>
                            <option value="Zaid (April-June)">Zaid (April-June)</option>
                            <option value="Year Round">Year Round</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type</label>
                        <select value={formData.soilType} onChange={(e) => setFormData({ ...formData, soilType: e.target.value })} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="">Select Soil Type</option>
                            <option value="Alluvial">Alluvial</option>
                            <option value="Black">Black</option>
                            <option value="Red">Red</option>
                            <option value="Laterite">Laterite</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Land Area (Ha)</label>
                        <input type="number" value={formData.landArea} onChange={(e) => setFormData({ ...formData, landArea: e.target.value })} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                        <select value={formData.state} onChange={(e) => handleStateChange(e.target.value)} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="">Select State</option>
                            {Object.keys(STATE_COORDINATES).sort().map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City / District</label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="Auto-detected from location"
                        />
                    </div>
                </div>
            </div>

            {/* Soil Analysis & Nutrients */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FlaskConical className="w-5 h-5 mr-2 text-green-600" />
                    Soil Analysis
                </h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Overall Soil Quality</label>
                        <select
                            value={formData.soilQuality}
                            onChange={(e) => setFormData({ ...formData, soilQuality: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="">Select Overall Quality</option>
                            <option value="High">High (Fertile)</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low (Degraded)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">pH Level (0-14)</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0" max="14" step="0.1"
                                value={formData.phLevel}
                                onChange={(e) => setFormData({ ...formData, phLevel: e.target.value })}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                            />
                            <div className="mt-1 text-xs font-semibold text-green-600">
                                {Number(formData.phLevel) === 7 ? 'Neutral' : Number(formData.phLevel) < 7 ? 'Acidic' : 'Alkaline'} (pH {formData.phLevel})
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center mt-8 border-t border-gray-100 pt-6">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Nutrient Levels
                </h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nitrogen (%)</label>
                        <input
                            type="number"
                            value={formData.nitrogen}
                            onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 mb-2"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(Number(formData.nitrogen), 100)}%` }}></div>
                        </div>
                        <span className={`text-xs font-medium ${Number(formData.nitrogen) > 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Number(formData.nitrogen) > 70 ? 'High' : Number(formData.nitrogen) > 30 ? 'Medium' : 'Low'}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phosphorus (%)</label>
                        <input
                            type="number"
                            value={formData.phosphorus}
                            onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 mb-2"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(Number(formData.phosphorus), 100)}%` }}></div>
                        </div>
                        <span className={`text-xs font-medium ${Number(formData.phosphorus) > 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Number(formData.phosphorus) > 70 ? 'High' : Number(formData.phosphorus) > 30 ? 'Medium' : 'Low'}
                        </span>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Potassium (%)</label>
                        <input
                            type="number"
                            value={formData.potassium}
                            onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 mb-2"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${Math.min(Number(formData.potassium), 100)}%` }}></div>
                        </div>
                        <span className={`text-xs font-medium ${Number(formData.potassium) > 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {Number(formData.potassium) > 70 ? 'High' : Number(formData.potassium) > 30 ? 'Medium' : 'Low'}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Sprout className="w-4 h-4 mr-2 text-green-600" />
                        Organic Matter (%)
                    </label>
                    <input
                        type="number"
                        value={formData.organicMatter}
                        onChange={(e) => setFormData({ ...formData, organicMatter: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-xs text-green-600 font-medium mt-1 block">
                        {Number(formData.organicMatter) > 5 ? 'High' : Number(formData.organicMatter) > 2 ? 'Medium' : 'Low'} ({formData.organicMatter}%)
                    </span>
                </div>
            </div>

            {/* AI Submit Button */}
            <div className="flex justify-center">
                <button
                    onClick={handlePredict}
                    disabled={loading || !selectedCrop || !location}
                    className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <BrainCircuit className="w-6 h-6 mr-2" />
                            AI Submit Prediction
                        </>
                    )}
                </button>
            </div>

            {/* AI Results Section */}
            {aiResult && (
                <div className="space-y-6 animate-slideUp">
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
                            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-medium">Survival Probability</p>
                            <p className="text-3xl font-bold text-green-700 mt-2">{aiResult.survivalProbability}</p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
                            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-blue-800 font-medium">Expected Yield</p>
                            <p className="text-3xl font-bold text-blue-700 mt-2">{aiResult.expectedYield}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-100">
                            <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                            <p className="text-emerald-800 font-medium">Market Value</p>
                            <p className="text-3xl font-bold text-emerald-700 mt-2">{aiResult.marketValue}</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-100">
                            <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-orange-800 font-medium">Harvest Time</p>
                            <p className="text-2xl font-bold text-orange-700 mt-2">{aiResult.harvestTime}</p>
                        </div>
                    </div>

                    {/* Profit Analysis */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Profit Analysis</h3>
                            <p className="text-gray-500 text-sm">Estimated returns based on current market trends</p>
                        </div>
                        <div className="flex gap-12">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Estimated Net Profit</p>
                                <p className="text-3xl font-bold text-green-600">{aiResult.estimatedNetProfit}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Return on Investment</p>
                                <p className="text-3xl font-bold text-blue-600">{aiResult.roi}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <Sprout className="w-5 h-5 mr-2 text-green-600" />
                            AI Recommendations
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {aiResult.recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                                    <p className="text-gray-700">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                            Risk Factors
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {aiResult.risks.map((risk, i) => (
                                <div key={i} className={`p-4 rounded-lg border-l-4 ${risk.level === 'HIGH' ? 'bg-red-50 border-red-500' :
                                    risk.level === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' :
                                        'bg-green-50 border-green-500'
                                    }`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-gray-800">{risk.name}</h4>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${risk.level === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            risk.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>{risk.level}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{risk.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
