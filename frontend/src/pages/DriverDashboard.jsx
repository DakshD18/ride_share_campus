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
  Wallet, AlertCircle, Route
} from 'lucide-react';

/* ══════════════════════════════════════════
   STYLES INJECTION
══════════════════════════════════════════ */
const injectStyles = () => {
  if (document.getElementById('dd-styles')) return;
  const s = document.createElement('style');
  s.id = 'dd-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    .dd-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .dd-root { font-family: 'DM Sans', sans-serif; }

    @keyframes ddFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ddSlideIn {
      from { opacity: 0; transform: translateX(30px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes onlinePulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
      50%     { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
    }
    @keyframes statusPing {
      0%        { transform: scale(1); opacity: 1; }
      75%, 100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes requestSlide {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes carMove {
      0%,100% { transform: translate(0,0); }
      25%     { transform: translate(8px,-4px); }
      50%     { transform: translate(16px,0px); }
      75%     { transform: translate(8px,4px); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes toggleSlide {
      from { transform: translateX(0); }
      to   { transform: translateX(28px); }
    }

    .dd-nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border-radius: 0.75rem;
      cursor: pointer; transition: all 0.2s; color: #64748b;
      font-size: 0.9rem; font-weight: 500; text-decoration: none;
      border: none; background: none; width: 100%; font-family: inherit;
    }
    .dd-nav-item:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
    .dd-nav-item.active { background: rgba(16,185,129,0.1); color: #34d399; }

    .dd-request-card {
      animation: requestSlide 0.4s cubic-bezier(0.16,1,0.3,1) both;
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .dd-request-card:hover {
      border-color: rgba(16,185,129,0.25) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
    }

    .dd-accept-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; border: none; border-radius: 0.65rem;
      padding: 0.65rem 1.25rem; font-weight: 700; cursor: pointer;
      font-size: 0.85rem; font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.3);
      flex: 1;
    }
    .dd-accept-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .dd-accept-btn:active { transform: translateY(0); }

    .dd-decline-btn {
      background: rgba(239,68,68,0.08);
      color: #f87171; border: 1px solid rgba(239,68,68,0.2);
      border-radius: 0.65rem; padding: 0.65rem 1.25rem;
      font-weight: 600; cursor: pointer; font-size: 0.85rem;
      font-family: inherit;
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      transition: all 0.2s; flex: 1;
    }
    .dd-decline-btn:hover {
      background: rgba(239,68,68,0.15) !important;
      border-color: rgba(239,68,68,0.35) !important;
      transform: translateY(-1px);
    }

    .dd-complete-btn {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white; border: none; border-radius: 0.75rem;
      padding: 0.9rem; font-weight: 700; cursor: pointer;
      font-size: 0.95rem; font-family: inherit; width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.2s; box-shadow: 0 4px 20px rgba(16,185,129,0.35);
      letter-spacing: 0.02em;
    }
    .dd-complete-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }

    .dd-otp-input {
      width: 52px; height: 60px; text-align: center;
      background: rgba(2,6,23,0.8); border: 1.5px solid rgba(255,255,255,0.08);
      border-radius: 0.75rem; color: #f8fafc; font-size: 1.8rem;
      font-weight: 800; font-family: monospace; outline: none;
      transition: all 0.2s; caret-color: #10b981;
    }
    .dd-otp-input:focus {
      border-color: rgba(16,185,129,0.6) !important;
      box-shadow: 0 0 0 3px rgba(16,185,129,0.15) !important;
      background: rgba(2,6,23,0.95) !important;
    }
    .dd-otp-input.filled {
      border-color: rgba(16,185,129,0.4);
      background: rgba(16,185,129,0.05);
      color: #34d399;
    }

    .dd-history-row { transition: background 0.2s; }
    .dd-history-row:hover { background: rgba(255,255,255,0.03) !important; }

    .online-toggle-thumb {
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }

    .status-ping::after {
      content: '';
      position: absolute; inset: 0; border-radius: 50%;
      background: inherit;
      animation: statusPing 1.5s cubic-bezier(0,0,0.2,1) infinite;
    }

    .earning-card:hover {
      transform: translateY(-3px);
      border-color: rgba(16,185,129,0.25) !important;
    }
    .earning-card { transition: all 0.25s; }

    @media (max-width: 768px) {
      .dd-sidebar { display: none !important; }
      .dd-mobile-nav { display: flex !important; }
      .dd-main { margin-left: 0 !important; padding-bottom: 80px !important; }
    }
  `;
  document.head.appendChild(s);
};

/* ══════════════════════════════════════════
   MOCK DATA (fallback when Firestore is empty)
══════════════════════════════════════════ */
const MOCK_REQUESTS = []; // Real data comes from Firestore listener

const MOCK_EARNINGS = [
  { id: 1, passenger: 'Arjun Singh', from: 'Library', to: 'Hostel A', date: 'Today, 2:30 PM', fare: 45 },
  { id: 2, passenger: 'Meera Joshi', from: 'Admin Block', to: 'Canteen', date: 'Today, 11:15 AM', fare: 30 },
  { id: 3, passenger: 'Dev Khanna', from: 'Main Gate', to: 'Sports Ground', date: 'Yesterday', fare: 55 },
  { id: 4, passenger: 'Priya Nair', from: 'Lab Complex', to: 'Hostel B', date: 'Yesterday', fare: 38 },
];

/* ══════════════════════════════════════════
   SMALL COMPONENTS
══════════════════════════════════════════ */

const Avatar = ({ name, photo, size = 40, fontSize = '1rem', color = 'blue' }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: photo ? 'transparent'
      : color === 'green'
        ? 'linear-gradient(135deg, #10b981, #059669)'
        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize, fontWeight: 700, color: 'white', overflow: 'hidden',
    border: `2px solid ${color === 'green' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
  }}>
    {photo
      ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    }
  </div>
);

const Stars = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
    <Star size={12} fill="#f59e0b" color="#f59e0b" />
    <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 700 }}>{rating}</span>
  </div>
);

/* ── MapPlaceholder replaced by real Google Map (RideMap component) ──── */

/* Ride status — green tinted */
const RideStatus = ({ step }) => {
  const steps = ['OTP Verified', 'Ride Started', 'On Route', 'Completed'];
  return (
    <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ride Status</span>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{steps[step]}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i <= step ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
                border: i <= step ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i <= step ? '0 0 8px rgba(16,185,129,0.4)' : 'none',
              }}>
                {i <= step
                  ? <CheckCircle size={12} color="white" />
                  : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                }
              </div>
              <span style={{ fontSize: '0.58rem', color: i <= step ? '#34d399' : '#334155', textAlign: 'center', maxWidth: '48px', lineHeight: 1.3 }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < step ? 'linear-gradient(90deg,#10b981,#34d399)' : 'rgba(255,255,255,0.05)', marginBottom: '1.2rem' }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/* Online / Offline toggle */
const OnlineToggle = ({ online, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.25rem 1.5rem', borderRadius: '1.25rem', cursor: 'pointer',
      background: online ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1.5px solid ${online ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: online ? '0 0 30px rgba(16,185,129,0.1)' : 'none',
      animation: online ? 'onlinePulse 2.5s infinite' : 'none',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {/* Power icon */}
      <div style={{
        width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
        background: online ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
        border: online ? 'none' : '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: online ? '0 6px 16px rgba(16,185,129,0.4)' : 'none',
        transition: 'all 0.3s',
      }}>
        <Power size={22} color={online ? 'white' : '#475569'} />
      </div>
      <div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: online ? '#34d399' : '#94a3b8', fontFamily: "'Space Grotesk',sans-serif", transition: 'color 0.3s' }}>
          {online ? 'You are Online' : 'You are Offline'}
        </div>
        <div style={{ fontSize: '0.8rem', color: online ? '#10b981' : '#475569', transition: 'color 0.3s' }}>
          {online ? 'Accepting ride requests' : 'Tap to go online'}
        </div>
      </div>
    </div>
    {/* Toggle switch */}
    <div style={{
      width: '52px', height: '28px', borderRadius: '999px',
      background: online ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.1)',
      position: 'relative', transition: 'background 0.3s', flexShrink: 0,
      boxShadow: online ? '0 0 10px rgba(16,185,129,0.4)' : 'none',
    }}>
      <div className="online-toggle-thumb" style={{
        position: 'absolute', top: '3px', left: '3px',
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transform: online ? 'translateX(24px)' : 'translateX(0)',
      }} />
    </div>
  </div>
);

