import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerNewCustomer } from '../utils/userStorage';
import { ArrowLeft, UserPlus, Phone, Lock, Mail, MapPin, Globe } from 'lucide-react';

export const Register = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Sanwer',
    panchayat: 'Kshipra',
    farmSize: '3.5 Acres',
    primaryCrop: 'Wheat & Pulses',
    preferredLanguage: 'hi',
    role: 'ROLE_FARMER'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = registerNewCustomer({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
        state: formData.state,
        district: formData.district,
        block: formData.block,
        panchayat: formData.panchayat,
        farmSize: formData.farmSize,
        primaryCrop: formData.primaryCrop
      });

      if (res.success) {
        login(res.user, res.token);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '680px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }}>
        <button
          onClick={onSwitchToLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-green)',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.35rem' }}>
            🌾 Create New GramMitraAI Account
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
            Join India's AI-Powered Panchayat-Level Agricultural Platform.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#FFEBEE', color: '#C53030', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Patel"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="9876543210"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@grammitra.ai"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Preferred Language
              </label>
              <select
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Password *
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Administrative Hierarchy & Farm Details */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary-text)', letterSpacing: '0.05em' }}>
              ADMINISTRATIVE PANCHAYAT LOCATION & FARM DATA
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Block / Tehsil</label>
              <input type="text" name="block" value={formData.block} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Gram Panchayat</label>
              <input type="text" name="panchayat" value={formData.panchayat} onChange={handleChange} style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Farm Land Size</label>
              <input type="text" name="farmSize" value={formData.farmSize} onChange={handleChange} placeholder="e.g. 4.0 Acres" style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>Primary Crop</label>
              <input type="text" name="primaryCrop" value={formData.primaryCrop} onChange={handleChange} placeholder="e.g. Wheat & Soybean" style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gm-btn gm-btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Creating Account...' : 'REGISTER & PROCEED TO DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
};
