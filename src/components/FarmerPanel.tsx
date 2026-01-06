import { useState } from 'react';
import { LogOut, LayoutDashboard, Search, ShoppingBag, UserCircle, HelpCircle } from 'lucide-react';
import FarmerProfile from './FarmerProfile';
import BrowseLands from './BrowseLands';
import HelpDesk from './HelpDesk';
import PestStore from './PestStore';
import SmartFarmingDashboard from './SmartFarmingDashboard';

interface FarmerPanelProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

export default function FarmerPanel({ onLogout }: FarmerPanelProps) {
  const [activeTab, setActiveTab] = useState('browse');

  const navItems = [
    { id: 'dashboard', label: 'AI Prediction', icon: LayoutDashboard },
    { id: 'browse', label: 'Browse Lands', icon: Search },
    { id: 'peststore', label: 'Pest Store', icon: ShoppingBag },
    { id: 'help', label: 'Help Desk', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 -m-8">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Farmer Dashboard</h1>
                <p className="text-xs text-gray-500">RAITU MITRA</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${activeTab === item.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'profile' && <FarmerProfile />}
        {activeTab === 'dashboard' && <SmartFarmingDashboard />}
        {activeTab === 'browse' && <BrowseLands />}
        {activeTab === 'peststore' && <PestStore />}
        {activeTab === 'help' && <HelpDesk />}
      </div>
    </div>
  );
}
