import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  MapPin, 
  Search, 
  Bell, 
  Languages, 
  LogOut, 
  User, 
  CheckCircle, 
  Volume2, 
  Sparkles,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const Header = ({ onOpenLocationModal, onToggleMobileSidebar, onOpenProfileModal }) => {
  const { user, logout, switchRole } = useAuth();
  const { selectedLocation } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languagesList = [
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'bn', label: 'বাংলা (Bengali)' }
  ];

  return (
    <header className="header-container" style={{
      backgroundColor: 'var(--color-card-bg)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Left: Mobile Menu + Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleMobileSidebar}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Toggle Navigation"
        >
          <Menu size={24} color="var(--color-dark-green)" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4CAF50 0%, #23412A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '1.25rem',
            boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)'
          }}>
            🌱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-dark-green)', letterSpacing: '-0.02em' }}>
                GramMitra<span style={{ color: 'var(--color-primary-green)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', marginTop: '-2px' }}>
              Panchayat Weather & Smart Farming
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Active Location Display & Quick Location Change */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div 
          onClick={onOpenLocationModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-light-green)',
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #C8E6C9',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to search or pick any farm on Google Maps"
        >
          <MapPin size={16} color="var(--color-dark-green)" />
          <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', display: 'block' }}>
              {selectedLocation.village || selectedLocation.panchayat || "Selected Location"}
              {selectedLocation.district ? `, ${selectedLocation.district}` : ''}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#4B7B54' }}>
              {selectedLocation.state || "Central Zone"} • {selectedLocation.elevation_m || 520}m MSL
            </span>
          </div>
          <span style={{ 
            fontSize: '0.72rem', 
            fontWeight: 700, 
            color: 'var(--color-primary-green)',
            backgroundColor: '#FFFFFF',
            padding: '2px 8px',
            borderRadius: '12px',
            marginLeft: '4px'
          }}>
            📍 {t('changeLocation')}
          </span>
        </div>
      </div>

      {/* Right: Actions, Language, Role Switcher, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setShowRoleMenu(false); }}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Languages size={15} />
            <span>{languagesList.find(l => l.code === language)?.label.split(' ')[0] || 'हिंदी'}</span>
          </button>

          {showLangMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              width: '180px',
              zIndex: 150,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-secondary-text)', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
                Select Language
              </div>
              {languagesList.map(item => (
                <div
                  key={item.code}
                  onClick={() => {
                    setLanguage(item.code);
                    setShowLangMenu(false);
                  }}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: language === item.code ? 'var(--color-light-green)' : 'transparent',
                    color: language === item.code ? 'var(--color-dark-green)' : 'var(--color-primary-text)',
                    fontWeight: language === item.code ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{item.label}</span>
                  {language === item.code && <CheckCircle size={14} color="var(--color-primary-green)" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown (Farmer / Agriculture Officer / Admin) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowRoleMenu(!showRoleMenu); setShowLangMenu(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: user?.role === 'ROLE_OFFICER' ? '#EFF6FF' : user?.role === 'ROLE_ADMIN' ? '#FAF5FF' : 'var(--color-light-green)',
              border: '1px solid var(--color-border)',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-dark-green)'
            }}
          >
            <ShieldCheck size={16} color="var(--color-primary-green)" />
            <span>
              {user?.role === 'ROLE_OFFICER' ? 'Agri Officer' : user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Farmer'}
            </span>
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '110%',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              width: '210px',
              zIndex: 150,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-secondary-text)', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
                Switch Mode / Role
              </div>
              <div
                onClick={() => { switchRole('ROLE_FARMER'); setShowRoleMenu(false); }}
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', backgroundColor: user?.role === 'ROLE_FARMER' ? 'var(--color-light-green)' : 'transparent' }}
              >
                🌾 <strong>Farmer Role</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>Field advisory & irrigation</div>
              </div>
              <div
                onClick={() => { switchRole('ROLE_OFFICER'); setShowRoleMenu(false); }}
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', backgroundColor: user?.role === 'ROLE_OFFICER' ? 'var(--color-sky-blue)' : 'transparent' }}
              >
                📊 <strong>Agri Officer Role</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>Panchayat-level analytics</div>
              </div>
              <div
                onClick={() => { switchRole('ROLE_ADMIN'); setShowRoleMenu(false); }}
                style={{ padding: '0.55rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', backgroundColor: user?.role === 'ROLE_ADMIN' ? 'var(--color-ai-purple)' : 'transparent' }}
              >
                ⚙ <strong>Admin Role</strong>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary-text)' }}>ML model registry & settings</div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Chip (Dynamic Customer / Admin Name) */}
        {user && (
          <button
            onClick={onOpenProfileModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-light-green)',
              border: '1px solid #C8E6C9',
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-dark-green)',
              transition: 'all 0.15s ease'
            }}
            title="Click to view and edit your profile"
          >
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-green)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.fullName || (user.role === 'ROLE_ADMIN' ? 'Admin' : 'Farmer')}
            </span>
          </button>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="gm-btn gm-btn-outline"
          style={{ padding: '0.45rem 0.6rem', color: 'var(--color-alert-red)', borderColor: '#FED7D7' }}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
};
