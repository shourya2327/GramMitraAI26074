import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getRegisteredUsers, 
  saveRegisteredUsers, 
  updateCustomerData, 
  deleteCustomerAccount, 
  toggleCustomerStatus,
  registerNewCustomer 
} from '../utils/userStorage';
import { 
  ShieldCheck, 
  Users, 
  UserCheck, 
  UserX, 
  MapPin, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Power, 
  Eye, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Activity, 
  Database, 
  Cpu, 
  LogOut, 
  Send, 
  X, 
  RefreshCw,
  Sparkles,
  Layers,
  Save
} from 'lucide-react';

export const AdminDashboard = ({ onNavigateToPreview }) => {
  const { user, logout } = useAuth();

  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'app-data' | 'system'
  
  // Modals state
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  // New Customer Form State
  const [newCustomerForm, setNewCustomerForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: 'farmer123',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Sanwer',
    panchayat: 'Kshipra',
    farmSize: '3.0 Acres',
    primaryCrop: 'Wheat & Pulses'
  });

  // Application Data / Broadcast simulation
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [syncStatus, setSyncStatus] = useState('SYNCED');

  const refreshUsers = () => {
    const list = getRegisteredUsers();
    setUsersList(list);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setFeedbackNotice({ msg, type });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Customers only (exclude Admin accounts from normal farmer list, or mark clearly)
  const customers = usersList.filter(u => u.role !== 'ROLE_ADMIN');
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(u => u.status !== 'Deactivated' && u.status !== 'Inactive').length;
  const deactivatedCustomers = customers.filter(u => u.status === 'Deactivated' || u.status === 'Inactive').length;
  const coveredPanchayats = new Set(customers.map(u => u.panchayat).filter(Boolean)).size;

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (c.fullName || '').toLowerCase().includes(term) ||
      (c.mobileNumber || '').includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.panchayat || '').toLowerCase().includes(term) ||
      (c.district || '').toLowerCase().includes(term);

    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'ACTIVE' ? (c.status !== 'Deactivated' && c.status !== 'Inactive') :
      (c.status === 'Deactivated' || c.status === 'Inactive');

    return matchesSearch && matchesStatus;
  });

  // Handlers for Customer Management
  const handleToggleStatus = (targetUser) => {
    const res = toggleCustomerStatus(targetUser.id);
    if (res.success) {
      refreshUsers();
      showNotification(`Account status for ${targetUser.fullName} updated to ${res.status}.`);
    }
  };

  const handleDeleteUser = (targetUser) => {
    if (window.confirm(`Are you sure you want to permanently delete customer ${targetUser.fullName} (#${targetUser.id})?`)) {
      const res = deleteCustomerAccount(targetUser.id);
      if (res.success) {
        refreshUsers();
        showNotification(`Customer ${targetUser.fullName} removed from database.`, 'info');
      } else {
        showNotification(res.message, 'error');
      }
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    const res = updateCustomerData(selectedUserForEdit.id, {
      fullName: selectedUserForEdit.fullName.trim(),
      mobileNumber: selectedUserForEdit.mobileNumber.trim(),
      email: selectedUserForEdit.email.trim(),
      state: selectedUserForEdit.state.trim(),
      district: selectedUserForEdit.district.trim(),
      block: selectedUserForEdit.block.trim(),
      panchayat: selectedUserForEdit.panchayat.trim(),
      farmSize: selectedUserForEdit.farmSize,
      primaryCrop: selectedUserForEdit.primaryCrop,
      status: selectedUserForEdit.status
    });

    if (res.success) {
      refreshUsers();
      setSelectedUserForEdit(null);
      showNotification(`Customer ${res.user.fullName} details updated successfully.`);
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    const res = registerNewCustomer(newCustomerForm);
    if (res.success) {
      refreshUsers();
      setIsAddUserModalOpen(false);
      setNewCustomerForm({
        fullName: '',
        mobileNumber: '',
        email: '',
        password: 'farmer123',
        state: 'Madhya Pradesh',
        district: 'Indore',
        block: 'Sanwer',
        panchayat: 'Kshipra',
        farmSize: '3.0 Acres',
        primaryCrop: 'Wheat & Pulses'
      });
      showNotification(`New customer ${res.user.fullName} registered successfully.`);
    } else {
      showNotification(res.message, 'error');
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMessage('');
      showNotification(`Emergency weather advisory successfully dispatched to ${broadcastTarget === 'ALL' ? 'all registered farmers' : broadcastTarget + ' block'}!`);
    }, 1200);
  };

  const handleTriggerSync = () => {
    setSyncStatus('SYNCING...');
    setTimeout(() => {
      setSyncStatus('SYNCED');
      showNotification('IMD & Agro-Met downscaling microservices re-synchronized.');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      
      {/* Top Banner & Admin Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🛡️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                GramMitraAI Admin Console
              </h1>
              <span className="gm-badge gm-badge-green" style={{ fontSize: '0.7rem' }}>
                Role: Super Admin
              </span>
              <span style={{ fontSize: '0.72rem', backgroundColor: '#334155', color: '#94A3B8', padding: '2px 8px', borderRadius: '12px' }}>
                Demo Env
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '3px' }}>
              Centralized platform administration, customer/farmer lifecycle management, and downscaling telemetry.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onNavigateToPreview && (
            <button
              onClick={onNavigateToPreview}
              className="gm-btn gm-btn-outline"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', borderColor: '#475569', fontSize: '0.85rem' }}
            >
              <Eye size={15} /> View Farmer App
            </button>
          )}

          <button
            onClick={logout}
            className="gm-btn"
            style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <LogOut size={16} /> Logout Admin
          </button>
        </div>
      </div>

      {/* Notifications Alert Bar */}
      {feedbackNotice && (
        <div style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: feedbackNotice.type === 'error' ? '#FEF2F2' : feedbackNotice.type === 'info' ? '#F0F9FF' : '#F0FDF4',
          color: feedbackNotice.type === 'error' ? '#991B1B' : feedbackNotice.type === 'info' ? '#075985' : '#166534',
          borderRadius: '8px',
          border: `1px solid ${feedbackNotice.type === 'error' ? '#FECACA' : feedbackNotice.type === 'info' ? '#BAE6FD' : '#BBF7D0'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.88rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <CheckCircle2 size={18} />
          <span>{feedbackNotice.msg}</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>
        {/* Total Customers */}
        <div className="gm-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 700 }}>TOTAL CUSTOMERS</span>
            <Users size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            {totalCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            Registered Farmers & Agronomists
          </div>
        </div>

        {/* Active Accounts */}
        <div className="gm-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 700 }}>ACTIVE STATUS</span>
            <UserCheck size={20} color="#0284C7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0369A1' }}>
            {activeCustomers}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            {deactivatedCustomers > 0 ? `${deactivatedCustomers} deactivated/inactive` : '100% Active standing'}
          </div>
        </div>

        {/* Panchayat Coverage */}
        <div className="gm-card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 700 }}>PANCHAYATS COVERED</span>
            <MapPin size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B45309' }}>
            {coveredPanchayats}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            Gram Panchayats receiving AI downscaling
          </div>
        </div>

        {/* System & AI Engine Telemetry */}
        <div className="gm-card" style={{ borderLeft: '4px solid #7C3AED' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', fontWeight: 700 }}>AI SERVICE STATUS</span>
            <Cpu size={20} color="#7C3AED" />
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            Ready / Optimal
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '4px' }}>
            XGBoost Ensemble 1km Grid Engine
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        gap: '0.5rem',
        backgroundColor: '#FFFFFF',
        padding: '0.5rem 1rem 0',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
      }}>
        {[
          { id: 'customers', label: '👥 Customer / Farmer Management', count: totalCustomers },
          { id: 'app-data', label: '📡 Application Data & Broadcast' },
          { id: 'system', label: '⚙️ System Telemetry & Logs' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === t.id ? 'var(--color-primary-green)' : 'var(--color-secondary-text)',
              borderBottom: activeTab === t.id ? '3px solid var(--color-primary-green)' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span style={{
                fontSize: '0.72rem',
                backgroundColor: activeTab === t.id ? 'var(--color-light-green)' : '#F1F5F9',
                color: activeTab === t.id ? 'var(--color-dark-green)' : '#64748B',
                padding: '1px 7px',
                borderRadius: '12px'
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: CUSTOMER / FARMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="gm-card" style={{ borderRadius: '0 0 var(--radius-md) var(--radius-md)', borderTop: 'none' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
                <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, mobile, email, panchayat..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={16} color="#64748B" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="ALL">All Accounts ({customers.length})</option>
                  <option value="ACTIVE">Active Only ({activeCustomers})</option>
                  <option value="DEACTIVATED">Deactivated Only ({deactivatedCustomers})</option>
                </select>
              </div>
            </div>

            {/* Add New Farmer Button */}
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="gm-btn gm-btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add New Customer
            </button>
          </div>

          {/* Customers Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>ID</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Customer Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Contact Details</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Panchayat & State</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Farm / Crops</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-dark-green)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-secondary-text)' }}>
                      No customers match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(cust => {
                    const isDeactivated = cust.status === 'Deactivated' || cust.status === 'Inactive';
                    return (
                      <tr key={cust.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.15s ease' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-secondary-text)' }}>
                          #{cust.id}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <strong style={{ color: 'var(--color-dark-green)', display: 'block', fontSize: '0.9rem' }}>
                            {cust.fullName}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
                            Joined: {cust.registrationDate || '2024-01-15'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ color: 'var(--color-dark-green)' }}>📞 +91 {cust.mobileNumber}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>✉ {cust.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-dark-green)' }}>
                            {cust.panchayat || 'Local Panchayat'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                            {cust.block ? `${cust.block}, ` : ''}{cust.district ? `${cust.district}, ` : ''}{cust.state}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ color: 'var(--color-dark-green)' }}>{cust.farmSize || '3.5 Acres'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>{cust.primaryCrop || 'Wheat'}</div>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: isDeactivated ? '#FEE2E2' : '#DCFCE7',
                            color: isDeactivated ? '#B91C1C' : '#15803D',
                            display: 'inline-block'
                          }}>
                            {isDeactivated ? 'Deactivated' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {/* View Profile */}
                            <button
                              onClick={() => setSelectedUserForView(cust)}
                              className="gm-btn gm-btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              title="View Customer Profile"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Edit Info */}
                            <button
                              onClick={() => setSelectedUserForEdit(cust)}
                              className="gm-btn gm-btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#0284C7', borderColor: '#BAE6FD' }}
                              title="Edit Customer Info"
                            >
                              <Edit3 size={14} />
                            </button>

                            {/* Deactivate / Activate */}
                            <button
                              onClick={() => handleToggleStatus(cust)}
                              className="gm-btn gm-btn-outline"
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.75rem',
                                color: isDeactivated ? '#15803D' : '#D97706',
                                borderColor: isDeactivated ? '#BBF7D0' : '#FDE68A'
                              }}
                              title={isDeactivated ? 'Activate Account' : 'Deactivate Account'}
                            >
                              <Power size={14} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteUser(cust)}
                              className="gm-btn gm-btn-outline"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                              title="Delete Customer Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: APPLICATION DATA & WEATHER ADVISORY BROADCAST */}
      {activeTab === 'app-data' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Weather Alert Broadcaster */}
          <div className="gm-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Radio size={20} color="#DC2626" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                Emergency Agro-Met Advisory Broadcast
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Broadcast immediate SMS and voice advisory alerts directly to connected farmers' mobile phones.
            </p>

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Target Panchayat or Region
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="ALL">All Registered Farmers Across India ({totalCustomers} active)</option>
                  <option value="Sanwer">Sanwer Block (Indore District)</option>
                  <option value="Dindori">Dindori Block (Nashik District)</option>
                  <option value="Khanna">Khanna Block (Ludhiana District)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '4px' }}>
                  Advisory Message (Multilingual Automatic Translation)
                </label>
                <textarea
                  rows={4}
                  required
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="e.g. Alert: Severe thunderstorm and unseasonal hailstorm expected between 3 PM and 7 PM. Harvest mature crops and clear drainage channels immediately."
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={broadcastSent}
                className="gm-btn gm-btn-primary"
                style={{ backgroundColor: '#DC2626', padding: '0.65rem' }}
              >
                {broadcastSent ? 'Dispatching Advisory...' : <><Send size={15} /> Dispatch Emergency Alert</>}
              </button>
            </form>
          </div>

          {/* Data Microservices Sync & Management */}
          <div className="gm-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} color="#0284C7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                  Data Pipeline & Cache Sync
                </h3>
              </div>
              <span className="gm-badge gm-badge-blue">{syncStatus}</span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary-text)', marginBottom: '1.25rem' }}>
              Control downscaling weather models, radar tile cache, and ground telemetry ingestion.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>IMD 12km Regional NWP Model Ingestion</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>Last refreshed: 12 minutes ago</span>
                </div>
                <button onClick={handleTriggerSync} className="gm-btn gm-btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  <RefreshCw size={13} /> Sync Now
                </button>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>KVK Agro-Advisory Knowledge Graph</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>52 Active Krishi Vigyan Kendras synchronized</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>● Online</span>
              </div>

              <div style={{ padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-dark-green)', display: 'block' }}>Soil Moisture & Microclimate Sensor Net</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>1,420 IoT telemetry points simulated</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>● Connected</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM TELEMETRY & AUDIT LOGS */}
      {activeTab === 'system' && (
        <div className="gm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              System Activity & Audit Logs
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
              Live Telemetry Monitor
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {[
              { time: '17:48:10', type: 'AUTH', text: 'Admin authenticated from localhost. Session key generated.' },
              { time: '17:42:05', type: 'ML', text: 'Downscaling model XGBoost inference run completed for Indore block (latency 42ms).' },
              { time: '17:35:12', type: 'DATA', text: 'Local storage cache verified for 4 customer profiles.' },
              { time: '17:20:44', type: 'API', text: 'Reverse geocode query 22.7196, 75.8577 returned Kshipra Panchayat.' },
              { time: '17:01:29', type: 'JOB', text: 'Scheduled automated irrigation advisory compute executed for Wheat crop.' }
            ].map((log, idx) => (
              <div key={idx} style={{ padding: '0.65rem', backgroundColor: '#F8FAFC', borderRadius: '6px', borderLeft: '3px solid var(--color-primary-green)', display: 'flex', gap: '1rem' }}>
                <span style={{ color: '#64748B' }}>[{log.time}]</span>
                <span style={{ fontWeight: 700, color: log.type === 'AUTH' ? '#7C3AED' : log.type === 'ML' ? '#0284C7' : '#16A34A' }}>
                  {log.type}
                </span>
                <span style={{ color: '#334155' }}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW CUSTOMER PROFILE MODAL */}
      {selectedUserForView && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            maxWidth: '540px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--color-dark-green)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                🌾 Customer Profile Details
              </h3>
              <button onClick={() => setSelectedUserForView(null)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary-green)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
                  {selectedUserForView.fullName.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
                    {selectedUserForView.fullName}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)' }}>
                    Customer ID: #{selectedUserForView.id} • Registered: {selectedUserForView.registrationDate || '2024-01-15'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Mobile Number</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>+91 {selectedUserForView.mobileNumber}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Email Address</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.email}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Gram Panchayat</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.panchayat || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Block & District</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.block || 'N/A'}, {selectedUserForView.district || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>State</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.state || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Account Status</span>
                  <strong style={{ color: selectedUserForView.status === 'Deactivated' ? '#DC2626' : '#16A34A' }}>
                    {selectedUserForView.status || 'Active'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Farm Holding</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.farmSize || '3.5 Acres'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)', display: 'block' }}>Primary Crop</span>
                  <strong style={{ color: 'var(--color-dark-green)' }}>{selectedUserForView.primaryCrop || 'Wheat'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button onClick={() => setSelectedUserForView(null)} className="gm-btn gm-btn-outline" style={{ padding: '0.5rem 1rem' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {selectedUserForEdit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--color-dark-green)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                ✏️ Edit Customer Information
              </h3>
              <button onClick={() => setSelectedUserForEdit(null)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={selectedUserForEdit.fullName}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={selectedUserForEdit.mobileNumber}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, mobileNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={selectedUserForEdit.email}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, email: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Panchayat / Village
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.panchayat || ''}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, panchayat: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Block / Tehsil
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.block || ''}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, block: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.district || ''}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, district: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.state || ''}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, state: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Farm Size
                  </label>
                  <input
                    type="text"
                    value={selectedUserForEdit.farmSize || ''}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, farmSize: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Account Status
                  </label>
                  <select
                    value={selectedUserForEdit.status || 'Active'}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, status: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="submit" className="gm-btn gm-btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  <Save size={16} /> Save Customer Changes
                </button>
                <button type="button" onClick={() => setSelectedUserForEdit(null)} className="gm-btn gm-btn-outline" style={{ padding: '0.65rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW CUSTOMER MODAL */}
      {isAddUserModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--color-dark-green)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                ➕ Register New Customer / Farmer
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Kaur"
                  value={newCustomerForm.fullName}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, fullName: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543299"
                    value={newCustomerForm.mobileNumber}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, mobileNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="farmer@grammitra.ai"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Default Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newCustomerForm.password}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, password: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    Panchayat / Village
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.panchayat}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, panchayat: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.district}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, district: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '3px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    value={newCustomerForm.state}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, state: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button type="submit" className="gm-btn gm-btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  Register Customer
                </button>
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="gm-btn gm-btn-outline" style={{ padding: '0.65rem 1rem' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
