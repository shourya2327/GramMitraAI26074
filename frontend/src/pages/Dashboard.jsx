import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from '../components/Map/InteractiveMap';
import { sampleWeather, sampleAlerts } from '../utils/demoData';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind, 
  Gauge, 
  ShieldCheck, 
  Volume2, 
  Square,
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  Sun,
  User,
  Edit3
} from 'lucide-react';

export const Dashboard = ({ onNavigate, onOpenLocationModal, onOpenProfileModal }) => {
  const { user } = useAuth();
  const { selectedLocation, savedFields } = useLocation();
  const { t, playVoiceAdvisory, stopVoiceAdvisory, isPlayingVoice } = useLanguage();

  const [activeCrop, setActiveCrop] = useState('Wheat');

  const activeVillageHi = selectedLocation?.village || selectedLocation?.panchayat || "आपके क्षेत्र";
  const activeVillageEn = selectedLocation?.village || selectedLocation?.panchayat || "your local farm area";

  const todayAdvisoryText = `आज आपके क्षेत्र ${activeVillageHi} में 14.5 मिमी वर्षा की संभावना है। गेहूँ की फसल में आज अतिरिक्त सिंचाई स्थगित रखें तथा खेत के जल निकास नालों को खुला रखें।`;
  const todayAdvisoryEn = `Expected rainfall of 14.5 mm today in ${activeVillageEn}. Suspend irrigation in ${activeCrop} fields and ensure drainage waterways are clear.`;

  const handleVoiceToggle = () => {
    if (isPlayingVoice) {
      stopVoiceAdvisory();
    } else {
      playVoiceAdvisory(todayAdvisoryText, 'hi');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      
      {/* Top Banner & Greeting */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-green)', letterSpacing: '-0.02em' }}>
              {t('welcome')}, {user?.fullName || "Farmer"} 🌾
            </h1>
            <button
              onClick={onOpenProfileModal}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-green)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-light-green)'
              }}
              title="Click to edit your name"
            >
              <Edit3 size={12} /> Edit Name
            </button>
            <span className="gm-badge gm-badge-green" style={{ fontSize: '0.7rem' }}>
              {user?.role === 'ROLE_OFFICER' ? 'Agri Officer' : user?.role === 'ROLE_ADMIN' ? 'Admin' : 'Farmer Active'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px', fontSize: '0.85rem', color: 'var(--color-secondary-text)' }}>
            <MapPin size={15} color="var(--color-primary-green)" />
            <span>
              {selectedLocation.village || selectedLocation.panchayat || "Your Farm"}
              {selectedLocation.block ? ` (${selectedLocation.block}, ${selectedLocation.district || ''})` : ''}
              {selectedLocation.state ? ` • ${selectedLocation.state}` : ''}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenProfileModal}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem', borderColor: 'var(--color-primary-green)' }}
            title="View and edit customer profile"
          >
            <User size={15} color="var(--color-primary-green)" /> Profile & Name
          </button>
          <button
            onClick={onOpenLocationModal}
            className="gm-btn gm-btn-outline"
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
          >
            📍 {t('changeLocation')}
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="gm-btn gm-btn-purple"
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}
          >
            <Sparkles size={15} /> What-If Simulator
          </button>
        </div>
      </div>

      {/* Extreme Weather Warning Banner (if alerts present) */}
      {sampleAlerts.length > 0 && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderLeft: '5px solid #F59E0B',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: '#92400E', fontSize: '0.95rem' }}>
                  {sampleAlerts[0].headline}
                </strong>
                <span className="gm-badge gm-badge-orange" style={{ fontSize: '0.65rem' }}>
                  {sampleAlerts[0].severity.replace('_', ' ')}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#78350F', marginTop: '3px' }}>
                {sampleAlerts[0].description} Expected: <strong>{sampleAlerts[0].expectedTime}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('extreme-weather')}
            style={{
              background: 'none',
              border: 'none',
              color: '#B45309',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              whiteSpace: 'nowrap'
            }}
          >
            View Protocols <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Core Weather Stat Cards (Light, Clean, Themed) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem'
      }}>
        {/* Temperature */}
        <div className="gm-card" style={{ borderLeft: '4px solid #F97316' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>{t('temperature')}</span>
            <Thermometer size={18} color="#EA580C" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            {sampleWeather.temperature}°C
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
            {t('feelsLike')} <strong>{sampleWeather.feelsLike}°C</strong>
          </div>
        </div>

        {/* Expected Rainfall */}
        <div className="gm-card" style={{ borderLeft: '4px solid #0284C7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>{t('rainfall')}</span>
            <CloudRain size={18} color="#0284C7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0369A1' }}>
            {sampleWeather.rainfall} <span style={{ fontSize: '1rem', fontWeight: 600 }}>mm</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
            Probability: <strong style={{ color: '#0284C7' }}>{sampleWeather.rainProbability}%</strong>
          </div>
        </div>

        {/* Humidity */}
        <div className="gm-card" style={{ borderLeft: '4px solid #10B981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>{t('humidity')}</span>
            <Droplets size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            {sampleWeather.humidity}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
            Dew point: <strong>23°C</strong> • Moist
          </div>
        </div>

        {/* Wind Speed */}
        <div className="gm-card" style={{ borderLeft: '4px solid #64748B' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', fontWeight: 600 }}>{t('windSpeed')}</span>
            <Wind size={18} color="#475569" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
            {sampleWeather.windSpeed} <span style={{ fontSize: '1rem', fontWeight: 600 }}>km/h</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '2px' }}>
            Direction: <strong>{sampleWeather.windDirection}</strong>
          </div>
        </div>

        {/* Forecast Confidence */}
        <div className="gm-card" style={{ borderLeft: '4px solid #7C3AED', background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-ai-accent)', fontWeight: 700 }}>AI Confidence</span>
            <Gauge size={18} color="var(--color-ai-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-ai-accent)' }}>
            {sampleWeather.downscalingConfidence}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6B21A8', fontWeight: 600, marginTop: '2px' }}>
            ✓ High • XGBoost Ensemble
          </div>
        </div>
      </div>

      {/* Large Interactive Google Map Section with Click-Anywhere & Field Boundary Draw */}
      <div className="gm-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>
              🗺 Panchayat & Field Precision Map
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)' }}>
              Click ANY location on the map to drop a pin, view reverse geocoded weather, or draw field polygons.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigate('my-fields')}
              className="gm-btn gm-btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              My Saved Fields ({savedFields.length})
            </button>
            <button
              onClick={() => onNavigate('panchayat-map')}
              className="gm-btn gm-btn-primary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Open Full Weather Map
            </button>
          </div>
        </div>

        <InteractiveMap height="440px" showControls={true} allowDrawing={true} />
      </div>

      {/* Advisory & Decision Support Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Today's AI Agro-Advisory with TTS Voice Playback */}
        <div className="gm-card gm-card-primary" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="gm-badge gm-badge-green">🌾 Live Crop Advisory</span>
              <button
                onClick={handleVoiceToggle}
                className="gm-btn gm-btn-primary"
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  backgroundColor: isPlayingVoice ? '#EF4444' : 'var(--color-primary-green)'
                }}
              >
                {isPlayingVoice ? (
                  <>
                    <Square size={13} />
                    <span>{t('stopVoice')}</span>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: '4px' }}>
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                      <span className="wave-bar" />
                    </div>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} />
                    <span>{t('playVoice')}</span>
                  </>
                )}
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.5rem' }}>
              {activeCrop}: Today's Action Recommendation
            </h3>

            <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-green)', lineHeight: 1.55, fontWeight: 500, backgroundColor: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', border: '1px solid #DDE8DD' }}>
              "{todayAdvisoryText}"
            </p>

            <p style={{ fontSize: '0.78rem', color: 'var(--color-secondary-text)', marginTop: '0.5rem', fontStyle: 'italic' }}>
              EN: "{todayAdvisoryEn}"
            </p>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #C8E6C9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>
              Source: KVK Indore & Downscaled Agro-Met Model
            </span>
            <button
              onClick={() => onNavigate('crop-advisory')}
              style={{ background: 'none', border: 'none', color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Details <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Smart Irrigation Advisory Card */}
        <div className="gm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="gm-badge gm-badge-blue">💧 Smart Irrigation</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '12px' }}>
                PAUSE IRRIGATION
              </span>
            </div>

            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.4rem' }}>
              Irrigation: <span style={{ color: '#16A34A' }}>NOT REQUIRED</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
              Upcoming 24h precipitation (14.5 mm) will satisfy evapotranspiration water demands. Resuming irrigation now risks waterlogging and root hypoxia.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.85rem', backgroundColor: '#F0F9FF', padding: '0.75rem', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#0369A1', display: 'block' }}>Estimated Soil Moisture</span>
                <strong style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>74% (Adequate)</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#0369A1', display: 'block' }}>Rainfall Offset</span>
                <strong style={{ fontSize: '0.95rem', color: '#0C4A6E' }}>+10.8 mm effective</strong>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>Next Check: Tomorrow 06:00 AM</span>
            <button
              onClick={() => onNavigate('smart-irrigation')}
              style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Calculator <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Disease Risk Prediction Card */}
        <div className="gm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="gm-badge gm-badge-orange">🦠 Crop Disease Risk</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '12px' }}>
                MODERATE RISK
              </span>
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '0.4rem' }}>
              Yellow Rust & Leaf Spot Watch
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>
              Sustained 72% RH combined with 28.5°C creates favorable micro-meteorological spore incubation conditions.
            </p>

            <div style={{ marginTop: '0.75rem', padding: '0.65rem', backgroundColor: '#FFFBEB', borderRadius: '6px', border: '1px solid #FDE68A', fontSize: '0.78rem', color: '#92400E' }}>
              <strong>Recommended Action:</strong> Scout flag leaves in shaded borders. Delay prophylactic fungicide spraying until rainfall subsides.
            </div>
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary-text)' }}>Micro-climatic Index: 64/100</span>
            <button
              onClick={() => onNavigate('disease-risk')}
              style={{ background: 'none', border: 'none', color: '#D97706', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
            >
              Risk Analysis <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
