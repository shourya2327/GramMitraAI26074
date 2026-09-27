import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  MapPin, 
  Wheat, 
  CloudSun, 
  Map, 
  CloudRain, 
  Thermometer, 
  Cpu, 
  Target, 
  Brain, 
  FlaskConical, 
  Sprout, 
  Droplet, 
  Bug, 
  AlertTriangle, 
  Bell, 
  BarChart2, 
  RotateCcw, 
  Mic, 
  Settings, 
  LogOut,
  X,
  Bot,
  Sparkles,
  ShieldCheck,
  Users,
  Radio,
  Activity,
  Layers
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isOpenMobile, onCloseMobile }) => {
  const { t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();

  // Navigation for Admins
  const adminNavGroups = [
    {
      group: "ADMINISTRATION",
      items: [
        { id: "admin-dashboard", label: "Admin Console", icon: ShieldCheck, badge: "Admin" },
        { id: "admin-customers", label: "Customer Management", icon: Users },
        { id: "admin-broadcast", label: "Advisory Broadcast", icon: Radio },
        { id: "admin-system", label: "System Telemetry", icon: Activity },
      ]
    },
    {
      group: "PLATFORM PREVIEW",
      items: [
        { id: "dashboard", label: "Farmer App View", icon: Home },
        { id: "panchayat-map", label: "Weather Radar Map", icon: Map },
        { id: "extreme-weather", label: "Disaster Alerts", icon: AlertTriangle },
      ]
    },
    {
      group: "PREFERENCES",
      items: [
        { id: "settings", label: t("nav.settings"), icon: Settings },
      ]
    }
  ];

  // Navigation for Farmers / Customers
  const farmerNavGroups = [
    {
      group: "MAIN",
      items: [
        { id: "dashboard", label: t("nav.dashboard"), icon: Home },
        { id: "my-location", label: t("nav.myLocation"), icon: MapPin },
        { id: "my-fields", label: t("nav.myFields"), icon: Wheat },
      ]
    },
    {
      group: "WEATHER",
      items: [
        { id: "forecast", label: t("nav.forecast"), icon: CloudSun },
        { id: "panchayat-map", label: t("nav.panchayatMap"), icon: Map },
        { id: "rainfall", label: t("nav.rainfall"), icon: CloudRain },
        { id: "microclimate", label: t("nav.microclimate"), icon: Thermometer },
      ]
    },
    {
      group: "AI & ML",
      items: [
        { id: "ai-agent", label: "GramMitra AI Agent", icon: Bot, badge: "Live" },
        { id: "hyperlocal", label: t("nav.hyperlocal"), icon: Cpu, badge: "AI" },
        { id: "confidence", label: t("nav.confidence"), icon: Target },
        { id: "explainable", label: t("nav.explainable"), icon: Brain, badge: "SHAP" },
        { id: "simulator", label: t("nav.simulator"), icon: FlaskConical },
      ]
    },
    {
      group: "SMART FARMING",
      items: [
        { id: "crop-advisory", label: t("nav.cropAdvisory"), icon: Sprout },
        { id: "smart-irrigation", label: t("nav.smartIrrigation"), icon: Droplet },
        { id: "disease-risk", label: t("nav.diseaseRisk"), icon: Bug },
      ]
    },
    {
      group: "ALERTS & COMMUNICATION",
      items: [
        { id: "extreme-weather", label: t("nav.alerts"), icon: AlertTriangle, alertBadge: true },
        { id: "voice-advisory", label: t("nav.voiceAdvisory"), icon: Mic },
      ]
    },
    {
      group: "ANALYTICS & LEARNING",
      items: [
        { id: "forecast-vs-actual", label: t("nav.forecastVsActual"), icon: BarChart2 },
        { id: "feedback", label: t("nav.feedback"), icon: RotateCcw },
      ]
    },
    {
      group: "SYSTEM",
      items: [
        { id: "settings", label: t("nav.settings"), icon: Settings },
      ]
    }
  ];

  const activeNavGroups = isAdmin ? adminNavGroups : farmerNavGroups;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 140,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      <aside className={`sidebar-container ${isOpenMobile ? 'mobile-open' : ''}`} style={{
        width: '260px',
        backgroundColor: 'var(--color-card-bg)',
        borderRight: '1px solid var(--color-border)',
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: '65px',
        overflowY: 'auto',
        padding: '1rem 0.75rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 145,
        transition: 'transform 0.3s ease'
      }}>
        <div>
          {/* Mobile close button */}
          <div style={{ display: 'none', justifyContent: 'flex-end', marginBottom: '0.5rem' }} className="mobile-close-bar">
            <button onClick={onCloseMobile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--color-secondary-text)" />
            </button>
          </div>

          {/* Admin Banner in Sidebar if Admin */}
          {isAdmin && (
            <div style={{
              margin: '0 0.25rem 1rem',
              padding: '0.65rem 0.75rem',
              backgroundColor: '#FAF5FF',
              border: '1px solid #E9D5FF',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={18} color="#7C3AED" />
              <div>
                <strong style={{ fontSize: '0.78rem', color: '#6B21A8', display: 'block' }}>
                  ADMIN CONSOLE
                </strong>
                <span style={{ fontSize: '0.7rem', color: '#9333EA' }}>
                  Full Access Mode
                </span>
              </div>
            </div>
          )}

          {activeNavGroups.map((grp, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '1.1rem' }}>
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--color-secondary-text)',
                padding: '0 0.65rem 0.35rem',
                letterSpacing: '0.05em'
              }}>
                {grp.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {grp.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        backgroundColor: isActive ? 'var(--color-light-green)' : 'transparent',
                        color: isActive ? 'var(--color-dark-green)' : 'var(--color-primary-text)',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Icon size={17} color={isActive ? 'var(--color-primary-green)' : '#64748B'} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="gm-badge gm-badge-purple" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                          {item.badge}
                        </span>
                      )}

                      {item.alertBadge && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-alert-red)',
                          display: 'inline-block'
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          }
          .sidebar-container.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-bar {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
