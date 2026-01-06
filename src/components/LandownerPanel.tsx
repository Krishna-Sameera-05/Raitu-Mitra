import { useState } from 'react';
import { LogOut, LayoutDashboard, UserCircle, BrainCircuit, ShoppingBag, HelpCircle } from 'lucide-react';
import LandownerProfile from './LandownerProfile';
import AddLands from './AddLands';
import SmartFarmingDashboard from './SmartFarmingDashboard';
import PestStore from './PestStore';
import HelpDesk from './HelpDesk';

interface LandownerPanelProps {
  onLogout: () => void;
}

export default function LandownerPanel({ onLogout }: LandownerPanelProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Add Lands', icon: LayoutDashboard },
    { id: 'prediction', label: 'AI Prediction', icon: BrainCircuit },
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
                <h1 className="text-xl font-bold text-gray-800">Landowner Dashboard</h1>
                <p className="text-xs text-gray-500">RAITU MITRA</p>
              </div>
            </div>

            {/* Navigation Menu (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${activeTab === item.id
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Menu (Mobile Overflow) - Simple horizontal scroll for now if needed, but handled by hidden md:flex above. 
                For specific mobile support, we'd need a hamburger menu, but kept simple as per existing code.
             */}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'profile' && <LandownerProfile />}
        {activeTab === 'dashboard' && <AddLands />}
        {activeTab === 'prediction' && <SmartFarmingDashboard />}
        {activeTab === 'peststore' && <PestStore />}
        {activeTab === 'help' && <HelpDesk />}
      </div>
    </div>
  );
}
