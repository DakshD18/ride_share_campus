// src/pages/AdminDashboard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — overview of all users, rides, and platform metrics.
// Only accessible to dakshdhokcloud@gmail.com.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { fetchAllUsers, fetchAllRides } from '../services/firestoreApi';
import {
  Users, Car, IndianRupee, TrendingUp, Shield, Star,
  Home, BarChart3, UserCircle, Route, LogOut, ChevronRight,
  CheckCircle, XCircle, Clock, MapPin, AlertTriangle, Eye
} from 'lucide-react';

const ADMIN_EMAIL = 'dakshdhokcloud@gmail.com';

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const injectStyles = () => {
  if (document.getElementById('admin-styles')) return;
  const s = document.createElement('style');
  s.id = 'admin-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

    .admin-root * { box-sizing: border-box; margin: 0; padding: 0; }
    .admin-root { font-family: 'Outfit', sans-serif; }

    @keyframes adminFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .admin-nav-item {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem; border-radius: 0.75rem;
      cursor: pointer; transition: all 0.2s; color: #64748b;
      font-size: 0.9rem; font-weight: 500; text-decoration: none;
      border: none; background: none; width: 100%; font-family: inherit;
    }
    .admin-nav-item:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
    .admin-nav-item.active { background: rgba(245,158,11,0.1); color: #fbbf24; }

    .admin-stat-card {
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      position: relative; overflow: hidden;
    }
    .admin-stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.35) !important;
    }
    .admin-stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    }

    .admin-table-row { transition: all 0.2s; }
    .admin-table-row:hover { background: rgba(255,255,255,0.03) !important; }

    @media (max-width: 768px) {
      .admin-sidebar { display: none !important; }
      .admin-mobile-nav { display: flex !important; }
      .admin-main { margin-left: 0 !important; padding-bottom: 80px !important; }
    }
  `;
  document.head.appendChild(s);
};

/* ══════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
  const styles = {
    available:  { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    requested:  { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    booked:     { bg: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: 'rgba(139,92,246,0.2)' },
    started:    { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    in_progress:{ bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    completed:  { bg: 'rgba(16,185,129,0.08)', color: '#10b981', border: 'rgba(16,185,129,0.15)' },
    cancelled:  { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };
  const s = styles[status] || styles.available;
  return (
    <span style={{
      fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
      fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const AdminDashboard = () => {
  injectStyles();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentEmail = localStorage.getItem('userEmail') || '';

  // Guard: redirect non-admins
  useEffect(() => {
    if (currentEmail !== ADMIN_EMAIL) {
      navigate('/');
    }
  }, [currentEmail, navigate]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [allUsers, allRides] = await Promise.all([
          fetchAllUsers(),
          fetchAllRides(),
        ]);
        setUsers(allUsers);
        setRides(allRides);
      } catch (err) {
        console.error('Admin data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ── Computed metrics ──
  const totalRides = rides.length;
  const completedRides = rides.filter(r => r.status === 'completed').length;
  const activeRides = rides.filter(r => ['available', 'requested', 'booked', 'started', 'in_progress'].includes(r.status)).length;
  const cancelledRides = rides.filter(r => r.status === 'cancelled').length;
  const totalRevenue = rides
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.fare || 0), 0);
  const totalUsers = users.length;
  const drivers = users.filter(u => u.role === 'driver');
  const passengers = users.filter(u => u.role === 'passenger');
  const paidRides = rides.filter(r => r.paymentStatus === 'paid').length;

  const navItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'rides', icon: Route, label: 'Rides' },
  ];

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div className="admin-sidebar" style={{
      position: 'fixed', top: 0, left: 0, width: '240px', height: '100vh',
      background: 'rgba(20,12,8,0.97)', backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(245,158,11,0.08)',
      display: 'flex', flexDirection: 'column', zIndex: 100, padding: '1.5rem 1rem',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={16} color="white" />
        </div>
        <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', fontFamily: "'Syne',sans-serif" }}>
          Ride<span style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Admin</span>
        </span>
      </Link>

      {/* Admin badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '0.65rem', marginBottom: '1.5rem' }}>
        <Shield size={13} color="#fbbf24" />
        <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>Admin Panel</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id}
            className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}>
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>A</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>Admin</div>
            <div style={{ fontSize: '0.72rem', color: '#475569' }}>{currentEmail}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.5rem', borderRadius: '0.6rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </div>
  );

  /* ── Mobile Nav ── */
  const MobileNav = () => (
    <div className="admin-mobile-nav" style={{
      display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(20,12,8,0.97)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(245,158,11,0.08)',
      padding: '0.5rem 0', zIndex: 100, justifyContent: 'space-around',
    }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem',
          color: activeTab === item.id ? '#fbbf24' : '#475569',
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

  /* OVERVIEW TAB */
  const OverviewTab = () => (
    <div style={{ animation: 'adminFadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>
          Platform Overview
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
          Real-time metrics for RideCampus.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Rides', value: totalRides, icon: Car, color: '#3b82f6', gradient: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.03))', border: 'rgba(59,130,246,0.15)' },
          { label: 'Completed', value: completedRides, icon: CheckCircle, color: '#10b981', gradient: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03))', border: 'rgba(16,185,129,0.15)' },
          { label: 'Active Now', value: activeRides, icon: TrendingUp, color: '#f59e0b', gradient: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.03))', border: 'rgba(245,158,11,0.15)' },
          { label: 'Cancelled', value: cancelledRides, icon: XCircle, color: '#ef4444', gradient: 'linear-gradient(135deg,rgba(239,68,68,0.12),rgba(239,68,68,0.03))', border: 'rgba(239,68,68,0.15)' },
          { label: 'Revenue', value: `₹${totalRevenue}`, icon: IndianRupee, color: '#10b981', gradient: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.03))', border: 'rgba(16,185,129,0.15)' },
          { label: 'Total Users', value: totalUsers, icon: Users, color: '#8b5cf6', gradient: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.03))', border: 'rgba(139,92,246,0.15)' },
          { label: 'Drivers', value: drivers.length, icon: Car, color: '#06b6d4', gradient: 'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(6,182,212,0.03))', border: 'rgba(6,182,212,0.15)' },
          { label: 'Payments', value: paidRides, icon: IndianRupee, color: '#34d399', gradient: 'linear-gradient(135deg,rgba(52,211,153,0.12),rgba(52,211,153,0.03))', border: 'rgba(52,211,153,0.15)' },
        ].map((stat, i) => (
          <div key={i} className="admin-stat-card" style={{
            background: stat.gradient, border: `1px solid ${stat.border}`,
            borderRadius: '1.1rem', padding: '1.1rem',
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `rgba(${stat.color === '#3b82f6' ? '59,130,246' : stat.color === '#10b981' ? '16,185,129' : stat.color === '#f59e0b' ? '245,158,11' : stat.color === '#ef4444' ? '239,68,68' : stat.color === '#8b5cf6' ? '139,92,246' : stat.color === '#06b6d4' ? '6,182,212' : '52,211,153'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem' }}>
              <stat.icon size={17} color={stat.color} />
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne',sans-serif", animation: 'countUp 0.5s ease', letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent rides */}
      <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', padding: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>
          Recent Rides
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {rides.slice(0, 8).map(ride => (
            <div key={ride.id} className="admin-table-row" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(2,6,23,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car size={14} color="#60a5fa" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ride.driverName || 'Unassigned'} → {ride.passengerName || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
                  <MapPin size={10} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ride.pickup || '—'} → {ride.destination || '—'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981', marginBottom: '0.15rem' }}>₹{ride.fare || 0}</div>
                <StatusBadge status={ride.status} />
              </div>
            </div>
          ))}
          {rides.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.88rem' }}>No rides found.</div>
          )}
        </div>
      </div>
    </div>
  );

  /* USERS TAB */
  const UsersTab = () => (
    <div style={{ animation: 'adminFadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>All Users</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>{totalUsers} registered users.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {users.map(u => (
          <div key={u.uid} className="admin-table-row" style={{
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
          }}>
            {/* Avatar */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: u.photoURL ? 'transparent' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(139,92,246,0.3)', fontSize: '0.9rem', fontWeight: 700, color: 'white',
            }}>
              {u.photoURL
                ? <img src={u.photoURL} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (u.name || u.email || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne',sans-serif" }}>{u.name || 'Unknown'}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
              {u.role && (
                <span style={{
                  fontSize: '0.68rem', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  background: u.role === 'driver' ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)',
                  color: u.role === 'driver' ? '#34d399' : '#60a5fa',
                  border: `1px solid ${u.role === 'driver' ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)'}`,
                }}>{u.role}</span>
              )}
              {u.avgRating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>{u.avgRating}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.88rem' }}>No users found.</div>
        )}
      </div>
    </div>
  );

  /* RIDES TAB */
  const RidesTab = () => (
    <div style={{ animation: 'adminFadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', fontFamily: "'Syne',sans-serif", letterSpacing: '-0.03em', marginBottom: '0.3rem' }}>All Rides</h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b' }}>{totalRides} total rides.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {rides.map(ride => (
          <div key={ride.id} className="admin-table-row" style={{
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1rem', padding: '1rem',
          }}>
            {/* Top row: driver → passenger */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Car size={14} color="#60a5fa" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  {ride.driverName || '—'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#334155' }}>→</span>
                <UserCircle size={14} color="#a78bfa" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>
                  {ride.passengerName || '—'}
                </span>
              </div>
              <StatusBadge status={ride.status} />
            </div>

            {/* Route */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>{ride.pickup || '—'}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{ride.destination || '—'}</div>
              </div>
            </div>

            {/* Footer: fare, seats, type, payment */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <IndianRupee size={12} color="#10b981" />
                <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>₹{ride.fare || 0}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Users size={12} color="#64748b" />
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{ride.seats || 1} seat{(ride.seats || 1) !== 1 ? 's' : ''}</span>
              </div>
              <span style={{
                fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                background: ride.type === 'offer' ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
                color: ride.type === 'offer' ? '#10b981' : '#60a5fa',
                border: `1px solid ${ride.type === 'offer' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)'}`,
                fontWeight: 600, textTransform: 'uppercase',
              }}>{ride.type || 'offer'}</span>
              {ride.paymentStatus === 'paid' && (
                <span style={{
                  fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                  background: 'rgba(52,211,153,0.08)', color: '#34d399',
                  border: '1px solid rgba(52,211,153,0.15)', fontWeight: 600,
                }}>PAID</span>
              )}
            </div>
          </div>
        ))}
        {rides.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#475569', fontSize: '0.88rem' }}>No rides found.</div>
        )}
      </div>
    </div>
  );

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="admin-root" style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
            <Shield size={24} color="white" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontFamily: "'Syne',sans-serif", marginBottom: '0.3rem' }}>Loading Admin Panel...</div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Fetching platform data</div>
        </div>
      </div>
    );
  }

  const tabContent = {
    overview: <OverviewTab />,
    users: <UsersTab />,
    rides: <RidesTab />,
  };

  return (
    <div className="admin-root" style={{ minHeight: '100vh', background: '#020617' }}>
      <Sidebar />
      <MobileNav />
      <div className="admin-main" style={{ marginLeft: '240px', minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
