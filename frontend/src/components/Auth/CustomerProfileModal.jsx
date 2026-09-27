import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, MapPin, Wheat, Calendar, ShieldCheck, X, CheckCircle2, Edit2, Save } from 'lucide-react';

export const CustomerProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        mobileNumber: user.mobileNumber || '',
        email: user.email || '',
        state: user.state || '',
        district: user.district || '',
        block: user.block || '',
        panchayat: user.panchayat || '',
        farmSize: user.farmSize || '3.5 Acres',
        primaryCrop: user.primaryCrop || 'Wheat & Pulses'
      });
      setIsEditing(false);
      setErrorMsg('');
      setSaveSuccess(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg('Full name cannot be blank.');
      return;
    }

    const res = updateUserProfile({
      fullName: formData.fullName.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      state: formData.state.trim(),
      district: formData.district.trim(),
      block: formData.block.trim(),
      panchayat: formData.panchayat.trim(),
      farmSize: formData.farmSize.trim(),
      primaryCrop: formData.primaryCrop.trim()
    });

    if (res.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setErrorMsg('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  return (
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
        maxWidth: '580px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--color-dark-green)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🌾
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                Farmer Profile & Account
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#C8E6C9' }}>
                Customer ID: #{user.id} • Registered GramMitraAI User
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {saveSuccess && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#F0FDF4',
              color: '#166534',
              borderRadius: '8px',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={16} color="#16A34A" /> Profile and Name updated successfully! Greetings updated.
            </div>
          )}

          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FFEBEE',
              color: '#C53030',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {errorMsg}
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Profile Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: 'var(--color-light-green)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #C8E6C9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-green)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.25rem'
                  }}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                      {user.fullName}
                    </h3>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                      <span className="gm-badge gm-badge-green" style={{ fontSize: '0.68rem' }}>
                        {user.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Farmer / Customer'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                        Status: <strong style={{ color: '#16A34A' }}>Active</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="gm-btn gm-btn-primary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              </div>

              {/* Detail Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                backgroundColor: '#F8FAFC',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    Mobile Number
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    +91 {user.mobileNumber || 'N/A'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    Email Address
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    {user.email || 'N/A'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    Gram Panchayat & Village
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    {user.panchayat || 'Local Panchayat'}, {user.block || 'Local Block'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    District & State
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    {user.district || 'District'}, {user.state || 'State'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    Farm Land Holding
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    {user.farmSize || '3.5 Acres'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>
                    Primary Crops Cultivated
                  </span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--color-dark-green)' }}>
                    {user.primaryCrop || 'Wheat & Mustard'}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#EFF6FF', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #BFDBFE', fontSize: '0.8rem', color: '#1E40AF' }}>
                ✏️ <strong>Edit Profile Details:</strong> Updating your name will immediately change your greeting across the platform.
              </div>

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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
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
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                    Gram Panchayat / Village
                  </label>
                  <input
                    type="text"
                    name="panchayat"
                    value={formData.panchayat}
                    onChange={handleChange}
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
                    value={formData.block}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
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
                    value={formData.state}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                    Farm Size
                  </label>
                  <input
                    type="text"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleChange}
                    placeholder="e.g. 4.5 Acres"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                    Primary Crops
                  </label>
                  <input
                    type="text"
                    name="primaryCrop"
                    value={formData.primaryCrop}
                    onChange={handleChange}
                    placeholder="e.g. Wheat, Soybean"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="submit"
                  className="gm-btn gm-btn-primary"
                  style={{ flex: 1, padding: '0.65rem' }}
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="gm-btn gm-btn-outline"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
