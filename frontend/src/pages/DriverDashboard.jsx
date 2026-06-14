import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { verifyOTP } from '../services/djangoApi';
import {
  listenToDriverRides,
  listenToRideRequests,
  acceptRideRequest,
  declineRideRequest,
  verifyRideOTP,
  updateRideStatus,
  updateDriverLocation,
  postRide,
  fetchRideHistory,
  confirmPayment,
  setDriverUpi,
} from '../services/firestoreApi';
import RideMap from '../components/RideMap';
import PaymentModal from '../components/PaymentModal';
import { useNotification } from '../hooks/useNotification';
import {
  Car, User, MapPin, Star, Clock, Home, Navigation,
  LogOut, ChevronRight, Shield, CheckCircle, ArrowRight,
  Calendar, IndianRupee, TrendingUp, Power, X, Check,
  Wallet, AlertCircle, Route, Menu, ChevronDown, Sparkles, Zap
} from 'lucide-react';

/* ══════════════════════════════════════════
   STYLES INJECTION — Premium Driver UI
══════════════════════════════════════════ */
const injectStyles = () => {
  if (document.getElementById('dd-styles-v2')) return;
  const s = document.createElement('style');
  s.id = 'dd-styles-v2';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

    .dd-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .dd-root {
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
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes livePulse {
      0%  { transform: scale(1); opacity: 1; }
      75%,100% { transform: scale(2.5); opacity: 0; }
    }
    @keyframes searchRadar {
      0% { transform: scale(0.5); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }
    @keyframes otpGlow {
      0%,100% { box-shadow: 0 0 15px rgba(16,185,129,0.3), 0 0 0 0 rgba(16,185,129,0.2); }
      50%     { box-shadow: 0 0 25px rgba(16,185,129,0.5), 0 0 0 6px rgba(16,185,129,0); }
    }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    /* Bottom Sheet — Premium Glass */
    .dd-bottom-sheet {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(180deg, rgba(15,18,35,0.92) 0%, rgba(10,14,26,0.97) 100%);
      backdrop-filter: blur(40px) saturate(1.8);
      -webkit-backdrop-filter: blur(40px) saturate(1.8);
      border-top: 1px solid rgba(16,185,129,0.2);
      border-top-left-radius: 28px;
      border-top-right-radius: 28px;
      padding: 0 1.5rem 2.5rem 1.5rem;
      z-index: 100;
      animation: sheetSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      box-shadow: 0 -20px 60px rgba(0,0,0,0.6), 0 -2px 20px rgba(16,185,129,0.08);
      max-height: 80vh;
      overflow-y: auto;
    }
    .dd-bottom-sheet::-webkit-scrollbar { display: none; }

    .sheet-handle-wrap { padding: 12px 0 16px 0; display: flex; justify-content: center; position: sticky; top: 0; z-index: 1; }
    .sheet-handle { width: 36px; height: 4px; border-radius: 99px; background: rgba(255,255,255,0.15); }

    /* Floating Header */
    .dd-float-header {
      position: absolute; top: 0; left: 0; right: 0;
      padding: 1.25rem 1.5rem; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      pointer-events: none;
      background: linear-gradient(180deg, rgba(10,14,26,0.8) 0%, transparent 100%);
    }
    .dd-float-header > * { pointer-events: auto; }

    .glass-circle {
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); color: #e2e8f0;
    }
    .glass-circle:hover { background: rgba(255,255,255,0.14); transform: scale(1.05); }
    .glass-circle:active { transform: scale(0.95); }

    /* Online toggle */
    .dd-online-toggle {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px 8px 12px; border-radius: 999px;
      backdrop-filter: blur(12px); cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .dd-online-toggle.online {
      background: rgba(16,185,129,0.12);
      border-color: rgba(16,185,129,0.3);
      box-shadow: 0 4px 20px rgba(16,185,129,0.15);
    }
    .dd-online-toggle.offline {
      background: rgba(255,255,255,0.06);
    }

    /* Full page overlay */
    .dd-overlay {
      position: absolute; inset: 0; z-index: 200;
      background: linear-gradient(180deg, #0a0e1a 0%, #0f1225 100%);
      overflow-y: auto; animation: fadeInUp 0.4s ease forwards;
      padding: 2rem 1.5rem;
    }

    /* Menu */
    .dd-menu {
      position: absolute; top: 56px; left: 0; min-width: 220px;
      background: rgba(15,18,35,0.95); backdrop-filter: blur(30px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      padding: 8px; z-index: 110;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: fadeInUp 0.2s ease;
    }
    .dd-menu-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; border-radius: 10px;
      color: #94a3b8; font-size: 0.9rem; font-weight: 500;
      cursor: pointer; transition: all 0.15s; border: none; background: none;
      width: 100%; font-family: 'Inter', sans-serif;
    }
    .dd-menu-item:hover { background: rgba(16,185,129,0.08); color: #86efac; }

    /* Buttons */
    .dd-btn-accept {
      flex: 1; padding: 10px; border-radius: 12px; font-weight: 700; cursor: pointer;
      font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.25s; font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; border: none;
      box-shadow: 0 4px 16px rgba(16,185,129,0.3);
    }
    .dd-btn-accept:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }

    .dd-btn-decline {
      flex: 1; padding: 10px; border-radius: 12px; font-weight: 600; cursor: pointer;
      font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 6px;
      transition: all 0.2s; font-family: 'Inter', sans-serif;
      background: rgba(239,68,68,0.06); color: #f87171;
      border: 1px solid rgba(239,68,68,0.15);
    }
    .dd-btn-decline:hover { background: rgba(239,68,68,0.12); }

    /* OTP Input */
    .dd-otp-digit {
      width: 56px; height: 68px; text-align: center;
      background: rgba(16,185,129,0.05); border: 1.5px solid rgba(16,185,129,0.2);
      border-radius: 14px; color: #86efac; font-size: 1.8rem; font-weight: 800;
      font-family: 'JetBrains Mono', 'SF Mono', monospace; outline: none;
      transition: all 0.25s; caret-color: #10b981;
    }
    .dd-otp-digit:focus { border-color: rgba(16,185,129,0.6); background: rgba(16,185,129,0.08); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
    .dd-otp-digit.filled { border-color: rgba(16,185,129,0.4); animation: otpGlow 3s ease infinite; }

    /* Form inputs */
    .dd-form-input {
      width: 100%; padding: 14px 16px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 14px; color: #e2e8f0; font-size: 0.95rem; font-weight: 500;
      outline: none; transition: all 0.25s; font-family: 'Inter', sans-serif;
    }
    .dd-form-input:focus {
      border-color: rgba(16,185,129,0.5);
      background: rgba(16,185,129,0.05);
      box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
    }
    .dd-form-input::placeholder { color: #475569; font-weight: 400; }

    /* Ride request card */
    .dd-request-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 18px; padding: 1.25rem; position: relative; overflow: hidden;
      transition: all 0.3s; animation: slideIn 0.4s ease forwards;
    }
    .dd-request-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent);
    }

    /* Radar animation */
    .radar-ring {
      position: absolute; border-radius: 50%;
      border: 2px solid rgba(16,185,129,0.3);
      animation: searchRadar 2s ease-out infinite;
    }
    .radar-ring:nth-child(2) { animation-delay: 0.66s; }
    .radar-ring:nth-child(3) { animation-delay: 1.33s; }

    .live-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    .live-dot::after {
      content: ''; position: absolute; inset: -2px; border-radius: 50%;
      background: #22c55e; animation: livePulse 1.8s cubic-bezier(0,0,0.2,1) infinite;
    }
  `;
  document.head.appendChild(s);
};

/* ══════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════ */
const MOCK_EARNINGS = [
  { id: 1, passenger: 'Arjun Singh', from: 'Library', to: 'Hostel A', date: 'Today, 2:30 PM', fare: 45 },
  { id: 2, passenger: 'Meera Joshi', from: 'Admin Block', to: 'Canteen', date: 'Today, 11:15 AM', fare: 30 },
  { id: 3, passenger: 'Dev Khanna', from: 'Main Gate', to: 'Sports Ground', date: 'Yesterday', fare: 55 },
];

/* ══════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════ */
const Avatar = ({ name, photo, size = 40, fontSize = '0.9rem' }) => (
  <div style={{
    width: size, height: size, borderRadius: '14px', flexShrink: 0,
    background: photo ? 'transparent' : 'linear-gradient(135deg, #10b981, #059669)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize, fontWeight: 700, color: 'white', overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
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

const RideStatus = ({ step }) => {
  const steps = ['OTP Verified', 'Ride Started', 'On Route', 'Completed'];
  return (
    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ride Status</span>
        <span style={{ fontSize: '0.75rem', color: '#86efac', fontWeight: 700, padding: '3px 10px', background: 'rgba(16,185,129,0.1)', borderRadius: '8px' }}>{steps[step]}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: i <= step ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
                border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i <= step ? '0 4px 12px rgba(16,185,129,0.4)' : 'none',
                transition: 'all 0.3s',
              }}>
                {i <= step ? <CheckCircle size={13} color="white" /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />}
              </div>
              <span style={{ fontSize: '0.58rem', color: i <= step ? '#86efac' : '#475569', textAlign: 'center', fontWeight: i <= step ? 600 : 400, maxWidth: '48px' }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'linear-gradient(90deg, #10b981, #34d399)' : 'rgba(255,255,255,0.05)', marginBottom: '20px', borderRadius: '2px' }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const OTPEntry = ({ value, onChange, onVerify, verified, verifying = false }) => {
  const inputs = useRef([]);
  const handleKey = (e, i) => { if (e.key === 'Backspace' && !e.target.value && i > 0) inputs.current[i - 1]?.focus(); };
  const handleInput = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newOtp = value.padEnd(4, ' ').split('');
    newOtp[i] = val || ' ';
    onChange(newOtp.join(''));
    if (val && i < 3) inputs.current[i + 1]?.focus();
  };
  const isFull = value.replace(/\s/g, '').length === 4;

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.04))', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '1rem' }}>
        <Shield size={14} color="#86efac" />
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {verified ? '✅ OTP Verified' : verifying ? '⏳ Verifying...' : 'Enter Passenger OTP'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '1rem' }}>
        {[0, 1, 2, 3].map(i => (
          <input key={i} ref={el => inputs.current[i] = el} className={`dd-otp-digit ${value[i] && value[i] !== ' ' ? 'filled' : ''}`}
            type="text" inputMode="numeric" maxLength={1} value={value[i]?.trim() || ''} onChange={e => handleInput(e, i)} onKeyDown={e => handleKey(e, i)} disabled={verified || verifying} />
        ))}
      </div>
      {!verified && (
        <button onClick={onVerify} disabled={!isFull || verifying} style={{
          width: '100%', padding: '12px', borderRadius: '14px',
          background: isFull && !verifying ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
          color: isFull && !verifying ? 'white' : '#475569', border: 'none',
          cursor: isFull && !verifying ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.9rem',
          transition: 'all 0.2s', boxShadow: isFull && !verifying ? '0 6px 20px rgba(16,185,129,0.35)' : 'none',
          fontFamily: 'Inter, sans-serif',
        }}>
          {verifying ? 'Verifying...' : isFull ? 'Verify & Start Ride' : 'Enter all 4 digits'}
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const DriverDashboard = () => {
  injectStyles();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const [activeTab, setActiveTab] = useState('home');
  const [online, setOnline] = useState(false);
  const [requests, setRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [rideStep, setRideStep] = useState(0);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpErrMsg, setOtpErrMsg] = useState('');
  const [rideHistory, setRideHistory] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [postPickup, setPostPickup] = useState('PCCOE Gate #1');
  const [postDestination, setPostDestination] = useState('Akurdi Station');
  const [postFare, setPostFare] = useState('20');
  const [postSeats, setPostSeats] = useState('3');
  const [postingRide, setPostingRide] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [upiId, setUpiId] = useState(localStorage.getItem('driverUpiId') || '');
  const prevRequestCountRef = useRef(0);

  const driver = {
    name: localStorage.getItem('userName') || 'Driver',
    email: localStorage.getItem('userEmail') || '',
    uid: localStorage.getItem('userUID') || '',
    vehicle: 'Honda City', vehicleNo: 'MH 12 AB 1234', vehicleColor: 'White',
    rating: 4.9, totalRides: 234, memberSince: 'Sep 2024',
  };

  /* ── Firestore listeners ── */
  useEffect(() => {
    if (!driver.uid) return;
    const unsub = listenToDriverRides(driver.uid, (rides) => {
      const active = rides.find(r => r.status === 'started' || r.status === 'in_progress');
      if (active && !activeRide) {
        setActiveRide({ id: active.id, rideId: active.id, passengerName: active.passengerName || 'Passenger', rating: 4.5, from: active.pickup, to: active.destination, fare: active.fare || 0, pickupCoords: active.pickupCoords, dropCoords: active.destCoords });
        setOtpVerified(true); setRideStep(1);
      }
    });
    return () => unsub();
  }, [driver.uid]);

  useEffect(() => {
    if (!online) { setRequests([]); return; }
    const unsub = listenToRideRequests((rides) => {
      const mapped = rides.map(r => ({ id: r.id, rideId: r.id, passengerName: r.passengerName || 'Passenger', rating: 4.5, totalRides: 0, from: r.pickup, to: r.destination, distance: '', fare: r.fare || 0, requestedAt: 'Just now', photo: null, pickupCoords: r.pickupCoords, dropCoords: r.destCoords }));
      if (mapped.length > prevRequestCountRef.current) notify('🙋 New Ride Request!', `${mapped[0]?.passengerName || 'A passenger'} is looking for a ride.`);
      prevRequestCountRef.current = mapped.length;
      setRequests(mapped);
    });
    return () => unsub();
  }, [online]);

  useEffect(() => {
    if (!driver.uid) return;
    fetchRideHistory(driver.uid, 'driver').then(setRideHistory).catch(console.error);
  }, [driver.uid, rideCompleted]);

  const todayEarnings = rideHistory.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.fare || 0), 0);

  /* ── Handlers ── */
  const handlePostRide = async () => {
    if (!postPickup || !postDestination) return alert("Please enter pickup and destination");
    setPostingRide(true);
    try { await postRide({ driverId: driver.uid, driverName: driver.name, pickup: postPickup, destination: postDestination, time: 'Now', seats: parseInt(postSeats), fare: parseInt(postFare) }); setOnline(true); }
    catch (err) { alert("Error posting ride: " + err.message); }
    finally { setPostingRide(false); }
  };

  const handleAccept = async (request) => {
    try { await acceptRideRequest(request.rideId || request.id, driver.uid, driver.name); setActiveRide(request); setRideStep(0); setOtpValue(''); setOtpVerified(false); setRideCompleted(false); setRequests(prev => prev.filter(r => r.id !== request.id)); }
    catch { alert('Failed to accept ride request.'); }
  };

  const handleDecline = async (id) => {
    try { await declineRideRequest(id); } catch {} setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleVerifyOTP = async () => {
    setOtpErrMsg(''); setOtpVerifying(true);
    const rideId = activeRide?.rideId || activeRide?.id;
    const result = await verifyRideOTP(rideId, otpValue);
    setOtpVerifying(false);
    if (result.success) { setOtpVerified(true); setRideStep(1); startLocationTracking(rideId); let step = 1; const interval = setInterval(() => { step++; setRideStep(step); if (step >= 2) clearInterval(interval); }, 4000); }
    else setOtpErrMsg(result.error || 'Incorrect OTP.');
  };

  const watchIdRef = useRef(null);
  const startLocationTracking = useCallback((rideId) => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => updateDriverLocation(rideId, pos.coords.latitude, pos.coords.longitude).catch(console.error),
      (err) => console.warn('GPS error:', err), { enableHighAccuracy: true, maximumAge: 3000 }
    );
  }, []);

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
  }, []);

  const handleCompleteRide = async () => {
    const rideId = activeRide?.rideId || activeRide?.id;
    if (rideId) await updateRideStatus(rideId, 'completed').catch(console.error);
    stopLocationTracking(); setRideCompleted(true); setRideStep(3);
    notify('✅ Ride Completed!', `Ride with ${activeRide?.passengerName || 'passenger'} is done.`);
    setCompletedRideData({ ...activeRide });
    setTimeout(() => setShowPayment(true), 2000);
  };

  const handlePaymentConfirmed = async () => {
    const rideId = completedRideData?.rideId || completedRideData?.id;
    if (rideId) await confirmPayment(rideId).catch(console.error);
    setShowPayment(false); setActiveRide(null); setActiveTab('earnings'); setOnline(true); setCompletedRideData(null);
  };

  const handleLogout = async () => { try { await signOut(auth); localStorage.clear(); navigate('/'); } catch {} };

  /* ── Full Screen Overlays ── */
  const renderOverlay = () => {
    if (activeTab === 'home') return null;
    return (
      <div className="dd-overlay">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '2rem' }}>
          <button onClick={() => setActiveTab('home')} className="glass-circle"><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{activeTab === 'earnings' ? 'Earnings' : 'Your Profile'}</h2>
        </div>

        {activeTab === 'earnings' && (
          <div>
            {/* Earnings summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '2rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.06))', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16,185,129,0.08)' }} />
                <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Today</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9' }}>₹{todayEarnings}</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)' }} />
                <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Rides</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f1f5f9' }}>{rideHistory.length}</div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.8rem' }}>Recent Trips</h3>
            {MOCK_EARNINGS.map((ride, i) => (
              <div key={ride.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.06)', animation: `slideIn ${0.3 + i * 0.1}s ease forwards` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Avatar name={ride.passenger} size={38} fontSize="0.78rem" />
                  <div>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>{ride.passenger}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{ride.from} → {ride.to}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#86efac', fontSize: '1rem' }}>+₹{ride.fare}</div>
                  <div style={{ fontSize: '0.68rem', color: '#475569' }}>{ride.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div style={{ textAlign: 'center', padding: '2rem 0', background: 'linear-gradient(180deg, rgba(16,185,129,0.06), transparent)', borderRadius: '24px', marginBottom: '1.5rem', border: '1px solid rgba(16,185,129,0.1)' }}>
              <Avatar name={driver.name} size={80} fontSize="1.8rem" />
              <h3 style={{ color: '#f1f5f9', marginTop: '1rem', fontSize: '1.3rem', fontWeight: 800 }}>{driver.name}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>{driver.email}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '6px 14px', background: 'rgba(16,185,129,0.1)', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>{driver.rating}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Vehicle</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Car size={20} color="#86efac" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{driver.vehicle} · {driver.vehicleColor}</div>
                  <div style={{ color: '#86efac', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>{driver.vehicleNo}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
              {[{ label: 'Total Rides', value: driver.totalRides, icon: Car }, { label: 'Since', value: driver.memberSince, icon: Calendar }].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><s.icon size={16} color="#86efac" /></div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/role-select" style={{ flex: 1, padding: '14px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', color: '#a5b4fc', textDecoration: 'none', fontWeight: 700, textAlign: 'center', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.9rem' }}>Switch to Passenger</Link>
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
    if (activeRide) {
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Active Ride</h2>
            <span style={{ fontSize: '0.72rem', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, background: rideCompleted ? 'rgba(16,185,129,0.15)' : 'rgba(251,191,36,0.1)', color: rideCompleted ? '#86efac' : '#fbbf24' }}>{rideCompleted ? 'Completed' : otpVerified ? 'In Progress' : 'Awaiting OTP'}</span>
          </div>
          <RideStatus step={rideStep} />

          {/* Passenger card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '16px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Avatar name={activeRide.passengerName} size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '3px' }}>{activeRide.passengerName}</div>
              <Stars rating={activeRide.rating} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#86efac' }}>₹{activeRide.fare}</div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Fare</div>
            </div>
          </div>

          {/* Route */}
          <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '14px', padding: '12px 16px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              {activeRide.from}
            </div>
            <div style={{ borderLeft: '1px dashed rgba(255,255,255,0.1)', marginLeft: '3.5px', height: '12px', marginBottom: '2px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: '#ef4444' }} />
              {activeRide.to}
            </div>
          </div>

          <OTPEntry value={otpValue} onChange={(v) => { setOtpValue(v); setOtpErrMsg(''); }} onVerify={handleVerifyOTP} verified={otpVerified} verifying={otpVerifying} />
          {otpErrMsg && <div style={{ marginTop: '10px', color: '#f87171', fontSize: '0.85rem', textAlign: 'center', padding: '8px', background: 'rgba(239,68,68,0.06)', borderRadius: '10px' }}>{otpErrMsg}</div>}
          {otpVerified && !rideCompleted && (
            <button style={{ width: '100%', padding: '14px', marginTop: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(16,185,129,0.35)', fontFamily: 'Inter, sans-serif' }} onClick={handleCompleteRide}>
              <Check size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Mark Ride Complete
            </button>
          )}
        </>
      );
    }

    // Offline — offer ride
    if (!online) {
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '4px' }}>Hello, {driver.name.split(' ')[0]} 👋</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em' }}>Offer a Ride</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <input className="dd-form-input" placeholder="Leaving from" value={postPickup} onChange={e => setPostPickup(e.target.value)} />
            <input className="dd-form-input" placeholder="Going to" value={postDestination} onChange={e => setPostDestination(e.target.value)} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.85rem' }}>₹</span>
                <input className="dd-form-input" style={{ paddingLeft: '30px' }} type="number" placeholder="Fare" value={postFare} onChange={e => setPostFare(e.target.value)} />
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.85rem' }}>👤</span>
                <input className="dd-form-input" style={{ paddingLeft: '34px' }} type="number" placeholder="Seats" value={postSeats} onChange={e => setPostSeats(e.target.value)} />
              </div>
            </div>
          </div>
          <button onClick={handlePostRide} disabled={postingRide} style={{
            width: '100%', padding: '14px', border: 'none', borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
            backgroundSize: '200% 200%', animation: 'gradientShift 4s ease infinite',
            color: 'white', fontWeight: 700, fontSize: '1rem', cursor: postingRide ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 32px rgba(16,185,129,0.35)', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Inter, sans-serif',
          }}>
            {postingRide ? 'Posting...' : <><Zap size={18} /> Go Online & Offer Ride</>}
          </button>
        </>
      );
    }

    // Online — waiting for requests
    if (online && requests.length === 0) {
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 1.5rem' }}>
              <div className="radar-ring" style={{ width: '70px', height: '70px', top: 0, left: 0 }} />
              <div className="radar-ring" style={{ width: '70px', height: '70px', top: 0, left: 0 }} />
              <div className="radar-ring" style={{ width: '70px', height: '70px', top: 0, left: 0 }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Car size={22} color="#86efac" />
                </div>
              </div>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Looking for Riders</h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>You're online. We'll notify you<br/>when someone requests a ride.</p>
          </div>
        </>
      );
    }

    // Online — ride requests
    if (online && requests.length > 0) {
      return (
        <>
          <div className="sheet-handle-wrap"><div className="sheet-handle" /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9' }}>Ride Requests</h2>
            <span style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', padding: '4px 12px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 800 }}>{requests.length} New</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.map((req, i) => (
              <div key={req.id} className="dd-request-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Avatar name={req.passengerName} size={44} />
                    <div>
                      <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>{req.passengerName}</div>
                      <Stars rating={req.rating} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#86efac' }}>₹{req.fare}</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.15)', padding: '10px 14px', borderRadius: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> {req.from}
                  </div>
                  <div style={{ borderLeft: '1px dashed rgba(255,255,255,0.1)', marginLeft: '3.5px', height: '8px', marginBottom: '2px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#94a3b8' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: '#ef4444' }} /> {req.to}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="dd-btn-decline" onClick={() => handleDecline(req.id)}><X size={14} /> Decline</button>
                  <button className="dd-btn-accept" onClick={() => handleAccept(req)}><Check size={14} /> Accept</button>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="dd-root">
      {/* Full-screen map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <RideMap height="100vh" pickupCoords={activeRide?.pickupCoords} dropCoords={activeRide?.dropCoords} showCar={otpVerified} accentColor="green" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.1) 35%, rgba(10,14,26,0.6) 75%, rgba(10,14,26,0.95) 100%)', pointerEvents: 'none' }} />
      </div>

      {/* Header */}
      <div className="dd-float-header">
        <div style={{ position: 'relative' }}>
          <button className="glass-circle" onClick={() => setShowMenu(!showMenu)}><Menu size={20} /></button>
          {showMenu && (
            <div className="dd-menu">
              {[
                { id: 'home', icon: Home, label: 'Dashboard' },
                { id: 'earnings', icon: Wallet, label: 'Earnings' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(item => (
                <button key={item.id} className="dd-menu-item" onClick={() => { setActiveTab(item.id); setShowMenu(false); }}><item.icon size={16} /> {item.label}</button>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
              <button className="dd-menu-item" style={{ color: '#f87171' }} onClick={handleLogout}><LogOut size={16} /> Log Out</button>
            </div>
          )}
        </div>

        {!activeRide && (
          <div className={`dd-online-toggle ${online ? 'online' : 'offline'}`} onClick={() => setOnline(!online)}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: online ? '#22c55e' : '#64748b', transition: 'background 0.3s' }} />
              {online && <div style={{ position: 'absolute', inset: '-2px', borderRadius: '50%', background: '#22c55e', animation: 'livePulse 2s infinite' }} />}
            </div>
            <span style={{ color: online ? '#86efac' : '#94a3b8', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em', transition: 'color 0.3s' }}>
              {online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      {activeTab === 'home' && <div className="dd-bottom-sheet">{renderBottomSheet()}</div>}

      {/* Overlays */}
      {renderOverlay()}

      {/* Payment Modal */}
      {showPayment && <PaymentModal fare={completedRideData?.fare || activeRide?.fare || 0} driverName={driver.name} driverUpi={upiId} role="driver" onPaid={handlePaymentConfirmed} onClose={() => setShowPayment(false)} />}
    </div>
  );
};

export default DriverDashboard;