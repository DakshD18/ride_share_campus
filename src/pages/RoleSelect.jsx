import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User, ArrowRight, MapPin, Shield, Star, Zap } from 'lucide-react';

const injectStyles = () => {
  if (document.getElementById('role-select-styles')) return;
  const style = document.createElement('style');
  style.id = 'role-select-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@400;500;600&display=swap');

    @keyframes pageIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cardSlideIn {
      from { opacity: 0; transform: translateY(40px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes orbDrift1 {
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(40px, 25px); }
    }
    @keyframes orbDrift2 {
      0%,100% { transform: translate(0,0); }
      50%     { transform: translate(-30px, -20px); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes iconFloat {
      0%,100% { transform: translateY(0px); }
      50%     { transform: translateY(-6px); }
    }

    .rs-page { animation: pageIn 0.4s ease forwards; }
    .rs-greeting { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
    .rs-subtitle { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
    .rs-cards { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
    .rs-footer { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.45s both; }

    .orb1 { animation: orbDrift1 9s ease-in-out infinite; }
    .orb2 { animation: orbDrift2 11s ease-in-out infinite; }

    .role-card {
      cursor: pointer;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                  box-shadow 0.25s cubic-bezier(0.4,0,0.2,1),
                  border-color 0.25s cubic-bezier(0.4,0,0.2,1),
                  background 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .role-card:hover {
      transform: translateY(-6px) scale(1.01);
    }
    .role-card.passenger:hover {
      border-color: rgba(59,130,246,0.5) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.12) !important;
    }
    .role-card.driver:hover {
      border-color: rgba(16,185,129,0.5) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(16,185,129,0.12) !important;
    }
    .role-card.selected-passenger {
      border-color: rgba(59,130,246,0.7) !important;
      background: rgba(59,130,246,0.08) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 50px rgba(59,130,246,0.18) !important;
      transform: translateY(-4px) scale(1.01);
    }
    .role-card.selected-driver {
      border-color: rgba(16,185,129,0.7) !important;
      background: rgba(16,185,129,0.08) !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 50px rgba(16,185,129,0.18) !important;
      transform: translateY(-4px) scale(1.01);
    }

    .icon-passenger { animation: iconFloat 3s ease-in-out infinite; }
    .icon-driver    { animation: iconFloat 3s ease-in-out infinite 0.8s; }

    .continue-btn {
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .continue-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      filter: brightness(1.1);
    }
    .continue-btn:active:not(:disabled) { transform: translateY(-1px); }
    .continue-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .shimmer-text {
      background: linear-gradient(90deg, #60a5fa, #a78bfa, #34d399, #60a5fa);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .pill-badge {
      transition: all 0.2s;
    }

    @media (max-width: 640px) {
      .rs-cards-inner { flex-direction: column !important; }
      .role-card { width: 100% !important; }
    }
  `;
  document.head.appendChild(style);
};

/* ── Role feature pill ── */
const Pill = ({ icon: Icon, text, color }) => (
  <div className="pill-badge" style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    padding: '0.3rem 0.7rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 500,
    background: color === 'blue' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)',
    border: `1px solid ${color === 'blue' ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)'}`,
    color: color === 'blue' ? '#93c5fd' : '#6ee7b7',
  }}>
    <Icon size={11} />
    {text}
  </div>
);

/* ════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════ */
const RoleSelect = () => {
  injectStyles();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null); // 'passenger' | 'driver'

  const handleContinue = () => {
    if (!selected) return;
    // Save role to session/context/Firestore here
    // Then navigate to the correct dashboard
    if (selected === 'passenger') navigate('/dashboard/passenger');
    else navigate('/dashboard/driver');
  };

  // Simulate a logged-in user's name — replace with real Firebase user data
  const userName = 'Arjun';

  return (
    <div className="rs-page" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* ── Background orbs ── */}
      <div className="orb1" style={{ position: 'fixed', top: '-15%', left: '-10%', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="orb2" style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Grid texture */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0, maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '720px' }}>

        {/* ── Greeting ── */}
        <div className="rs-greeting" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span style={{ fontSize: '0.78rem', color: '#6ee7b7', fontWeight: 600, letterSpacing: '0.04em' }}>Verified Student · Logged In</span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: "'Syne', sans-serif", marginBottom: '0' }}>
            Hey {userName} 👋
          </h1>
        </div>

        {/* ── Subtitle ── */}
        <div className="rs-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", marginBottom: '0.6rem' }}>
            How do you want to{' '}
            <span className="shimmer-text">ride today?</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            Pick your role for this session. You can switch anytime you come back.
          </p>
        </div>

        {/* ── Role Cards ── */}
        <div className="rs-cards">
          <div className="rs-cards-inner" style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>

            {/* ── PASSENGER CARD ── */}
            <div
              className={`role-card passenger ${selected === 'passenger' ? 'selected-passenger' : ''}`}
              onClick={() => setSelected('passenger')}
              style={{
                flex: 1, position: 'relative', overflow: 'hidden',
                background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                borderRadius: '1.5rem', padding: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', opacity: selected === 'passenger' ? 1 : 0.3, transition: 'opacity 0.3s' }} />

              {/* Selected indicator */}
              {selected === 'passenger' && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(59,130,246,0.6)' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="icon-passenger" style={{ width: '64px', height: '64px', borderRadius: '18px', background: selected === 'passenger' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(59,130,246,0.1)', border: `1px solid ${selected === 'passenger' ? 'transparent' : 'rgba(59,130,246,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: selected === 'passenger' ? '0 8px 20px rgba(59,130,246,0.4)' : 'none', transition: 'all 0.3s' }}>
                <User size={28} color={selected === 'passenger' ? 'white' : '#60a5fa'} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
                I need a Ride
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Book a campus ride instantly. See nearby drivers, get an OTP, and track your ride live.
              </p>

              {/* Feature pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <Pill icon={MapPin} text="Live Tracking" color="blue" />
                <Pill icon={Shield} text="OTP Safety" color="blue" />
                <Pill icon={Zap} text="Instant Booking" color="blue" />
              </div>

              {/* What you'll see */}
              <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '0.85rem', padding: '0.9rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>You'll see</div>
                {['Available drivers near you', 'Pickup & drop location map', 'Fare estimate before booking'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: i < 2 ? '0.4rem' : 0 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DRIVER CARD ── */}
            <div
              className={`role-card driver ${selected === 'driver' ? 'selected-driver' : ''}`}
              onClick={() => setSelected('driver')}
              style={{
                flex: 1, position: 'relative', overflow: 'hidden',
                background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                borderRadius: '1.5rem', padding: '2rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #34d399)', opacity: selected === 'driver' ? 1 : 0.3, transition: 'opacity 0.3s' }} />

              {/* Selected indicator */}
              {selected === 'driver' && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16,185,129,0.6)' }}>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className="icon-driver" style={{ width: '64px', height: '64px', borderRadius: '18px', background: selected === 'driver' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(16,185,129,0.1)', border: `1px solid ${selected === 'driver' ? 'transparent' : 'rgba(16,185,129,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: selected === 'driver' ? '0 8px 20px rgba(16,185,129,0.4)' : 'none', transition: 'all 0.3s' }}>
                <Car size={28} color={selected === 'driver' ? 'white' : '#34d399'} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
                I'm Driving
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                Go online and start accepting ride requests from fellow students along your campus route.
              </p>

              {/* Feature pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <Pill icon={Star} text="Build Rating" color="green" />
                <Pill icon={Zap} text="UPI Payouts" color="green" />
                <Pill icon={Shield} text="OTP Verify" color="green" />
              </div>

              {/* What you'll see */}
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '0.85rem', padding: '0.9rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>You'll see</div>
                {['Incoming ride requests', 'Passenger pickup location', 'OTP entry to start the ride'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: i < 2 ? '0.4rem' : 0 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Continue Button ── */}
        <div className="rs-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button
            className="continue-btn"
            onClick={handleContinue}
            disabled={!selected}
            style={{
              padding: '0.95rem 3rem', borderRadius: '0.85rem', border: 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
              fontSize: '1rem', fontWeight: 700, letterSpacing: '0.02em',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              fontFamily: 'inherit',
              background: !selected
                ? 'rgba(255,255,255,0.06)'
                : selected === 'passenger'
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
              color: selected ? 'white' : '#334155',
              boxShadow: !selected ? 'none'
                : selected === 'passenger'
                  ? '0 6px 24px rgba(59,130,246,0.45)'
                  : '0 6px 24px rgba(16,185,129,0.45)',
            }}
          >
            {selected
              ? `Continue as ${selected === 'passenger' ? 'Passenger' : 'Driver'}`
              : 'Select a role to continue'}
            {selected && <ArrowRight size={18} />}
          </button>

          <p style={{ fontSize: '0.8rem', color: '#334155', textAlign: 'center' }}>
            You can switch roles next time you open the app
          </p>
        </div>

      </div>
    </div>
  );
};

export default RoleSelect;