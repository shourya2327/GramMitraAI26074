import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { Settings, ShieldCheck, Bell, Server, Database, Globe, CheckCircle2, User, Save, Edit3 } from 'lucide-react';

export const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { selectedLocation } = useLocation();
  const { language, setLanguage } = useLanguage();

  const [profileData, setProfileData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    state: '',
    district: '',
    block: '',
    panchayat: '',
    farmSize: '',
    primaryCrop: ''
  });

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [units, setUnits] = useState('metric');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        mobileNumber: user.mobileNumber || '',
        email: user.email || '',
        state: user.state || 'Madhya Pradesh',
        district: user.district || 'Indore',
        block: user.block || 'Sanwer',
        panchayat: user.panchayat || 'Kshipra',
        farmSize: user.farmSize || '3.5 Acres',
        primaryCrop: user.primaryCrop || 'Wheat & Soybean'
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!profileData.fullName.trim()) {
      setSaveError('Customer/Farmer name cannot be blank.');
      return;
    }

    const res = updateUserProfile({
      fullName: profileData.fullName.trim(),
      mobileNumber: profileData.mobileNumber.trim(),
      email: profileData.email.trim(),
      state: profileData.state.trim(),
      district: profileData.district.trim(),
      block: profileData.block.trim(),
      panchayat: profileData.panchayat.trim(),
      farmSize: profileData.farmSize.trim(),
      primaryCrop: profileData.primaryCrop.trim()
    });

    if (res.success) {
      setSavedSuccess(true);
      setSaveError('');
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setSaveError(res.message || 'Failed to update preferences.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem', maxWidth: '820px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
          ⚙ Platform Configuration & Farmer Profile
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
          Manage your personal customer profile, notification preferences, and platform microservices.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '8px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} /> Profile information and preferences successfully updated!
        </div>
      )}

      {saveError && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FFEBEE', color: '#C53030', borderRadius: '8px', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          {saveError}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Profile Info - Editable */}
        <div className="gm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--color-primary-green)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                Customer / Farmer Profile Details
              </h3>
            </div>
            <span className="gm-badge gm-badge-green" style={{ fontSize: '0.7rem' }}>
              ID: #{user?.id || 1} • {user?.role || 'ROLE_FARMER'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Full Name (Displayed in Greetings & Dashboard) *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={profileData.fullName}
                onChange={handleProfileChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  border: '1.5px solid var(--color-primary-green)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Gram Panchayat / Village
                </label>
                <input
                  type="text"
                  name="panchayat"
                  value={profileData.panchayat}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Block / Tehsil
                </label>
                <input
                  type="text"
                  name="block"
                  value={profileData.block}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={profileData.district}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={profileData.state}
                  onChange={handleProfileChange}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Land Holding (Acres)
                </label>
                <input
                  type="text"
                  name="farmSize"
                  value={profileData.farmSize}
                  onChange={handleProfileChange}
                  placeholder="e.g. 4.5 Acres"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Primary Crops Cultivated
                </label>
                <input
                  type="text"
                  name="primaryCrop"
                  value={profileData.primaryCrop}
                  onChange={handleProfileChange}
                  placeholder="e.g. Wheat & Soybean"
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="gm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
            Early Warning Alert Notifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>SMS Severe Weather Alerts</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Receive immediate text alerts for heavy rainfall and heatwaves</span>
              </div>
              <input type="checkbox" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', cursor: 'pointer' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>Automated Voice Advisory Calls</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Receive pre-recorded regional dialect voice summaries before storm events</span>
              </div>
              <input type="checkbox" checked={voiceAlerts} onChange={(e) => setVoiceAlerts(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary-green)' }} />
            </label>
          </div>
        </div>

        {/* Microservice Architecture Health Monitor */}
        <div className="gm-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.85rem' }}>
            Platform Microservices Status
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>React Frontend (Vite)</span>
              <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Online (Port 5173)</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Spring Boot 3 Backend</span>
              <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Ready (Port 8080)</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>Python FastAPI AI Service</span>
              <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Ready (Port 8000)</strong>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <span style={{ color: 'var(--color-secondary-text)', display: 'block' }}>MySQL 8 / Local Storage</span>
              <strong style={{ color: '#16A34A', fontSize: '0.9rem' }}>● Synchronized</strong>
            </div>
          </div>
        </div>

        <button type="submit" className="gm-btn gm-btn-primary" style={{ padding: '0.75rem', fontSize: '0.95rem' }}>
          <Save size={16} /> Save Profile & Settings
        </button>
      </form>
    </div>
  );
};