/* OTP Entry */
const OTPEntry = ({ value, onChange, onVerify, verified, verifying = false }) => {
  const inputs = useRef([]);

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !e.target.value && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleInput = (e, i) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newOtp = value.padEnd(4, ' ').split('');
    newOtp[i] = val || ' ';
    onChange(newOtp.join(''));
    if (val && i < 3) inputs.current[i + 1]?.focus();
  };

  const isFull = value.replace(/\s/g, '').length === 4;

  return (
    <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '1rem', padding: '1.25rem' }}>
      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', textAlign: 'center' }}>
        {verified ? '✅ OTP Verified — Ride Started!' : verifying ? '⏳ Verifying with server...' : 'Enter Passenger OTP to Start Ride'}
      </div>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '0.85rem' }}>
        {[0, 1, 2, 3].map(i => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            className={`dd-otp-input ${value[i] ? 'filled' : ''}`}
            type="text" inputMode="numeric"
            maxLength={1} value={value[i]?.trim() || ''}
            onChange={e => handleInput(e, i)}
            onKeyDown={e => handleKey(e, i)}
            disabled={verified || verifying}
          />
        ))}
      </div>
      {!verified && (
        <button
          onClick={onVerify}
          disabled={!isFull || verifying}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '0.75rem',
            background: isFull && !verifying
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'rgba(255,255,255,0.05)',
            color: isFull && !verifying ? 'white' : '#334155',
            border: 'none', cursor: isFull && !verifying ? 'pointer' : 'not-allowed',
            fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit',
            transition: 'all 0.2s', opacity: verifying ? 0.7 : 1,
            boxShadow: isFull && !verifying ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
          }}
        >
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
  const [otpVerifying, setOtpVerifying] = useState(false); // loading during API call
  const [otpErrMsg, setOtpErrMsg] = useState('');          // inline error instead of alert
  const [rideHistory, setRideHistory] = useState([]);

  // Ride posting state
  const [postPickup, setPostPickup] = useState('PCCOE Gate #1');
  const [postDestination, setPostDestination] = useState('Akurdi Station');
  const [postFare, setPostFare] = useState('20');
  const [postSeats, setPostSeats] = useState('3');
  const [postTime, setPostTime] = useState('Now');
  const [postingRide, setPostingRide] = useState(false);

  // Payment modal state
  const [showPayment, setShowPayment] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [upiId, setUpiId] = useState(localStorage.getItem('driverUpiId') || '');
  const prevRequestCountRef = useRef(0);

  // Pull real driver info from localStorage (set during Firebase login)
  const driver = {
    name:         localStorage.getItem('userName')  || 'Driver',
    email:        localStorage.getItem('userEmail') || '',
    uid:          localStorage.getItem('userUID')   || '',
    vehicle:      'Honda City',
    vehicleNo:    'MH 12 AB 1234',
    vehicleColor: 'White',
    rating:       4.9,
    totalRides:   234,
    memberSince:  'Sep 2024',
  };

  // ── Listen to Firestore for booked rides assigned to this driver ──
  useEffect(() => {
    if (!driver.uid) return;
    const unsub = listenToDriverRides(driver.uid, (rides) => {
      // Find active ride (started / in_progress)
      const active = rides.find(r => r.status === 'started' || r.status === 'in_progress');
      if (active && !activeRide) {
        setActiveRide({
          id: active.id,
          rideId: active.id,
          passengerName: active.passengerName || 'Passenger',
          rating: 4.5,
          from: active.pickup,
          to: active.destination,
          fare: active.fare || 0,
          pickupCoords: active.pickupCoords,
          dropCoords: active.destCoords,
        });
        setOtpVerified(true);
        setRideStep(1);
      }
    });
    return () => unsub();
  }, [driver.uid]);

  // ── Listen for incoming passenger ride requests ──
  useEffect(() => {
    if (!online) {
      setRequests([]);
      return;
    }
    const unsub = listenToRideRequests((rides) => {
      const mapped = rides.map(r => ({
        id: r.id,
        rideId: r.id,
        passengerName: r.passengerName || 'Passenger',
        rating: 4.5,
        totalRides: 0,
        from: r.pickup,
        to: r.destination,
        distance: '',
        fare: r.fare || 0,
        requestedAt: 'Just now',
        photo: null,
        pickupCoords: r.pickupCoords,
        dropCoords: r.destCoords,
      }));
      // Notify on new requests
      if (mapped.length > prevRequestCountRef.current) {
        const newest = mapped[0];
        notify('🙋 New Ride Request!', `${newest?.passengerName || 'A passenger'} is looking for a ride.`);
      }
      prevRequestCountRef.current = mapped.length;
      setRequests(mapped);
    });
    return () => unsub();
  }, [online]);

  // ── Fetch ride history ──
  useEffect(() => {
    if (!driver.uid) return;
    fetchRideHistory(driver.uid, 'driver').then(setRideHistory).catch(console.error);
  }, [driver.uid, rideCompleted]);

  // Earnings from history
  const todayEarnings = rideHistory
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.fare || 0), 0);
  const weekEarnings = todayEarnings; // simplified for now

  const handlePostRide = async () => {
    if (!postPickup || !postDestination) {
      alert("Please enter pickup and destination");
      return;
    }
    setPostingRide(true);
    try {
      await postRide({
        driverId: driver.uid,
        driverName: driver.name,
        pickup: postPickup,
        destination: postDestination,
        time: postTime,
        seats: parseInt(postSeats),
        fare: parseInt(postFare)
      });
      setOnline(true);
    } catch (err) {
      console.error(err);
      alert("Error posting ride: " + err.message);
    } finally {
      setPostingRide(false);
    }
  };

  const handleAccept = async (request) => {
    try {
      await acceptRideRequest(request.rideId || request.id, driver.uid, driver.name);
      setActiveRide(request);
      setActiveTab('active');
      setRideStep(0);
      setOtpValue('');
      setOtpVerified(false);
      setRideCompleted(false);
      setRequests(prev => prev.filter(r => r.id !== request.id));
    } catch (err) {
      console.error('Error accepting ride request:', err);
      alert('Failed to accept ride request. Please try again.');
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineRideRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error declining ride request:', err);
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleVerifyOTP = async () => {
    setOtpErrMsg('');
    setOtpVerifying(true);

    const rideId = activeRide?.rideId || activeRide?.id;

    // Verify OTP against Firestore
    const result = await verifyRideOTP(rideId, otpValue);

    setOtpVerifying(false);

    if (result.success) {
      setOtpVerified(true);
      setRideStep(1);
      // Start GPS tracking
      startLocationTracking(rideId);
      // Auto-advance ride status
      let step = 1;
      const interval = setInterval(() => {
        step++;
        setRideStep(step);
        if (step >= 2) clearInterval(interval);
      }, 4000);
    } else {
      setOtpErrMsg(result.error || 'Incorrect OTP. Ask the passenger to check their app.');
    }
  };

  // ── GPS tracking: update driver location to Firestore ──
  const watchIdRef = useRef(null);
  const startLocationTracking = useCallback((rideId) => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        updateDriverLocation(rideId, pos.coords.latitude, pos.coords.longitude).catch(console.error);
      },
      (err) => console.warn('GPS error:', err),
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
  }, []);

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const handleCompleteRide = async () => {
    const rideId = activeRide?.rideId || activeRide?.id;
    if (rideId) {
      await updateRideStatus(rideId, 'completed').catch(console.error);
    }
    stopLocationTracking();
    setRideCompleted(true);
    setRideStep(3);
    notify('✅ Ride Completed!', `Ride with ${activeRide?.passengerName || 'passenger'} is done.`);
    // Store ride data for rating before clearing
    setCompletedRideData({ ...activeRide });
    // Show payment confirmation after a delay
    setTimeout(() => {
      setShowPayment(true);
    }, 2000);
  };

  const handlePaymentConfirmed = async () => {
    const rideId = completedRideData?.rideId || completedRideData?.id;
    if (rideId) {
      await confirmPayment(rideId).catch(console.error);
    }
    setShowPayment(false);
    // Go to earnings after payment
    setActiveRide(null);
    setActiveTab('earnings');
    setOnline(true);
    setCompletedRideData(null);
  };

  const handleSaveUpi = async () => {
    if (!upiId.trim()) return;
    try {
      await setDriverUpi(driver.uid, upiId.trim());
      localStorage.setItem('driverUpiId', upiId.trim());
      alert('UPI ID saved successfully!');
    } catch (err) {
      console.error('Error saving UPI:', err);
    }
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
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'active', icon: Navigation, label: 'Active Ride' },
    { id: 'earnings', icon: Wallet, label: 'Earnings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div className="dd-sidebar" style={{
      position: 'fixed', top: 0, left: 0, width: '240px', height: '100vh',
      background: 'rgba(6,26,16,0.97)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(16,185,129,0.08)',
      display: 'flex', flexDirection: 'column', zIndex: 100, padding: '1.5rem 1rem',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Car size={16} color="white" />
        </div>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif" }}>
          Ride<span style={{ background: 'linear-gradient(135deg,#34d399,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
        </span>
      </Link>

      {/* Driver mode badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '0.65rem', marginBottom: '1.5rem' }}>
        <Car size={13} color="#34d399" />
        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Driver Mode</span>
        {/* Live status dot */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: online ? '#10b981' : '#475569', boxShadow: online ? '0 0 5px #10b981' : 'none', transition: 'all 0.3s' }} />
          <span style={{ fontSize: '0.65rem', color: online ? '#10b981' : '#475569', fontWeight: 600, transition: 'color 0.3s' }}>{online ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id}
            className={`dd-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}>
            <item.icon size={18} />
            {item.label}
            {item.id === 'active' && activeRide && (
              <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            )}
            {item.id === 'home' && online && requests.length > 0 && (
              <div style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: '999px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>{requests.length}</div>
            )}
          </button>
        ))}
      </nav>

      {/* User info */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Avatar name={driver.name} size={36} fontSize='0.85rem' color="green" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>{driver.name}</div>
            <Stars rating={driver.rating} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/role-select" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.5rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.03)', color: '#475569', fontSize: '0.75rem', textDecoration: 'none', transition: 'all 0.2s' }}>
            <User size={14} /> Switch Role
          </Link>
          <button onClick={handleLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.5rem', borderRadius: '0.6rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Mobile Nav ── */
  const MobileNav = () => (
    <div className="dd-mobile-nav" style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(6,26,16,0.97)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(16,185,129,0.08)',
      padding: '0.5rem 0', zIndex: 100, justifyContent: 'space-around',
    }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem',
          color: activeTab === item.id ? '#34d399' : '#475569',
          fontFamily: 'inherit', fontSize: '0.65rem', fontWeight: 600,
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

  /* HOME TAB */
  const HomeTab = () => (
    <div style={{ animation: 'ddFadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>
          Good day, {driver.name.split(' ')[0]} 👋
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          {online ? `${requests.length} ride request${requests.length !== 1 ? 's' : ''} waiting.` : 'Go online to start accepting rides.'}
        </p>
      </div>

      {/* Online toggle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <OnlineToggle online={online} onToggle={() => setOnline(!online)} />
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: "Today's Earnings", value: `₹${todayEarnings}`, icon: IndianRupee, color: '#10b981' },
          { label: 'Rides Today', value: MOCK_EARNINGS.filter(e => e.date.startsWith('Today')).length, icon: Car, color: '#3b82f6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `rgba(${i === 0 ? '16,185,129' : '59,130,246'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <stat.icon size={17} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Ride requests / Post form */}
      {!online ? (
        <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem', fontFamily: "'Space Grotesk',sans-serif" }}>Offer a Ride</h3>
          
          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', display: 'block' }}>Leaving from</label>
              <input type="text" value={postPickup} onChange={e => setPostPickup(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f8fafc', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', display: 'block' }}>Going to</label>
              <input type="text" value={postDestination} onChange={e => setPostDestination(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f8fafc', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', display: 'block' }}>Fare (₹)</label>
                <input type="number" value={postFare} onChange={e => setPostFare(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f8fafc', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem', display: 'block' }}>Available Seats</label>
                <input type="number" value={postSeats} onChange={e => setPostSeats(e.target.value)}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f8fafc', outline: 'none' }} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handlePostRide} 
            disabled={postingRide}
            style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '0.75rem', padding: '0.85rem', fontWeight: 700, cursor: postingRide ? 'not-allowed' : 'pointer', opacity: postingRide ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
          >
            {postingRide ? 'Posting...' : 'Go Online & Offer Ride'}
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '1rem', background: 'rgba(15,23,42,0.3)', borderRadius: '1.25rem', border: '1px dashed rgba(16,185,129,0.1)' }}>
          <div style={{ position: 'relative', width: '10px', height: '10px' }}>
            <div className="status-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', textAlign: 'center' }}>
            You're online. Waiting for ride requests...
          </p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
            Incoming Requests ({requests.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {requests.map((req, idx) => (
              <div key={req.id} className="dd-request-card"
                style={{
                  background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.1rem',
                  padding: '1.1rem', animationDelay: `${idx * 0.1}s`,
                }}>
                {/* Passenger info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.9rem' }}>
                  <Avatar name={req.passengerName} photo={req.photo} size={44} fontSize='0.95rem' color="blue" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>{req.passengerName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Stars rating={req.rating} />
                      <span style={{ fontSize: '0.72rem', color: '#475569' }}>{req.totalRides} rides</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', fontFamily: "'Space Grotesk',sans-serif" }}>₹{req.fare}</div>
                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>{req.distance}</div>
                  </div>
                </div>

                {/* Route */}
                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
                      <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.83rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '6px' }}>{req.from}</div>
                      <div style={{ fontSize: '0.83rem', color: '#e2e8f0', fontWeight: 600 }}>{req.to}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={11} color="#64748b" />
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{req.requestedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Accept / Decline */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button className="dd-decline-btn" onClick={() => handleDecline(req.id)}>
                    <X size={14} /> Decline
                  </button>
                  <button className="dd-accept-btn" onClick={() => handleAccept(req)}>
                    <Check size={14} /> Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /* ACTIVE RIDE TAB */
  const ActiveTab = () => {
    if (!activeRide) return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem', animation: 'ddFadeIn 0.4s ease' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={28} color="#10b981" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>No Active Ride</h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', textAlign: 'center', maxWidth: '260px', lineHeight: 1.6 }}>Accept a ride request from the Home tab to get started.</p>
        <button onClick={() => setActiveTab('home')} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Go to Home <ArrowRight size={16} />
        </button>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'ddFadeIn 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.03em' }}>Active Ride</h2>
          <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 600 }}>
            {rideCompleted ? 'Completed' : otpVerified ? 'In Progress' : 'Awaiting OTP'}
          </span>
        </div>

        {/* Map */}
        <RideMap
          height="230px"
          pickupCoords={activeRide?.pickupCoords}
          dropCoords={activeRide?.dropCoords}
          showCar={otpVerified}
          accentColor="green"
        />

        {/* Ride status */}
        <RideStatus step={rideStep} />

        {/* Passenger info */}
        <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.1rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Passenger</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <Avatar name={activeRide.passengerName} size={48} fontSize='1rem' color="blue" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>{activeRide.passengerName}</div>
              <Stars rating={activeRide.rating} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>₹{activeRide.fare}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>Fare</div>
            </div>
          </div>
          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.65rem', padding: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />
              <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '5px' }}>{activeRide.from}</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{activeRide.to}</div>
            </div>
          </div>
        </div>

        {/* OTP Entry — verifies against Django backend */}
        <OTPEntry
          value={otpValue}
          onChange={(v) => { setOtpValue(v); setOtpErrMsg(''); }}
          onVerify={handleVerifyOTP}
          verified={otpVerified}
          verifying={otpVerifying}
        />
        {otpErrMsg && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '0.75rem', padding: '0.75rem 1rem', marginTop: '-0.25rem',
          }}>
            <span style={{ fontSize: '0.85rem', color: '#f87171' }}>❌ {otpErrMsg}</span>
          </div>
        )}

        {/* Complete ride button — only shows after OTP verified */}
        {otpVerified && !rideCompleted && (
          <button className="dd-complete-btn" onClick={handleCompleteRide}>
            <CheckCircle size={18} /> Mark Ride as Complete
          </button>
        )}

        {rideCompleted && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem', padding: '1.1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', fontFamily: "'Space Grotesk',sans-serif" }}>Ride Completed!</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>Redirecting to earnings...</div>
          </div>
        )}
      </div>
    );
  };

  /* EARNINGS TAB */
  const EarningsTab = () => (
    <div style={{ animation: 'ddFadeIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>Earnings</h2>
      <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>Your ride income summary.</p>

      {/* Big earnings cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: "Today's Earnings", value: `₹${todayEarnings}`, sub: `${MOCK_EARNINGS.filter(e => e.date.startsWith('Today')).length} rides`, icon: IndianRupee, color: 'green' },
          { label: 'This Week', value: `₹${weekEarnings}`, sub: `${MOCK_EARNINGS.length} rides`, icon: TrendingUp, color: 'blue' },
        ].map((card, i) => (
          <div key={i} className="earning-card" style={{
            background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)',
            border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.12)' : 'rgba(59,130,246,0.12)'}`,
            borderRadius: '1.1rem', padding: '1.25rem', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: i === 0 ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#3b82f6,#60a5fa)' }} />
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: i === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <card.icon size={18} color={i === 0 ? '#10b981' : '#3b82f6'} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.03em', animation: 'countUp 0.5s ease' }}>{card.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>{card.label}</div>
            <div style={{ fontSize: '0.72rem', color: i === 0 ? '#10b981' : '#3b82f6', marginTop: '0.25rem', fontWeight: 600 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent rides */}
      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Recent Rides</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {MOCK_EARNINGS.map(ride => (
          <div key={ride.id} className="dd-history-row" style={{
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
          }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
              {ride.passenger.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.2rem' }}>{ride.passenger}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748b' }}>
                <span>{ride.from}</span>
                <ArrowRight size={10} />
                <span>{ride.to}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>+₹{ride.fare}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.1rem' }}>{ride.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* PROFILE TAB */
  const ProfileTab = () => (
    <div style={{ animation: 'ddFadeIn 0.4s ease' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>Profile</h2>

      {/* Profile card */}
      <div style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Avatar name={driver.name} size={72} fontSize='1.4rem' color="green" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif", marginBottom: '0.3rem' }}>{driver.name}</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>{driver.email}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px' }}>
            <Shield size={11} color="#34d399" />
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Verified Driver</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.85rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '999px' }}>
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>{driver.rating} Rating</span>
          </div>
        </div>
      </div>

      {/* Vehicle card */}
      <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '1.1rem', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>Vehicle Details</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={22} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>{driver.vehicle}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{driver.vehicleColor}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.85rem', fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
            {driver.vehicleNo}
          </div>
        </div>
      </div>

      {/* UPI ID setting */}
      <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: '1.1rem', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>Payment Setup</div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter your UPI ID (e.g. name@upi)"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem', color: '#f8fafc', outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem' }}
          />
          <button onClick={handleSaveUpi} style={{ padding: '0.75rem 1.25rem', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>Save</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total Rides', value: driver.totalRides, icon: Car },
          { label: 'Member Since', value: driver.memberSince, icon: Calendar },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
              <stat.icon size={17} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Space Grotesk',sans-serif" }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Switch to passenger */}
      <Link to="/role-select" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem 1.25rem', textDecoration: 'none', transition: 'all 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={17} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>Switch to Passenger Mode</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>Book rides instead</div>
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
    home: HomeTab(),
    active: ActiveTab(),
    earnings: EarningsTab(),
    profile: ProfileTab(),
  };

  return (
    <div className="dd-root" style={{ minHeight: '100vh', background: '#06060f' }}>
      {Sidebar()}
      {MobileNav()}
      <div className="dd-main" style={{ marginLeft: '240px', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {tabContent[activeTab]}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          fare={completedRideData?.fare || activeRide?.fare || 0}
          driverName={driver.name}
          driverUpi={upiId}
          role="driver"
          onPaid={handlePaymentConfirmed}
          onClose={() => setShowPayment(false)}
        />
      )}


    </div>
  );
};

export default DriverDashboard;