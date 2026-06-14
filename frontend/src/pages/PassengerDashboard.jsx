import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
  fetchAvailableRides,
  bookRide,
  postRideRequest,
  cancelRideByPassenger,
  listenToRide,
  listenToPassengerRide,
  fetchRideHistory,
  confirmPayment,
  getDriverUpi,
} from '../services/firestoreApi';
import RideMap, { PlaceAutocomplete } from '../components/RideMap';
import RatingModal from '../components/RatingModal';
import PaymentModal from '../components/PaymentModal';
import { useNotification } from '../hooks/useNotification';
import {
  Car, User, MapPin, Phone, QrCode, Star, Clock,
  Home, Navigation, History, LogOut, Menu, X,
  ChevronRight, Shield, Zap, CheckCircle, Search,
  ArrowRight, Calendar, IndianRupee, AlertCircle, Sparkles
} from 'lucide-react';

/* ══════════════════════════════════════════
   STYLES INJECTION — Premium Passenger UI
══════════════════════════════════════════ */
const injectStyles = () => {
  if (document.getElementById('pd-styles-v2')) return;
  const s = document.createElement('style');
  s.id = 'pd-styles-v2';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    .pd-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .pd-root {
      font-family: 'Inter', -apple-system, sans-serif;
      overflow: hidden; height: 100vh; width: 100vw;
      position: relative; background: #0a0e1a;
    }

    @keyframes sheetSlideUp {
      from { transform: translateY(100%); opacity: 0.5; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes otpGlow {
      0%,100% { box-shadow: 0 0 15px rgba(99,102,241,0.3), 0 0 0 0 rgba(99,102,241,0.2); }
      50%     { box-shadow: 0 0 25px rgba(99,102,241,0.5), 0 0 0 6px rgba(99,102,241,0); }
    }
    @keyframes livePulse {
      0%  { transform: scale(1); opacity: 1; }
      75%,100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes searchRadar {
      0% { transform: scale(0.5); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }

    /* Bottom Sheet — Premium Glass */
    .pd-bottom-sheet {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(180deg, rgba(15,18,35,0.92) 0%, rgba(10,14,26,0.97) 100%);
      backdrop-filter: blur(40px) saturate(1.8);
      -webkit-backdrop-filter: blur(40px) saturate(1.8);
      border-top: 1px solid rgba(99,102,241,0.2);
      border-top-left-radius: 28px;
      border-top-right-radius: 28px;
      padding: 0 1.5rem 2.5rem 1.5rem;
      z-index: 100;
      animation: sheetSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      box-shadow: 0 -20px 60px rgba(0,0,0,0.6), 0 -2px 20px rgba(99,102,241,0.08);
      max-height: 80vh;
      overflow-y: auto;
    }
    .pd-bottom-sheet::-webkit-scrollbar { display: none; }

    .sheet-handle-wrap { padding: 12px 0 16px 0; display: flex; justify-content: center; position: sticky; top: 0; z-index: 1; }
    .sheet-handle { width: 36px; height: 4px; border-radius: 99px; background: rgba(255,255,255,0.15); }

    /* Floating Header */
    .pd-float-header {
      position: absolute; top: 0; left: 0; right: 0;
      padding: 1.25rem 1.5rem; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(10,14,26,0.8) 0%, transparent 100%);
    }
    .pd-float-header > * { pointer-events: auto; }

    .glass-circle {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); color: #e2e8f0;
    }
    .glass-circle:hover { background: rgba(255,255,255,0.14); transform: scale(1.05); }
    .glass-circle:active { transform: scale(0.95); }

    /* Buttons */
    .pd-btn-gradient {
      width: 100%; padding: 1rem 1.5rem; border: none; border-radius: 16px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
      background-size: 200% 200%; animation: gradientShift 4s ease infinite;
      color: white; font-weight: 700; font-size: 1rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      box-shadow: 0 8px 32px rgba(99,102,241,0.35), 0 2px 8px rgba(0,0,0,0.2);
      letter-spacing: 0.01em;
      font-family: 'Inter', sans-serif;
    }
    .pd-btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.5); }
    .pd-btn-gradient:active { transform: translateY(0); }
    .pd-btn-gradient:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .pd-btn-outline {
      width: 100%; padding: 0.9rem 1.5rem; border-radius: 14px;
      background: rgba(255,255,255,0.04); color: #a5b4fc;
      border: 1px solid rgba(99,102,241,0.2); font-weight: 600; font-size: 0.95rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.25s; font-family: 'Inter', sans-serif;
    }
    .pd-btn-outline:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.4); transform: translateY(-1px); }

    /* Inputs */
    .pd-location-input {
      width: 100%; padding: 14px 14px 14px 44px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; color: #e2e8f0; font-size: 0.95rem; font-weight: 500;
      outline: none; transition: all 0.25s; font-family: 'Inter', sans-serif;
    }
    .pd-location-input:focus {
      border-color: rgba(99,102,241,0.5);
      background: rgba(99,102,241,0.05);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }
    .pd-location-input::placeholder { color: #475569; font-weight: 400; }

    /* Driver cards */
    .pd-ride-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; padding: 1rem; cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
    }
    .pd-ride-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent);
      opacity: 0; transition: opacity 0.3s;
    }
    .pd-ride-card:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.25); transform: translateY(-2px); }
    .pd-ride-card:hover::before { opacity: 1; }
    .pd-ride-card.selected { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.08); }
    .pd-ride-card.selected::before { opacity: 1; }

    /* OTP boxes */
    .pd-otp-digit {
      width: 56px; height: 68px; border-radius: 14px;
      background: rgba(99,102,241,0.06); border: 1.5px solid rgba(99,102,241,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: 800; color: #a5b4fc;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      animation: otpGlow 3s ease infinite;
      transition: all 0.3s;
    }

    /* Live indicator */
    .live-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    .live-dot::after {
      content: ''; position: absolute; inset: -2px; border-radius: 50%;
      background: #22c55e; animation: livePulse 1.8s cubic-bezier(0,0,0.2,1) infinite;
    }

    /* Full page overlay */
    .pd-overlay {
      position: absolute; inset: 0; z-index: 200;
      background: linear-gradient(180deg, #0a0e1a 0%, #0f1225 100%);
      overflow-y: auto; animation: fadeInUp 0.4s ease forwards;
      padding: 2rem 1.5rem;
    }

    /* Menu dropdown */
    .pd-menu {
      position: absolute; top: 56px; left: 0; min-width: 220px;
      background: rgba(15,18,35,0.95); backdrop-filter: blur(30px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      padding: 8px; z-index: 110;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1);
      animation: fadeInUp 0.2s ease;
    }
    .pd-menu-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      color: #94a3b8; font-size: 0.9rem; font-weight: 500;
      cursor: pointer; transition: all 0.15s; border: none; background: none;
      width: 100%; font-family: 'Inter', sans-serif;
    }
    .pd-menu-item:hover { background: rgba(99,102,241,0.08); color: #c7d2fe; }

    /* Radar animation for searching */
    .radar-ring {
      position: absolute; border-radius: 50%;
      border: 2px solid rgba(99,102,241,0.3);
      animation: searchRadar 2s ease-out infinite;
    }
    .radar-ring:nth-child(2) { animation-delay: 0.66s; }
    .radar-ring:nth-child(3) { animation-delay: 1.33s; }
  `;
  document.head.appendChild(s);
};

/* ══════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════ */
const Avatar = ({ name, photo, size = 40, fontSize = '0.9rem' }) => (
  <div style={{
    width: size, height: size, borderRadius: '14px', flexShrink: 0,
    background: photo ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize, fontWeight: 700, color: 'white', overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
  }}>
    {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
  </div>
);

const Stars = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i <= Math.round(rating) ? '#fbbf24' : 'transparent'} color={i <= Math.round(rating) ? '#fbbf24' : '#334155'} />)}
    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginLeft: '2px' }}>{rating}</span>
  </div>
);

const OTPDisplay = ({ otp = '4721' }) => (
  <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '1rem' }}>
      <Shield size={14} color="#a5b4fc" />
      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Ride OTP</span>
    </div>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
      {otp.split('').map((d, i) => (
        <div key={i} className="pd-otp-digit">{d}</div>
      ))}
    </div>
    <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>Share this code with your driver at pickup</div>
  </div>
);

const ActiveDriverCard = ({ driver, onCall, onQR }) => (
  <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
    {/* Subtle accent line at top */}
    <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)', borderRadius: '2px' }} />
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1rem' }}>
      <Avatar name={driver.name} photo={driver.photo} size={52} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '3px' }}>{driver.name}</div>
        <Stars rating={driver.rating} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: '10px' }}>
        <div className="live-dot" />
        <span style={{ fontSize: '0.6rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
      </div>
    </div>

    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '14px', padding: '12px 16px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Car size={18} color="#a5b4fc" />
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{driver.vehicle}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{driver.vehicleColor}</div>
        </div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.88rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.06em', fontFamily: "'JetBrains Mono', monospace" }}>{driver.vehicleNo}</div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
      <button onClick={onCall} style={{ background: 'rgba(34,197,94,0.08)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}><Phone size={15} /> Call</button>
      <button onClick={onQR} style={{ background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}><QrCode size={15} /> Pay</button>
    </div>
  </div>
);

const RideStatus = ({ step }) => {
  const steps = ['Waiting', 'Assigned', 'Arrived', 'In Progress'];
  return (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ride Status</span>
        <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 700, padding: '3px 10px', background: 'rgba(99,102,241,0.1)', borderRadius: '8px' }}>{steps[step]}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: i <= step ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i <= step ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
                transition: 'all 0.3s',
              }}>
                {i <= step ? <CheckCircle size={13} color="white" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />}
              </div>
              <span style={{ fontSize: '0.58rem', color: i <= step ? '#c7d2fe' : '#475569', textAlign: 'center', fontWeight: i <= step ? 600 : 400 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)', marginBottom: '20px', borderRadius: '2px' }} />}
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
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState('book');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [driversVisible, setDriversVisible] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [rideActive, setRideActive] = useState(false);
  const [activeRideData, setActiveRideData] = useState(null);
  const [rideStep, setRideStep] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [otp, setOtp] = useState('------');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [rideId, setRideId] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [requestingRide, setRequestingRide] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [driverUpiId, setDriverUpiId] = useState('');
  const prevStatusRef = useRef(null);
  const lastRideDataRef = useRef(null);

  const user = {
    name: localStorage.getItem('userName') || 'Passenger',
    email: localStorage.getItem('userEmail') || '',
    uid: localStorage.getItem('userUID') || '',
    totalRides: 12, memberSince: 'Jan 2025',
  };

  /* ── Firestore listeners ── */
  useEffect(() => {
    if (!user.uid) return;
    const unsub = listenToPassengerRide(user.uid, (ride) => {
      if (ride) {
        lastRideDataRef.current = ride;
        const prevStatus = prevStatusRef.current;
        setRideActive(true); setActiveRideData(ride); setRideId(ride.id); setOtp(ride.otp || '------');
        const statusStepMap = { requested: 0, booked: 1, started: 2, in_progress: 3 };
        setRideStep(statusStepMap[ride.status] || 0);
        if (prevStatus !== ride.status) {
          if (ride.status === 'booked' && prevStatus === 'requested') {
            notify('🚗 Driver Assigned!', `${ride.driverName || 'A driver'} accepted your ride.`);
            if (ride.driverId) getDriverUpi(ride.driverId).then(setDriverUpiId).catch(console.error);
          }
          if (ride.status === 'booked' && ride.otp) notify('🔑 OTP Generated', `Your ride OTP is ${ride.otp}.`);
          if (ride.status === 'started') notify('🏁 Ride Started!', 'Enjoy the trip!');
          prevStatusRef.current = ride.status;
        }
        if (ride.pickupCoords) setPickupCoords(ride.pickupCoords);
        if (ride.destCoords) setDropCoords(ride.destCoords);
      } else {
        if (prevStatusRef.current && prevStatusRef.current !== 'cancelled') {
          if (lastRideDataRef.current) setCompletedRideData(lastRideDataRef.current);
          notify('✅ Ride Completed!', 'Proceed to payment.');
          setShowPayment(true);
        }
        prevStatusRef.current = null; lastRideDataRef.current = null;
        setRideActive(false); setActiveRideData(null); setRideId(null); setOtp('------'); setRideStep(0);
        setSelectedRide(null); setDriversVisible(false); setAvailableRides([]);
      }
    });
    return () => unsub();
  }, [user.uid]);

  useEffect(() => {
    if (!user.uid) return;
    fetchRideHistory(user.uid, 'passenger').then(setRideHistory).catch(console.error);
  }, [user.uid, rideActive]);

  /* ── Handlers ── */
  const handleRequestRide = async () => {
    if (!pickup || !drop) return alert("Please enter both pickup and destination.");
    setRequestingRide(true);
    try { const id = await postRideRequest({ passengerId: user.uid, passengerName: user.name, pickup, destination: drop, pickupCoords, destCoords: dropCoords }); setRideId(id); setRideActive(true); }
    catch { alert('Failed to send ride request.'); }
    finally { setRequestingRide(false); }
  };

  const handleFindRides = async () => {
    if (!pickup || !drop) return alert("Please enter both.");
    try { setAvailableRides(await fetchAvailableRides()); setDriversVisible(true); }
    catch (err) { alert("Error: " + err.message); }
  };

  const handleBookRide = async () => {
    if (!selectedRide) return;
    setOtpLoading(true); setOtpError('');
    try { const g = await bookRide(selectedRide.id, user.uid, user.name); setOtp(g); setRideId(selectedRide.id); setRideActive(true); }
    catch { setOtpError('Failed to book ride.'); }
    finally { setOtpLoading(false); }
  };

  const handleCancelRide = async () => { if (!rideId) return; try { await cancelRideByPassenger(rideId); } catch { alert('Failed to cancel.'); } };
  const handleCall = () => window.location.href = 'tel:0000000000';
  const handleQR = () => setShowPayment(true);
  const handlePaymentConfirmed = async () => { if (rideId) await confirmPayment(rideId).catch(console.error); setShowPayment(false); setCompletedRideData(activeRideData); setTimeout(() => setShowRating(true), 500); };
  const handleRatingClose = () => { setShowRating(false); setCompletedRideData(null); setActiveTab('book'); };
  const handleLogout = async () => { try { await signOut(auth); localStorage.clear(); navigate('/'); } catch {} };

  /* ── Full Screen Overlays ── */
  const renderOverlay = () => {
    if (activeTab === 'book') return null;
    return (
      <div className="pd-overlay">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('book')} className="glass-circle"><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{activeTab === 'history' ? 'Ride History' : 'Your Profile'}</h2>
        </div>

        {activeTab === 'history' && (
          rideHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}><History size={24} color="#818cf8" /></div>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No rides yet. Your completed rides will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rideHistory.map(ride => (
                <div key={ride.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar name={ride.driverName} size={36} fontSize="0.75rem" />
                      <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{ride.driverName || 'Driver'}</span>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#a5b4fc' }}>₹{ride.fare || 0}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
                    <span style={{ color: '#6366f1' }}>●</span> {ride.pickup} <ArrowRight size={12} /> {ride.destination}
                  </div>
                  <span style={{ fontSize: '0.68rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', background: ride.status === 'completed' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: ride.status === 'completed' ? '#4ade80' : '#f87171' }}>{ride.status}</span>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'profile' && (
          <div>
            <div style={{ textAlign: 'center', padding: '2rem 0', background: 'linear-gradient(180deg, rgba(99,102,241,0.06), transparent)', borderRadius: '24px', marginBottom: '1.5rem', border: '1px solid rgba(99,102,241,0.1)' }}>
              <Avatar name={user.name} size={80} fontSize="1.8rem" />
              <h3 style={{ color: '#f1f5f9', marginTop: '1rem', fontSize: '1.3rem', fontWeight: 800 }}>{user.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>{user.email}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <Shield size={12} color="#a5b4fc" />
                <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>Verified Student</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
              {[{ label: 'Total Rides', value: user.totalRides, icon: Car }, { label: 'Member Since', value: user.memberSince, icon: Calendar }].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><s.icon size={16} color="#a5b4fc" /></div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/role-select" style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', textDecoration: 'none', fontWeight: 700, textAlign: 'center', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.9rem' }}>Switch to Driver</Link>
              <button onClick={handleLogout} style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>Logout</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ── Bottom Sheet Content ── */
  const renderBottomSheet = () => {
    // Active ride
    if (rideActive) {
      const isWaiting = activeRideData?.status === 'requested';
      const driverCard = { name: activeRideData?.driverName || 'Driver', rating: 4.5, rides: 0, vehicle: 'Campus Vehicle', vehicleNo: '—', vehicleColor: '—', photo: null };
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Active Ride</h2>
            <span style={{ fontSize: '0.72rem', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, background: isWaiting ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.1)', color: isWaiting ? '#fbbf24' : '#a5b4fc', border: `1px solid ${isWaiting ? 'rgba(251,191,36,0.2)' : 'rgba(99,102,241,0.2)'}` }}>{isWaiting ? 'Searching…' : 'In Progress'}</span>
          </div>
          <RideStatus step={rideStep} />
          {isWaiting ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(251,191,36,0.04)', borderRadius: '20px', border: '1px solid rgba(251,191,36,0.12)', position: 'relative' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 1.5rem' }}>
                <div className="radar-ring" style={{ width: '60px', height: '60px', top: 0, left: 0 }} />
                <div className="radar-ring" style={{ width: '60px', height: '60px', top: 0, left: 0 }} />
                <div className="radar-ring" style={{ width: '60px', height: '60px', top: 0, left: 0 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={22} color="#fbbf24" />
                </div>
              </div>
              <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Finding your ride</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>A driver will accept your request shortly</div>
            </div>
          ) : (
            <><ActiveDriverCard driver={driverCard} onCall={handleCall} onQR={handleQR} /><OTPDisplay otp={otp} /></>
          )}
          {(activeRideData?.status === 'requested' || activeRideData?.status === 'booked') && (
            <button onClick={handleCancelRide} style={{ width: '100%', padding: '14px', marginTop: '14px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}>Cancel Ride</button>
          )}
        </>
      );
    }

    // Browsing drivers
    if (driversVisible) {
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button onClick={() => { setDriversVisible(false); setSelectedRide(null); }} className="glass-circle" style={{ width: '36px', height: '36px' }}><ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /></button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9' }}>Available Rides</h2>
            <span style={{ marginLeft: 'auto', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', padding: '4px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>{availableRides.length}</span>
          </div>
          {availableRides.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No rides available right now.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {availableRides.map(ride => (
                <div key={ride.id} className={`pd-ride-card ${selectedRide?.id === ride.id ? 'selected' : ''}`} onClick={() => setSelectedRide(ride)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Avatar name={ride.driverName} size={36} fontSize="0.8rem" /><span style={{ color: '#e2e8f0', fontWeight: 700 }}>{ride.driverName}</span></div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a5b4fc' }}>₹{ride.fare || 0}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <span style={{ color: '#6366f1' }}>●</span> {ride.pickup} <ArrowRight size={12} /> {ride.destination}
                  </div>
                  {selectedRide?.id === ride.id && <div style={{ position: 'absolute', top: '12px', right: '12px' }}><CheckCircle size={18} color="#818cf8" /></div>}
                </div>
              ))}
            </div>
          )}
          {selectedRide && <button className="pd-btn-gradient" onClick={handleBookRide}>{otpLoading ? 'Booking…' : `Book with ${selectedRide.driverName}`}</button>}
        </>
      );
    }

    // Default: Where to?
    return (
      <>
        <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
        
        {/* Greeting */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]} 👋</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Where to?</h2>
        </div>

        {/* Location inputs */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.5)' }} />
            </div>
            <PlaceAutocomplete placeholder="Pickup location" value={pickup} onChange={setPickup} onPlaceSelect={(p) => { setPickup(p.address); setPickupCoords({ lat: p.lat, lng: p.lng }); }} className="pd-location-input" style={{}} />
          </div>
          
          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '18px', marginBottom: '12px' }}>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.4)' }} />
            </div>
            <PlaceAutocomplete placeholder="Drop location" value={drop} onChange={setDrop} onPlaceSelect={(p) => { setDrop(p.address); setDropCoords({ lat: p.lat, lng: p.lng }); }} className="pd-location-input" style={{}} />
          </div>
        </div>

        {/* Action buttons */}
        <button className="pd-btn-gradient" style={{ marginBottom: '10px' }} onClick={handleRequestRide} disabled={requestingRide}>
          {requestingRide ? <><span style={{ animation: 'gradientShift 1s infinite' }}>⏳</span> Sending Request…</> : <><Sparkles size={18} /> Request a Ride</>}
        </button>
        
        <button className="pd-btn-outline" onClick={handleFindRides}>
          <Search size={16} /> Browse Available Drivers
        </button>
      </>
    );
  };

  return (
    <div className="pd-root">
      {/* Full-screen map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <RideMap height="100vh" pickupCoords={pickupCoords} dropCoords={dropCoords} showCar={rideStep >= 2} accentColor="blue" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.1) 35%, rgba(10,14,26,0.6) 75%, rgba(10,14,26,0.95) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Header */}
      <div className="pd-float-header">
        <div style={{ position: 'relative' }}>
          <button className="glass-circle" onClick={() => setShowMenu(!showMenu)}><Menu size={20} /></button>
          {showMenu && (
            <div className="pd-menu">
              {[
                { id: 'book', icon: Home, label: 'Book Ride' },
                { id: 'history', icon: History, label: 'Ride History' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(item => (
                <button key={item.id} className="pd-menu-item" onClick={() => { setActiveTab(item.id); setShowMenu(false); }}><item.icon size={16} /> {item.label}</button>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
              <button className="pd-menu-item" style={{ color: '#f87171' }} onClick={handleLogout}><LogOut size={16} /> Log Out</button>
            </div>
          )}
        </div>
        <button className="glass-circle" onClick={() => setActiveTab('profile')}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>{user.name?.charAt(0)}</div>
        </button>
      </div>

      {/* Bottom Sheet */}
      {activeTab === 'book' && <div className="pd-bottom-sheet">{renderBottomSheet()}</div>}

      {/* Overlays */}
      {renderOverlay()}

      {/* Modals */}
      {showPayment && <PaymentModal fare={activeRideData?.fare || completedRideData?.fare || 0} driverName={activeRideData?.driverName || completedRideData?.driverName || 'Driver'} driverUpi={driverUpiId} role="passenger" onPaid={handlePaymentConfirmed} onClose={() => setShowPayment(false)} />}
      {showRating && completedRideData && <RatingModal rideId={completedRideData.id || rideId} fromUid={user.uid} toUid={completedRideData.driverId} toName={completedRideData.driverName || 'Driver'} onClose={handleRatingClose} />}
    </div>
  );
};

export default PassengerDashboard;