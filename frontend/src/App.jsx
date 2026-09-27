import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LocationPickerModal } from './components/Map/LocationPickerModal';
import { GramMitraAgentModal } from './components/Agent/GramMitraAgentModal';
import { CustomerProfileModal } from './components/Auth/CustomerProfileModal';

// Auth Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Admin Page
import { AdminDashboard } from './pages/AdminDashboard';

// Dashboard & Functional Pages
import { Dashboard } from './pages/Dashboard';
import { WeatherForecast } from './pages/WeatherForecast';
import { PanchayatMap } from './pages/PanchayatMap';
import { MyFields } from './pages/MyFields';
import { AIHyperlocal } from './pages/AIHyperlocal';
import { RainfallPrediction } from './pages/RainfallPrediction';
import { MicroClimate } from './pages/MicroClimate';
import { ForecastConfidence } from './pages/ForecastConfidence';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { ExplainableAI } from './pages/ExplainableAI';
import { CropAdvisory } from './pages/CropAdvisory';
import { SmartIrrigation } from './pages/SmartIrrigation';
import { DiseaseRisk } from './pages/DiseaseRisk';
import { ExtremeWeatherAlerts } from './pages/ExtremeWeatherAlerts';
import { ForecastVsActual } from './pages/ForecastVsActual';
import { FeedbackLearning } from './pages/FeedbackLearning';
import { VoiceAdvisoryPage } from './pages/VoiceAdvisoryPage';
import { SettingsPage } from './pages/Settings';

import { ShieldAlert, X } from 'lucide-react';

const MainAppContent = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  
  // Set default initial tab based on role
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) return hash;
    return 'dashboard';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [accessDeniedNotice, setAccessDeniedNotice] = useState(null);

  // Role-based initial redirect when user logs in or role changes
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin && activeTab === 'dashboard' && !window.location.hash) {
        setActiveTab('admin-dashboard');
        window.location.hash = '#/admin-dashboard';
      } else if (!isAdmin && activeTab.startsWith('admin')) {
        setActiveTab('dashboard');
        window.location.hash = '#/dashboard';
      }
    }
  }, [isAuthenticated, isAdmin]);

  // Synchronize URL Hash and enforce Role-Based Access Control (RBAC)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
      
      // If unauthenticated, prevent accessing protected tabs
      if (!isAuthenticated) {
        if (hash === 'register') {
          setAuthView('register');
        } else {
          setAuthView('login');
        }
        return;
      }

      // Check for Admin-only routes
      const isAdminRoute = hash === 'admin' || hash === 'admin-dashboard' || hash.startsWith('admin-');
      if (isAdminRoute) {
        if (!isAdmin) {
          // Block non-admin from accessing admin dashboard
          setAccessDeniedNotice('Access Denied: You need Administrator privileges to access the Admin Dashboard.');
          setActiveTab('dashboard');
          window.location.hash = '#/dashboard';
          setTimeout(() => setAccessDeniedNotice(null), 5000);
          return;
        } else {
          setActiveTab('admin-dashboard');
          return;
        }
      }

      if (hash) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated, isAdmin]);

  // If user is not authenticated, show Login or Register
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  const handleTabChange = (tab) => {
    // RBAC Check on tab change
    if ((tab === 'admin-dashboard' || tab.startsWith('admin-')) && !isAdmin) {
      setAccessDeniedNotice('Access Denied: You need Administrator privileges to access the Admin Console.');
      setTimeout(() => setAccessDeniedNotice(null), 5000);
      return;
    }

    setActiveTab(tab);
    window.location.hash = `#/${tab}`;

    if (tab === 'ai-agent') {
      setIsAgentModalOpen(true);
    }
  };

  const renderActivePage = () => {
    // Route guard for Admin pages
    if (activeTab === 'admin-dashboard' || activeTab.startsWith('admin-')) {
      if (!isAdmin) {
        return (
          <div className="gm-card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <ShieldAlert size={48} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991B1B', marginBottom: '0.5rem' }}>
              Access Denied
            </h2>
            <p style={{ color: '#7F1D1D', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              You do not have administrative privileges to view this section.
            </p>
            <button
              onClick={() => handleTabChange('dashboard')}
              className="gm-btn gm-btn-primary"
            >
              Return to Customer Dashboard
            </button>
          </div>
        );
      }
      return <AdminDashboard onNavigateToPreview={() => handleTabChange('dashboard')} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        );
      case 'ai-agent':
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        );
      case 'my-location':
      case 'panchayat-map':
        return <PanchayatMap />;
      case 'my-fields':
        return <MyFields onNavigate={(tab) => handleTabChange(tab)} />;
      case 'forecast':
        return <WeatherForecast />;
      case 'rainfall':
        return <RainfallPrediction />;
      case 'microclimate':
        return <MicroClimate />;
      case 'hyperlocal':
        return <AIHyperlocal />;
      case 'confidence':
        return <ForecastConfidence />;
      case 'explainable':
        return <ExplainableAI />;
      case 'simulator':
        return <WhatIfSimulator />;
      case 'crop-advisory':
        return <CropAdvisory />;
      case 'smart-irrigation':
        return <SmartIrrigation />;
      case 'disease-risk':
        return <DiseaseRisk />;
      case 'extreme-weather':
      case 'notifications':
        return <ExtremeWeatherAlerts />;
      case 'forecast-vs-actual':
        return <ForecastVsActual />;
      case 'feedback':
        return <FeedbackLearning />;
      case 'voice-advisory':
        return <VoiceAdvisoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Dashboard 
            onNavigate={(tab) => handleTabChange(tab)} 
            onOpenLocationModal={() => setIsLocationModalOpen(true)} 
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      {/* Top Navigation Header */}
      <Header
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Access Denied Warning Toast / Banner */}
      {accessDeniedNotice && (
        <div style={{
          backgroundColor: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          color: '#991B1B',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: '65px',
          zIndex: 90
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#DC2626" />
            <span>{accessDeniedNotice}</span>
          </div>
          <button
            onClick={() => setAccessDeniedNotice(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Content */}
        <main style={{
          flex: 1,
          padding: '1.5rem',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          overflowX: 'hidden'
        }}>
          {renderActivePage()}
        </main>
      </div>

      {/* Floating GramMitra AI Agent Launcher Button */}
      <button
        onClick={() => setIsAgentModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 800,
          backgroundColor: 'var(--color-dark-green)',
          color: '#FFFFFF',
          border: '2px solid #4CAF50',
          borderRadius: 'var(--radius-full)',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)',
          cursor: 'pointer',
          fontSize: '0.88rem',
          fontWeight: 800,
          transition: 'all 0.2s ease'
        }}
        title="Open GramMitra AI Farmer Advisory Agent"
      >
        <span style={{ fontSize: '1.2rem' }}>🤖</span>
        <span>AI Agent (कृषि मित्र)</span>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }} />
      </button>

      {/* Interactive GramMitra AI Agent Modal */}
      <GramMitraAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Customer Profile & Name Edit Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Location Picker Modal with Google Maps */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <LanguageProvider>
          <MainAppContent />
        </LanguageProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
