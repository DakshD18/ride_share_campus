import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

const injectKeyframes = () => {
  if (document.getElementById('login-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'login-keyframes';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap');
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(24px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes orbFloat1 {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(30px,20px) scale(1.05); }
    }
    @keyframes orbFloat2 {
      0%,100% { transform: translate(0,0) scale(1); }
      50%     { transform: translate(-20px,-30px) scale(1.08); }
    }
    .login-input:focus {
      border-color: rgba(59,130,246,0.5) !important;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important;
      background: rgba(2,6,23,0.9) !important;
    }
    .google-btn:hover {
      background: rgba(255,255,255,0.08) !important;
      border-color: rgba(255,255,255,0.15) !important;
      transform: translateY(-1px);
    }
    .submit-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
    .submit-btn:active { transform: translateY(0); }
  `;
  document.head.appendChild(style);
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  injectKeyframes();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔥 Firebase Auth goes here
    // After successful login/signup → go to role selection
    navigate('/role-select');
  };

  const handleGoogle = () => {
    // 🔥 Firebase Google Auth goes here
    navigate('/role-select');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', fontFamily: "'Syne', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat1 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat2 10s ease-in-out infinite' }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px',
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        animation: 'cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Top shimmer line */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)', borderRadius: '1px' }} />

        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(59,130,246,0.4)', flexShrink: 0 }}>
            <Car size={18} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.04em' }}>
            RideShare
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: '0.4rem', lineHeight: 1.2 }}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create account'}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.5 }}>
          {tab === 'login'
            ? 'Sign in with your college email to continue.'
            : 'Join your campus ride-sharing community.'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '1.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '0.65rem', padding: '4px' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.55rem', borderRadius: '0.5rem', border: 'none',
              cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
              transition: 'all 0.2s', fontFamily: 'inherit',
              background: tab === t ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: tab === t ? '#93c5fd' : '#64748b',
              boxShadow: tab === t ? 'inset 0 0 0 1px rgba(59,130,246,0.3)' : 'none',
            }}>
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name — signup only */}
          {tab === 'signup' && (
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name</label>
              <input className="login-input" name="name" type="text" placeholder="Your full name"
                value={form.name} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.65rem', color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }} />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', display: 'flex', pointerEvents: 'none' }}><Mail size={15} /></span>
              <input className="login-input" name="email" type="email" placeholder="your@email."
                value={form.email} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.65rem', color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', display: 'flex', pointerEvents: 'none' }}><Lock size={15} /></span>
              <input className="login-input" name="password" type={showPass ? 'text' : 'password'}
                placeholder={tab === 'signup' ? 'Create a password' : 'Your password'}
                value={form.password} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 2.8rem 0.75rem 2.6rem', background: 'rgba(2,6,23,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.65rem', color: '#f8fafc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.4rem' }}>
              <a href="#" style={{ fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none' }}>Forgot password?</a>
            </div>
          )}

          {/* Submit */}
          <button className="submit-btn" type="submit" style={{
            width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: 'none',
            cursor: 'pointer', fontSize: '0.95rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'all 0.2s', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white', boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            letterSpacing: '0.02em', marginTop: '0.5rem', fontFamily: 'inherit',
          }}>
            {tab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={17} />
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0', color: '#334155', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Google */}
        <button className="google-btn" onClick={handleGoogle} style={{
          width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', cursor: 'pointer',
          color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          <GoogleIcon /> Sign in with Google
        </button>

        {/* Switch tab */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); setTab(tab === 'login' ? 'signup' : 'login'); }}>
            {tab === 'login' ? 'Sign Up' : 'Login'}
          </a>
        </p>

        {/* Security note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.75rem', color: '#334155' }}>
          <Shield size={12} />
          <span>College email verification required for all accounts</span>
        </div>
      </div>
    </div>
  );
};

export default Login;