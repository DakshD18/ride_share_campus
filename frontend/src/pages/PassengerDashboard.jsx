import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  fetchAvailableRides,
  bookRide,
  listenToRide,
  listenToPassengerRide,
  fetchRideHistory,
} from '../services/firestoreApi';
import RideMap, { PlaceAutocomplete } from '../components/RideMap';
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
   (Mock data removed — now using Firestore)
══════════════════════════════════════════ */

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


/* ── MapPlaceholder replaced by real Google Map (RideMap component) ──── */


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
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('book');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);  // { lat, lng } from Places
  const [dropCoords, setDropCoords]     = useState(null);  // { lat, lng } from Places
  const [driversVisible, setDriversVisible] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideActive, setRideActive] = useState(false);
  const [activeRideData, setActiveRideData] = useState(null);
  const [rideStep, setRideStep] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [otp, setOtp] = useState('------');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [rideId, setRideId] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);

  // Pull real user info set during Firebase login
  const user = {
    name:        localStorage.getItem('userName')  || 'Passenger',
    email:       localStorage.getItem('userEmail') || '',
    uid:         localStorage.getItem('userUID')   || '',
    totalRides:  12,
    memberSince: 'Jan 2025',
  };

  // ── Listen for active ride (in case passenger already has one) ──
  useEffect(() => {
    if (!user.uid) return;
    const unsub = listenToPassengerRide(user.uid, (ride) => {
      if (ride) {
        setRideActive(true);
        setActiveRideData(ride);
        setRideId(ride.id);
        setOtp(ride.otp || '------');
        // Map status to step
        const statusStepMap = { booked: 0, started: 2, in_progress: 3 };
        setRideStep(statusStepMap[ride.status] || 1);
        // Update driver location for live tracking
        if (ride.driverLat && ride.driverLng) {
          setDriverLocation({ lat: ride.driverLat, lng: ride.driverLng });
        }
        if (ride.pickupCoords) setPickupCoords(ride.pickupCoords);
        if (ride.destCoords) setDropCoords(ride.destCoords);
      } else {
        // No active ride
        if (rideActive && activeRideData?.status === 'completed') {
          // Ride just completed — could show rating
        }
      }
    });
    return () => unsub();
  }, [user.uid]);

  // ── Fetch ride history ──
  useEffect(() => {
    if (!user.uid) return;
    fetchRideHistory(user.uid, 'passenger').then(setRideHistory).catch(console.error);
  }, [user.uid, rideActive]);

  const handleFindRides = async () => {
    if (!pickup || !drop) {
      alert("Please enter both pickup and destination.");
      return;
    }
    try {
      const rides = await fetchAvailableRides();
      setAvailableRides(rides);
      setDriversVisible(true);
    } catch (err) {
      console.error("Fetch rides error:", err);
      alert("Error fetching rides: " + err.message);
    }
  };

  const handleBookRide = async () => {
    if (!selectedRide) return;

    setOtpLoading(true);
    setOtpError('');

    try {
      const generatedOtp = await bookRide(selectedRide.id, user.uid, user.name);
      setOtp(generatedOtp);
      setRideId(selectedRide.id);
      setRideActive(true);
      setActiveTab('active');
    } catch (err) {
      setOtpError('Failed to book ride. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCall = () => {
    // In a real app, would fetch driver phone from Firestore
    window.location.href = `tel:0000000000`;
  };

  const handleQR = () => {
    // Placeholder for UPI payment
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/role-select" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.5rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.03)', color: '#475569', fontSize: '0.75rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Car size={14} /> Switch Role
          </Link>
          <button onClick={handleLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.5rem', borderRadius: '0.6rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
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
            <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#10b981', zIndex: 1 }}><MapPin size={15} /></div>
            <PlaceAutocomplete
              placeholder="e.g. Main Gate, Hostel A..."
              value={pickup}
              onChange={(val) => { setPickup(val); if (!val) setPickupCoords(null); }}
              onPlaceSelect={(place) => { setPickup(place.address); setPickupCoords({ lat: place.lat, lng: place.lng }); }}
              className="pd-input"
              style={{ paddingLeft: '2.4rem' }}
            />
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
            <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', zIndex: 1 }}><MapPin size={15} /></div>
            <PlaceAutocomplete
              placeholder="e.g. Library, Lab Complex..."
              value={drop}
              onChange={(val) => { setDrop(val); if (!val) setDropCoords(null); }}
              onPlaceSelect={(place) => { setDrop(place.address); setDropCoords({ lat: place.lat, lng: place.lng }); }}
              className="pd-input"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </div>
      </div>

      {/* Map — real Google Map */}
      <div style={{ marginBottom: '1.25rem' }}>
        <RideMap
          height="240px"
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          showCar={false}
          accentColor="blue"
        />
      </div>

      {/* Find button */}
      <button className="pd-btn-primary" style={{ width: '100%', marginBottom: '1.25rem' }} onClick={handleFindRides}>
        <Search size={16} /> Find Available Drivers
      </button>

      {/* Available rides list */}
      {driversVisible && (
        <div style={{ animation: 'pdFadeIn 0.4s ease' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
            {availableRides.length} Ride{availableRides.length !== 1 ? 's' : ''} Available
          </div>
          {availableRides.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.88rem' }}>
              No rides available right now. Check back in a few minutes.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {availableRides.map(ride => (
              <div key={ride.id} className={`pd-driver-card ${selectedRide?.id === ride.id ? 'selected' : ''}`}
                onClick={() => setSelectedRide(ride)}
                style={{
                  background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Avatar name={ride.driverName} photo={null} size={44} fontSize='0.95rem' />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>{ride.driverName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                      <MapPin size={12} color="#10b981" />
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ride.pickup}</span>
                      <span style={{ fontSize: '0.7rem', color: '#334155' }}>→</span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ride.destination}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={11} color="#64748b" />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{ride.time || 'Flexible'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <IndianRupee size={11} color="#10b981" />
                        <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>₹{ride.fare || 0}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <User size={11} color="#64748b" />
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{ride.seats || 1} seat{(ride.seats || 1) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  {selectedRide?.id === ride.id && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={12} color="white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {selectedRide && (
            <button className="pd-btn-green" style={{ width: '100%' }} onClick={handleBookRide}>
              Book Ride with {selectedRide.driverName} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );

  /* ACTIVE RIDE TAB */
  const ActiveTab = () => {
    const rideInfo = activeRideData || selectedRide;
    if (!rideActive || !rideInfo) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem', animation: 'pdFadeIn 0.4s ease' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={28} color="#3b82f6" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne', sans-serif" }}>No Active Ride</h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', textAlign: 'center', maxWidth: '260px', lineHeight: 1.6 }}>You don't have an active ride. Book one from the Book Ride tab.</p>
        <button className="pd-btn-primary" onClick={() => setActiveTab('book')}>Book a Ride</button>
      </div>
    );

    // Build a driver-like object for ActiveDriverCard
    const driverCard = {
      name: rideInfo.driverName || 'Driver',
      rating: 4.5,
      rides: 0,
      vehicle: 'Campus Vehicle',
      vehicleNo: '—',
      vehicleColor: '—',
      photo: null,
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'pdFadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.03em' }}>Active Ride</h2>
        </div>

        {/* Map */}
        <RideMap
          height="240px"
          pickupCoords={pickupCoords}
          dropCoords={dropCoords}
          showCar={rideStep >= 2}
          accentColor="blue"
        />

        {/* Ride status */}
        <RideStatus step={rideStep} />

        {/* Driver card */}
        <ActiveDriverCard driver={driverCard} onCall={handleCall} onQR={handleQR} />

        {/* OTP */}
        {otpLoading ? (
          <div style={{
            background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '1rem', padding: '1.5rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.85rem', color: '#60a5fa' }}>⏳ Booking ride...</div>
          </div>
        ) : (
          <>
            {otpError && (
              <div style={{
                fontSize: '0.75rem', color: '#f87171', background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem',
                padding: '0.5rem 0.75rem', marginBottom: '0.5rem',
              }}>⚠️ {otpError}</div>
            )}
            <OTPDisplay otp={otp} />
          </>
        )}

        {/* Route summary */}
        <div style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '0.5rem' }}>{rideInfo.pickup || pickup || 'Pickup'}</div>
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600 }}>{rideInfo.destination || drop || 'Destination'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>₹{rideInfo.fare || 0}</div>
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

      {rideHistory.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.88rem' }}>
          No ride history yet. Your completed rides will appear here.
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {rideHistory.map(ride => (
          <div key={ride.id} className="pd-history-row" style={{
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem', padding: '1rem', transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: ride.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${ride.status === 'completed' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={14} color={ride.status === 'completed' ? '#10b981' : '#ef4444'} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{ride.driverName || 'Driver'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981' }}>₹{ride.fare || 0}</span>
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
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>{ride.pickup}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ride.destination}</div>
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