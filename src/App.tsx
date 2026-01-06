import { useState, useEffect } from 'react';
import { Sprout, Home, Shield, LogOut } from 'lucide-react';
import { authAPI } from './lib/api';
import Auth from './components/Auth';
import FarmerPanel from './components/FarmerPanel';
import LandownerPanel from './components/LandownerPanel';
import AdminPanel from './components/AdminPanel';

type Panel = 'farmer' | 'landowner' | 'admin';

function App() {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authenticatedRole, setAuthenticatedRole] = useState<Panel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const response = await authAPI.verifyToken();
          if (response.success && response.user) {
            setSession({ user: response.user });
            setAuthenticatedRole(response.user.role);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          authAPI.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Automatically redirect to authenticated role panel if trying to access different panel
  useEffect(() => {
    if (authenticatedRole && activePanel && activePanel !== authenticatedRole) {
      setActivePanel(authenticatedRole);
    }
  }, [authenticatedRole, activePanel]);

  const handleSignOut = () => {
    authAPI.logout();
    setSession(null);
    setAuthenticatedRole(null);
    setActivePanel(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!activePanel) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/home_bg.jpg')" }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <img src="/logo.jpg" alt="Logo" className="w-32 h-32 mx-auto mb-6 rounded-full object-cover shadow-xl border-4 border-white" />
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              RAITU MITRA
            </h1>
            <p className="text-xl text-gray-100 drop-shadow-md">
              Connecting Farmers and Landowners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <button
              onClick={() => setActivePanel('farmer')}
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl hover:bg-white/30 hover:shadow-2xl transition-all duration-300 p-8 group hover:-translate-y-2"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm shadow-inner">
                  <Sprout className="w-10 h-10 text-green-300 drop-shadow-sm" />
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Farmer</h2>
                <p className="text-gray-100 text-center font-medium drop-shadow-sm">
                  Browse available lands for farming
                </p>
              </div>
            </button>

            <button
              onClick={() => setActivePanel('landowner')}
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl hover:bg-white/30 hover:shadow-2xl transition-all duration-300 p-8 group hover:-translate-y-2"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm shadow-inner">
                  <Home className="w-10 h-10 text-blue-300 drop-shadow-sm" />
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Landowner</h2>
                <p className="text-gray-100 text-center font-medium drop-shadow-sm">
                  List your land for farming opportunities
                </p>
              </div>
            </button>

            <button
              onClick={() => setActivePanel('admin')}
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl hover:bg-white/30 hover:shadow-2xl transition-all duration-300 p-8 group hover:-translate-y-2"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors backdrop-blur-sm shadow-inner">
                  <Shield className="w-10 h-10 text-amber-300 drop-shadow-sm" />
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Admin</h2>
                <p className="text-gray-100 text-center font-medium drop-shadow-sm">
                  Help, support, and fraud reporting
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Auth
        role={activePanel}
        onSuccess={(authenticatedAs: Panel) => {
          setSession({ user: { email: `${authenticatedAs}@example.com`, role: authenticatedAs } });
          setAuthenticatedRole(authenticatedAs);
        }}
        onBack={() => setActivePanel(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activePanel === 'farmer' ? (
        <FarmerPanel
          onLogout={handleSignOut}
          onBackToHome={() => setActivePanel(null)}
        />
      ) : activePanel === 'landowner' ? (
        <LandownerPanel onLogout={handleSignOut} />
      ) : (
        <>
          <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="/logo.jpg" alt="RAITU MITRA" className="w-8 h-8 rounded-full object-cover" />
                  <h1 className="text-2xl font-bold text-gray-800">RAITU MITRA</h1>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-red-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-4 py-8">
            {activePanel === 'admin' && <AdminPanel />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
