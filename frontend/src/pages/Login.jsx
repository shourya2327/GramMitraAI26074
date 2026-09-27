import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authenticateCustomer, authenticateAdmin, resetCustomerPassword } from '../utils/userStorage';
import { 
  Sprout, 
  ShieldCheck, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  Phone, 
  Lock, 
  User, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  // Login Mode: 'customer' (Farmer / Customer) | 'admin' (Admin)
  const [loginMode, setLoginMode] = useState('customer');

  // Customer form state
  const [customerIdentifier, setCustomerIdentifier] = useState('9876543210');
  const [customerPassword, setCustomerPassword] = useState('farmer123');

  // Admin form state
  const [adminIdentifier, setAdminIdentifier] = useState('admin@grammitra.ai');
  const [adminPassword, setAdminPassword] = useState('Admin@123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState({ text: '', type: '' });

  // Handle Customer Login
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = authenticateCustomer(customerIdentifier, customerPassword);
      if (res.success) {
        login(res.user, res.token);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 300);
  };

  // Handle Admin Login
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const res = authenticateAdmin(adminIdentifier, adminPassword);
      if (res.success) {
        login(res.user, res.token);
      } else {
        setError(res.message);
      }
      setLoading(false);
    }, 300);
  };

  // Quick fill helper for demo convenience
  const fillCustomerDemo = () => {
    setCustomerIdentifier('9876543210');
    setCustomerPassword('farmer123');
    setError('');
  };

  const fillAdminDemo = () => {
    setAdminIdentifier('admin@grammitra.ai');
    setAdminPassword('Admin@123');
    setError('');
  };

  // Forgot Password Submit
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    if (forgotNewPassword.length < 4) {
      setForgotMsg({ text: 'Password must be at least 4 characters.', type: 'error' });
      return;
    }

    const res = resetCustomerPassword(forgotIdentifier, forgotNewPassword);
    if (res.success) {
      setForgotMsg({ text: res.message, type: 'success' });
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotIdentifier('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
        setForgotMsg({ text: '', type: '' });
        setCustomerPassword(forgotNewPassword);
        setSuccessNotice('Password reset successful. You may now log in.');
      }, 1800);
    } else {
      setForgotMsg({ text: res.message, type: 'error' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-bg)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '960px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      }} className="login-card-grid">
        
        {/* Left Side: Agriculture Branding Illustration & Tagline */}
        <div style={{
          background: 'linear-gradient(145deg, #23412A 0%, #152618 100%)',
          color: '#FFFFFF',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 70%)'
          }} />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
              }}>
                🌱
              </div>
              <div>
                <h1 style={{ fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                  GramMitra<span style={{ color: '#81C784' }}>AI</span>
                </h1>
                <span className="gm-badge gm-badge-green" style={{ fontSize: '0.65rem' }}>AI Smart Farming Platform</span>
              </div>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem', color: '#E8F5E9' }}>
              "Hyperlocal Weather. Smarter Farming. Better Decisions."
            </h2>

            <p style={{ fontSize: '0.9rem', color: '#C8E6C9', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              AI-driven downscaling from regional blocks to individual farmer fields. Get precision rainfall, microclimate forecasts, smart irrigation planning, and crop disease risk in your regional language.
            </p>

            {/* Quick Demo Credentials Info Banner */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              fontSize: '0.78rem',
              color: '#E2E8F0'
            }}>
              <div style={{ fontWeight: 700, color: '#81C784', marginBottom: '4px' }}>
                💡 Quick Demo Credentials (Development Mode)
              </div>
              <div>🌾 <strong>Farmer:</strong> 9876543210 / farmer123</div>
              <div>🛡️ <strong>Admin:</strong> admin@grammitra.ai / Admin@123</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#A5D6A7' }}>
            <div>✓ Downscaled Weather</div>
            <div>✓ Smart Irrigation</div>
            <div>✓ Role-Based Security</div>
          </div>
        </div>

        {/* Right Side: Login Options & Forms */}
        <div style={{ padding: '2.5rem 2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Header Title */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.25rem' }}>
              Sign In to GramMitraAI
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
              Choose your account type below to access your dedicated dashboard.
            </p>
          </div>

          {/* TWO CLEARLY VISIBLE LOGIN OPTIONS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            {/* Option 1: Customer / Farmer Login */}
            <button
              type="button"
              onClick={() => { setLoginMode('customer'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loginMode === 'customer' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'customer' ? 'var(--color-dark-green)' : '#64748B',
                fontWeight: loginMode === 'customer' ? 800 : 600,
                fontSize: '0.85rem',
                boxShadow: loginMode === 'customer' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🌾</span>
              <span>Customer / Farmer</span>
            </button>

            {/* Option 2: Admin Login */}
            <button
              type="button"
              onClick={() => { setLoginMode('admin'); setError(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: loginMode === 'admin' ? '#FFFFFF' : 'transparent',
                color: loginMode === 'admin' ? '#7C3AED' : '#64748B',
                fontWeight: loginMode === 'admin' ? 800 : 600,
                fontSize: '0.85rem',
                boxShadow: loginMode === 'admin' ? 'var(--shadow-sm)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🛡️</span>
              <span>Admin Login</span>
            </button>
          </div>

          {/* Success or Error Notices */}
          {successNotice && (
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> {successNotice}
            </div>
          )}

          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#FFEBEE', color: '#C53030', borderRadius: '8px', border: '1px solid #FECACA', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* 1. CUSTOMER / FARMER LOGIN FORM */}
          {loginMode === 'customer' && (
            <form onSubmit={handleCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Mobile Number or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or ramesh@farmer.in"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setForgotIdentifier(customerIdentifier);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary-green)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="password"
                    required
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* One-click Demo Autofill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-secondary-text)' }}>Test Account: Ramesh Patel</span>
                <button
                  type="button"
                  onClick={fillCustomerDemo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary-green)',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Autofill Demo
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gm-btn gm-btn-primary"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Authenticating...' : '🌾 LOGIN AS FARMER / CUSTOMER'} <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-green)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Account / Register
                </button>
              </div>
            </form>
          )}

          {/* 2. ADMIN LOGIN FORM */}
          {loginMode === 'admin' && (
            <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.78rem', color: '#6B21A8' }}>
                🛡️ <strong>Admin Portal:</strong> Restricted to platform operators and agricultural administrative staff.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Admin ID or Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value)}
                    placeholder="admin@grammitra.ai"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Admin Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={17} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              {/* One-click Admin Demo Autofill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.75rem', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-secondary-text)' }}>Demo: admin@grammitra.ai</span>
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7C3AED',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Autofill Demo Admin
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="gm-btn gm-btn-purple"
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.25rem', fontSize: '0.95rem' }}
              >
                {loading ? 'Authenticating Admin...' : '🛡️ LOGIN TO ADMIN CONSOLE'} <ArrowRight size={16} />
              </button>

              <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
                Are you a farmer?{' '}
                <button
                  type="button"
                  onClick={() => setLoginMode('customer')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary-green)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Switch to Customer / Farmer Login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            maxWidth: '460px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-dark-green)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={20} color="#81C784" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Reset Farmer Password
                </h3>
              </div>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleForgotSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-secondary-text)' }}>
                Enter your registered mobile number or email to set a new password for your account.
              </p>

              {forgotMsg.text && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  backgroundColor: forgotMsg.type === 'error' ? '#FFEBEE' : '#F0FDF4',
                  color: forgotMsg.type === 'error' ? '#C53030' : '#166534',
                  border: `1px solid ${forgotMsg.type === 'error' ? '#FECACA' : '#BBF7D0'}`
                }}>
                  {forgotMsg.text}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  Registered Mobile or Email *
                </label>
                <input
                  type="text"
                  required
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={forgotNewPassword}
                  onChange={(e) => setForgotNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="gm-btn gm-btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  Save New Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="gm-btn gm-btn-outline"
                  style={{ padding: '0.65rem 1rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .login-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
