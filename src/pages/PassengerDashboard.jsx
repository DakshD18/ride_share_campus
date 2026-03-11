import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, User, MapPin, Phone, QrCode, Star, Clock,
  Home, Navigation, History, LogOut, Menu, X,
  ChevronRight, Shield, Zap, CheckCircle, Search,
  ArrowRight, Calendar, IndianRupee, AlertCircle
} from 'lucide-react';

/* ══════════════════════════════════════════
   STYLES INJECTION
══════════════════════════════════════════ */
const injectStyles = () => {
  if (document.getElementById('pd-styles')) return;
  const s = document.createElement('style');
  s.id = 'pd-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

    .pd-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .pd-root { font-family: 'Outfit', sans-serif; }

    @keyframes pdFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pdSlideRight {
      from { opacity: 0; transform: translateX(-20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes otpPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
      50%     { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
    }
    @keyframes statusPing {
      0%  { transform: scale(1); opacity: 1; }
      75%,100% { transform: scale(2); opacity: 0; }
    }
    @keyframes progressFill {
      from { width: 0%; }
      to   { width: 65%; }
    }
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(20px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes mapGrid {
      0%   { background-position: 0 0; }
      100% { background-position: 50px 50px; }
    }
    @keyframes carMove {
      0%,100% { transform: translate(0,0); }
      25%     { transform: translate(8px,-4px); }
      50%     { transform: translate(16px,0px); }
      75%     { transform: translate(8px,4px); }
    }

    .pd-nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border-radius: 0.75rem;
      cursor: pointer; transition: all 0.2s; color: #64748b;
      font-size: 0.9rem; font-weight: 500; text-decoration: none;
      border: none; background: none; width: 100%; font-family: inherit;
    }
    .pd-nav-item:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
    .pd-nav-item.active { background: rgba(59,130,246,0.12); color: #60a5fa; }
    .pd-nav-item.active .pd-nav-icon { color: #3b82f6; }

    .pd-driver-card {
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
      cursor: pointer;
    }
    .pd-driver-card:hover {
      transform: translateY(-3px);
      border-color: rgba(59,130,246,0.3) !important;
      box-shadow: 0 12px 30px rgba(0,0,0,0.3) !important;
    }
    .pd-driver-card.selected {
      border-color: rgba(59,130,246,0.6) !important;
      background: rgba(59,130,246,0.06) !important;
    }

    .pd-btn-primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white; border: none; border-radius: 0.75rem;
      padding: 0.8rem 1.5rem; font-weight: 700; cursor: pointer;
      font-size: 0.9rem; font-family: inherit; letter-spacing: 0.02em;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.2s; box-shadow: 0 4px 16px rgba(59,130,246,0.35);
    }
    .pd-btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .pd-btn-primary:active { transform: translateY(0); }

    .pd-btn-green {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; border: none; border-radius: 0.75rem;
      padding: 0.8rem 1.5rem; font-weight: 700; cursor: pointer;
      font-size: 0.9rem; font-family: inherit; letter-spacing: 0.02em;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.2s; box-shadow: 0 4px 16px rgba(16,185,129,0.35);
    }
    .pd-btn-green:hover { transform: translateY(-2px); filter: brightness(1.1); }

    .pd-btn-ghost {
      background: rgba(255,255,255,0.05); color: #cbd5e1;
      border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem;
      padding: 0.8rem 1.5rem; font-weight: 600; cursor: pointer;
      font-size: 0.9rem; font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.2s;
    }
    .pd-btn-ghost:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

    .pd-input {
      width: 100%; padding: 0.8rem 1rem 0.8rem 2.75rem;
      background: rgba(2,6,23,0.6); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 0.75rem; color: #f8fafc; font-size: 0.92rem;
      outline: none; transition: all 0.2s; font-family: inherit;
    }
    .pd-input:focus {
      border-color: rgba(59,130,246,0.5);
      box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
      background: rgba(2,6,23,0.8);
    }
    .pd-input::placeholder { color: #475569; }

    .otp-box {
      animation: otpPulse 2s infinite;
    }

    .status-ping::after {
      content: '';
      position: absolute; inset: 0; border-radius: 50%;
      background: inherit;
      animation: statusPing 1.5s cubic-bezier(0,0,0.2,1) infinite;
    }

    .pd-history-row:hover {
      background: rgba(255,255,255,0.03) !important;
    }

    .pd-call-btn:hover {
      background: rgba(16,185,129,0.2) !important;
      border-color: rgba(16,185,129,0.4) !important;
      transform: translateY(-1px);
    }
    .pd-qr-btn:hover {
      background: rgba(139,92,246,0.2) !important;
      border-color: rgba(139,92,246,0.4) !important;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .pd-sidebar { display: none !important; }
      .pd-mobile-nav { display: flex !important; }
      .pd-main { margin-left: 0 !important; padding-bottom: 80px !important; }
    }
  `;
  document.head.appendChild(s);
};

/* ══════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════ */
const MOCK_DRIVERS = [
  {
    id: 1, name: 'Rahul Sharma', rating: 4.9, rides: 234,
    vehicle: 'Honda City', vehicleNo: 'MH12 AB 1234',
    vehicleColor: 'White', fare: 45, eta: '3 min',
    phone: '9876543210', upiId: 'rahul.sharma@upi',
    photo: null, online: true,
  },
  {
    id: 2, name: 'Priya Patel', rating: 4.7, rides: 189,
    vehicle: 'Maruti Swift', vehicleNo: 'MH14 CD 5678',
    vehicleColor: 'Silver', fare: 38, eta: '5 min',
    phone: '9123456780', upiId: 'priya.patel@upi',
    photo: null, online: true,
  },
  {
    id: 3, name: 'Arjun Nair', rating: 4.8, rides: 312,
    vehicle: 'Hyundai i20', vehicleNo: 'MH04 EF 9012',
    vehicleColor: 'Blue', fare: 52, eta: '7 min',
    phone: '9988776655', upiId: 'arjun.nair@upi',
    photo: null, online: true,
  },
];

const MOCK_HISTORY = [
  { id: 1, driver: 'Rahul Sharma', from: 'Main Gate', to: 'Library', date: 'Mar 10', fare: 45, status: 'completed' },
  { id: 2, driver: 'Priya Patel', from: 'Hostel Block A', to: 'Canteen', date: 'Mar 9', fare: 30, status: 'completed' },
  { id: 3, driver: 'Arjun Nair', from: 'Sports Ground', to: 'Admin Block', date: 'Mar 8', fare: 55, status: 'completed' },
  { id: 4, driver: 'Kavya Reddy', from: 'Lab Complex', to: 'Main Gate', date: 'Mar 7', fare: 40, status: 'cancelled' },
];

/* ══════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════ */

/* Avatar — shows photo or initials */
const Avatar = ({ name, photo, size = 40, fontSize = '1rem' }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: photo ? 'transparent' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize, fontWeight: 700, color: 'white', overflow: 'hidden',
    border: '2px solid rgba(59,130,246,0.3)',
  }}>
    {photo
      ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }
  </div>
);

/* Star rating display */
const Stars = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <Star size={12} fill="#f59e0b" color="#f59e0b" />
    <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 700 }}>{rating}</span>
  </div>
);

/* Map placeholder */
const MapPlaceholder = ({ height = '280px', showCar = false }) => (
  <div style={{
    width: '100%', height, borderRadius: '1rem', overflow: 'hidden', position: 'relative',
    background: '#0a1628',
    border: '1px solid rgba(255,255,255,0.06)',
  }}>
    {/* Grid lines mimicking a map */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `
        linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }} />
    {/* Roads */}
    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(59,130,246,0.15)', transform: 'translateY(-50%)' }} />
    <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '2px', background: 'rgba(59,130,246,0.1)' }} />
    <div style={{ position: 'absolute', left: '65%', top: 0, bottom: 0, width: '2px', background: 'rgba(59,130,246,0.1)' }} />
    <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
    <div style={{ position: 'absolute', top: '70%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
    {/* Route line */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <path d="M 60,200 Q 140,160 200,150 Q 260,140 300,100 Q 340,60 380,80" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="6,4" opacity="0.7" />
    </svg>
    {/* Pickup marker */}
    <div style={{ position: 'absolute', bottom: '28%', left: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', border: '2px solid white', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
      <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, marginTop: '2px', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: '4px' }}>YOU</div>
    </div>
    {/* Drop marker */}
    <div style={{ position: 'absolute', top: '18%', right: '18%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', border: '2px solid white', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
      <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, marginTop: '2px', background: 'rgba(0,0,0,0.6)', padding: '1px 4px', borderRadius: '4px' }}>DROP</div>
    </div>
    {/* Moving car icon */}
    {showCar && (
      <div style={{ position: 'absolute', top: '42%', left: '44%', animation: 'carMove 4s ease-in-out infinite' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(59,130,246,0.6)' }}>
          <Car size={14} color="white" />
        </div>
      </div>
    )}
    {/* Map label */}
    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', fontSize: '0.7rem', color: '#334155', fontWeight: 600, background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
      CAMPUS MAP
    </div>
    {/* Google Maps note */}
    <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', fontSize: '0.65rem', color: '#1e3a5f', fontWeight: 600 }}>
      Google Maps will load here
    </div>
  </div>
);

/* OTP Display */
const OTPDisplay = ({ otp = '4721' }) => (
  <div style={{
    background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '1rem', padding: '1.25rem', textAlign: 'center',
  }}>
    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
      Your Ride OTP — Share with driver at pickup
    </div>
    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
      {otp.split('').map((d, i) => (
        <div key={i} className="otp-box" style={{
          width: '52px', height: '60px', background: 'rgba(2,6,23,0.8)',
          border: '1.5px solid rgba(59,130,246,0.4)', borderRadius: '0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace',
        }}>{d}</div>
      ))}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
      <Shield size={12} color="#10b981" />
      <span>Valid for this ride only. Do not share with anyone else.</span>
    </div>
  </div>
);

/* Driver info card for active ride */
const ActiveDriverCard = ({ driver, onCall, onQR }) => (
  <div style={{
    background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <Avatar name={driver.name} photo={driver.photo} size={52} fontSize='1.1rem' />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>{driver.name}</div>
        <Stars rating={driver.rating} />
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem' }}>{driver.rides} rides completed</div>
      </div>
      {/* Status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
        <div style={{ position: 'relative', width: '10px', height: '10px' }}>
          <div className="status-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>LIVE</span>
      </div>
    </div>

    {/* Vehicle details */}
    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0.75rem', padding: '0.85rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.6rem' }}>Vehicle Details</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={18} color="#60a5fa" />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>{driver.vehicle}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{driver.vehicleColor}</div>
          </div>
        </div>
        {/* Number plate */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.5rem', padding: '0.4rem 0.85rem',
          fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc',
          letterSpacing: '0.08em', fontFamily: 'monospace',
        }}>
          {driver.vehicleNo}
        </div>
      </div>
    </div>

    {/* Action buttons */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
      <button className="pd-call-btn" onClick={onCall} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.7rem', borderRadius: '0.65rem', cursor: 'pointer', fontFamily: 'inherit',
        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
        color: '#34d399', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
      }}>
        <Phone size={15} /> Call Driver
      </button>
      <button className="pd-qr-btn" onClick={onQR} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        padding: '0.7rem', borderRadius: '0.65rem', cursor: 'pointer', fontFamily: 'inherit',
        background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
        color: '#a78bfa', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
      }}>
        <QrCode size={15} /> View QR
      </button>
    </div>
  </div>
);

/* Ride status steps */
const RideStatus = ({ step }) => {
  const steps = ['Driver Assigned', 'Driver On The Way', 'Driver Arrived', 'Ride In Progress'];
  return (
    <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ride Status</span>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{steps[step]}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i <= step ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.05)',
                border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i <= step ? '0 0 8px rgba(59,130,246,0.4)' : 'none',
              }}>
                {i <= step ? <CheckCircle size={12} color="white" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
              </div>
              <span style={{ fontSize: '0.6rem', color: i <= step ? '#93c5fd' : '#334155', textAlign: 'center', maxWidth: '50px', lineHeight: 1.3 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < step ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 'rgba(255,255,255,0.05)', marginBottom: '1.2rem' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const PassengerDashboard = () => {
  injectStyles();

  const [activeTab, setActiveTab] = useState('book');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [driversVisible, setDriversVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [rideActive, setRideActive] = useState(false);
  const [rideStep, setRideStep] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Mock user
  const user = { name: 'Arjun Singh', email: 'arjun@college.edu', totalRides: 12, memberSince: 'Jan 2025' };
  const otp = '4721';

  const handleFindRides = () => {
    if (pickup && drop) setDriversVisible(true);
  };

  const handleBookRide = () => {
    if (!selectedDriver) return;
    setRideActive(true);
    setActiveTab('active');
    // Simulate ride progressing
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setRideStep(step);
      if (step >= 3) clearInterval(interval);
    }, 4000);
  };

  const handleCall = () => {
    if (selectedDriver) window.location.href = `tel:${selectedDriver.phone}`;
  };

  const handleQR = () => {
    if (selectedDriver) window.open(`upi://pay?pa=${selectedDriver.upiId}&pn=${selectedDriver.name}`, '_blank');
  };

  const navItems = [
    { id: 'book', icon: Home, label: 'Book Ride' },
    { id: 'active', icon: Navigation, label: 'Active Ride' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '240px', height: '100vh',
      background: 'rgba(10,16,35,0.95)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', zIndex: 100, padding: '1.5rem 1rem',
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Car size={16} color="white" />
        </div>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif" }}>
          Ride<span style={{ background: 'linear-gradient(135deg,#60a5fa,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
        </span>
      </Link>

      {/* Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.65rem', marginBottom: '1.5rem' }}>
        <User size={13} color="#60a5fa" />
        <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>Passenger Mode</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} className={`pd-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}>
            <item.icon size={18} className="pd-nav-icon" />
            {item.label}
            {item.id === 'active' && rideActive && (
              <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            )}
          </button>
        ))}
      </nav>

      {/* User info at bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Avatar name={user.name} size={36} fontSize='0.85rem' />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#475569' }}>{user.email}</div>
          </div>
        </div>
        <Link to="/role-select" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.03)', color: '#475569', fontSize: '0.8rem', textDecoration: 'none', transition: 'all 0.2s' }}>
          <LogOut size={14} /> Switch Role
        </Link>
      </div>
    </div>
  );

  /* ── Mobile bottom nav ── */
  const MobileNav = () => (
    <div className="pd-mobile-nav" style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,16,35,0.95)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '0.5rem 0', zIndex: 100, justifyContent: 'space-around',
    }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem',
          color: activeTab === item.id ? '#60a5fa' : '#475569', fontFamily: 'inherit',
          fontSize: '0.65rem', fontWeight: 600,
        }}>
          <item.icon size={20} />
          {item.label}
        </button>
      ))}
    </div>
  );

  /* ══════════════════════════════
     TAB CONTENTS
  ══════════════════════════════ */

  /* BOOK RIDE TAB */
  const BookTab = () => (
    <div style={{ animation: 'pdFadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Book a Ride</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Enter your pickup and drop location to find available drivers.</p>
      </div>

      {/* Location inputs */}
      <div style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Pickup */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '0.4rem' }}>Pickup Location</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981' }}><MapPin size={15} /></div>
            <input className="pd-input" placeholder="e.g. Main Gate, Hostel A..." value={pickup} onChange={e => setPickup(e.target.value)} />
          </div>
        </div>
        {/* Divider with swap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.04)' }} />
        </div>
        {/* Drop */}
        <div>
          <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '0.4rem' }}>Drop Location</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }}><MapPin size={15} /></div>
            <input className="pd-input" placeholder="e.g. Library, Lab Complex..." value={drop} onChange={e => setDrop(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Map */}
      <div style={{ marginBottom: '1.25rem' }}>
        <MapPlaceholder height="220px" />
      </div>

      {/* Find button */}
      <button className="pd-btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }} onClick={handleFindRides}>
        <Search size={16} /> Find Available Drivers
      </button>

      {/* Driver list */}
      {driversVisible && (
        <div style={{ animation: 'pdFadeIn 0.4s ease' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
            {MOCK_DRIVERS.length} Drivers Available
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {MOCK_DRIVERS.map(driver => (
              <div key={driver.id} className={`pd-driver-card ${selectedDriver?.id === driver.id ? 'selected' : ''}`}
                onClick={() => setSelectedDriver(driver)}
                style={{
                  background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Avatar name={driver.name} photo={driver.photo} size={44} fontSize='0.95rem' />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>{driver.name}</span>
                      <Stars rating={driver.rating} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <Car size={12} color="#60a5fa" />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{driver.vehicle}</span>
                      <span style={{ fontSize: '0.7rem', color: '#334155' }}>·</span>
                      <span style={{ fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', fontWeight: 600 }}>{driver.vehicleNo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={11} color="#64748b" />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{driver.eta}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <IndianRupee size={11} color="#10b981" />
                        <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>₹{driver.fare}</span>
                      </div>
                    </div>
                  </div>
                  {selectedDriver?.id === driver.id && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={12} color="white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedDriver && (
            <button className="pd-btn-green" style={{ width: '100%' }} onClick={handleBookRide}>
              Book Ride with {selectedDriver.name} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  /* ACTIVE RIDE TAB */
  const ActiveTab = () => {
    if (!rideActive || !selectedDriver) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem', animation: 'pdFadeIn 0.4s ease' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={28} color="#3b82f6" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>No Active Ride</h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', textAlign: 'center', maxWidth: '260px', lineHeight: 1.6 }}>You don't have an active ride. Book one from the Book Ride tab.</p>
        <button className="pd-btn-primary" onClick={() => setActiveTab('book')}>Book a Ride</button>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'pdFadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Active Ride</h2>
      
        </div>

        {/* Map */}
        <MapPlaceholder height="240px" showCar={true} />

        {/* Ride status */}
        <RideStatus step={rideStep} />

        {/* Driver card */}
        <ActiveDriverCard driver={selectedDriver} onCall={handleCall} onQR={handleQR} />

        {/* OTP */}
        <OTPDisplay otp={otp} />

        {/* Route summary */}
        <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '0.5rem' }}>{pickup || 'Main Gate'}</div>
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600 }}>{drop || 'Library'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>₹{selectedDriver.fare}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>Est. fare</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* HISTORY TAB */
  const HistoryTab = () => (
    <div style={{ animation: 'pdFadeIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Ride History</h2>
      <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>Your past campus rides.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {MOCK_HISTORY.map(ride => (
          <div key={ride.id} className="pd-history-row" style={{
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem', padding: '1rem', transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: ride.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${ride.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={14} color={ride.status === 'completed' ? '#10b981' : '#ef4444'} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{ride.driver}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981' }}>₹{ride.fare}</span>
                <span style={{
                  fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600,
                  background: ride.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: ride.status === 'completed' ? '#10b981' : '#ef4444',
                  border: `1px solid ${ride.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {ride.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>{ride.from}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ride.to}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={11} color="#475569" />
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>{ride.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* PROFILE TAB */
  const ProfileTab = () => (
    <div style={{ animation: 'pdFadeIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Profile</h2>

      {/* Profile card */}
      <div style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Avatar name={user.name} size={72} fontSize='1.4rem' />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", marginBottom: '0.3rem' }}>{user.name}</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>{user.email}</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '999px' }}>
          <Shield size={11} color="#60a5fa" />
          <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 600 }}>Verified Student</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Rides', value: user.totalRides, icon: Car, color: '#3b82f6' },
          { label: 'Member Since', value: user.memberSince, icon: Calendar, color: '#10b981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `rgba(${i === 0 ? '59,130,246' : '16,185,129'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <stat.icon size={17} color={stat.color} />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Switch role */}
      <Link to="/role-select" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1rem', padding: '1rem 1.25rem', textDecoration: 'none',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={17} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>Switch to Driver Mode</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>Offer rides and earn</div>
          </div>
        </div>
        <ChevronRight size={16} color="#475569" />
      </Link>
    </div>
  );

  /* ══════════════════════════════
     RENDER
  ══════════════════════════════ */
  const tabContent = {
    book: BookTab(),
    active: ActiveTab(),
    history: HistoryTab(),
    profile: ProfileTab(),
  };

  return (
    <div className="pd-root" style={{ minHeight: '100vh', background: '#020617' }}>
      {Sidebar()}
      {MobileNav()}

      {/* Main content area */}
      <div className="pd-main" style={{ marginLeft: '240px', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;