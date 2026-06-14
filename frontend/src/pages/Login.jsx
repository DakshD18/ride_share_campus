import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertCircle, Sparkles } from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { saveUserProfile } from '../services/firestoreApi';

const injectKeyframes = () => {
  if (document.getElementById('login-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'login-keyframes';
  style.textContent = `
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
      border-color: rgba(99,102,241,0.5) !important;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
      background: rgba(6,6,15,0.8) !important;
    }
    .google-btn:hover {
      background: rgba(255,255,255,0.06) !important;
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

  const [tab, setTab]           = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Save user info to localStorage so dashboards can access name/email */
  const persistUser = (user) => {
    localStorage.setItem('userEmail', user.email || '');
    localStorage.setItem('userName',  user.displayName || form.name || user.email?.split('@')[0] || 'User');
    localStorage.setItem('userUID',   user.uid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let userCredential;
      if (tab === 'login') {
        userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      }
      persistUser(userCredential.user);
      // Save/merge user profile to Firestore
      await saveUserProfile({ ...userCredential.user, name: form.name });
      navigate('/role-select');
    } catch (err) {
      // Convert Firebase error codes to friendly messages
      const msgs = {
        'auth/invalid-credential':       'Incorrect email or password.',
        'auth/user-not-found':           'No account found with this email.',
        'auth/wrong-password':           'Incorrect password.',
        'auth/email-already-in-use':     'An account with this email already exists.',
        'auth/weak-password':            'Password should be at least 6 characters.',
        'auth/invalid-email':            'Please enter a valid email address.',
        'auth/configuration-not-found':  '⚠️ Firebase not configured yet. Please add your credentials to firebase.js.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      persistUser(result.user);
      // Save/merge user profile to Firestore
      await saveUserProfile(result.user);
      navigate('/role-select');
    } catch (err) {
      const msgs = {
        'auth/popup-closed-by-user':     'Sign-in cancelled.',
        'auth/configuration-not-found':  '⚠️ Firebase not configured yet. Please add your credentials to firebase.js.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.5rem', fontFamily: 'var(--font-body)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat1 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0, animation: 'orbFloat2 10s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px',
        background: 'rgba(14,14,36,0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem', padding: '2.5rem',
        boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        animation: 'cardIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Top shimmer line */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)', borderRadius: '1px' }} />

        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '2rem' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #64ffda, #007bb5)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(99,102,241,0.4)', flexShrink: 0 }}>
            <Car size={18} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f1f0ff', letterSpacing: '-0.04em', fontFamily: 'var(--font-heading)' }}>
            RideShare
            <span style={{ background: 'linear-gradient(135deg, #a6fff0, #64ffda)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
          </span>
        </Link>

        {/* Heading */}
        <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#f1f0ff', letterSpacing: '-0.03em', marginBottom: '0.4rem', lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>
          {tab === 'login' ? 'Welcome back 👋' : 'Create account'}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#706d8a', marginBottom: '2rem', lineHeight: 1.5 }}>
          {tab === 'login'
            ? 'Sign in with your college email to continue.'
            : 'Join your campus ride-sharing community.'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: '1.75rem', background: 'rgba(6,6,15,0.5)', borderRadius: '0.75rem', padding: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '0.55rem', borderRadius: '0.6rem', border: 'none',
              cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', fontFamily: 'var(--font-heading)',
              background: tab === t ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: tab === t ? '#a6fff0' : '#706d8a',
              boxShadow: tab === t ? 'inset 0 0 0 1px rgba(99,102,241,0.3)' : 'none',
            }}>
              {t === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        {/* Error Banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem',
          }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', color: '#f87171', lineHeight: 1.4 }}>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Name — signup only */}
          {tab === 'signup' && (
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#706d8a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>Full Name</label>
              <input className="login-input" name="name" type="text" placeholder="Your full name"
                value={form.name} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(6,6,15,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', color: '#f1f0ff', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }} />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#706d8a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#45425e', display: 'flex', pointerEvents: 'none' }}><Mail size={15} /></span>
              <input className="login-input" name="email" type="email" placeholder="your@email."
                value={form.email} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', background: 'rgba(6,6,15,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', color: '#f1f0ff', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#706d8a', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#45425e', display: 'flex', pointerEvents: 'none' }}><Lock size={15} /></span>
              <input className="login-input" name="password" type={showPass ? 'text' : 'password'}
                placeholder={tab === 'signup' ? 'Create a password' : 'Your password'}
                value={form.password} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem 2.8rem 0.75rem 2.6rem', background: 'rgba(6,6,15,0.6)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', color: '#f1f0ff', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-body)' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#45425e', cursor: 'pointer', display: 'flex', padding: '2px' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          {tab === 'login' && (
            <div style={{ textAlign: 'right', marginBottom: '1rem', marginTop: '-0.4rem' }}>
              <a href="#" style={{ fontSize: '0.8rem', color: '#a6fff0', textDecoration: 'none' }}>Forgot password?</a>
            </div>
          )}

          {/* Submit */}
          <button className="submit-btn" type="submit" disabled={loading} style={{
            width: '100%', padding: '0.85rem', borderRadius: '0.75rem', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            transition: 'all 0.2s', background: 'linear-gradient(135deg, #64ffda, #52e0c4)',
            color: 'white', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            letterSpacing: '-0.01em', marginTop: '0.5rem', fontFamily: 'var(--font-heading)',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Please wait...' : (tab === 'login' ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.25rem 0', color: '#45425e', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
          <span>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Google */}
        <button className="google-btn" onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          color: '#b8b5d0', fontSize: '0.9rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          transition: 'all 0.2s', fontFamily: 'var(--font-heading)', opacity: loading ? 0.6 : 1,
        }}>
          <GoogleIcon /> {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>

        {/* Switch tab */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#706d8a' }}>
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <a href="#" style={{ color: '#a6fff0', textDecoration: 'none', fontWeight: 600 }}
            onClick={(e) => { e.preventDefault(); setTab(tab === 'login' ? 'signup' : 'login'); }}>
            {tab === 'login' ? 'Sign Up' : 'Login'}
          </a>
        </p>

        {/* Security note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', fontSize: '0.75rem', color: '#45425e' }}>
          <Shield size={12} />
          <span>College email verification required for all accounts</span>
        </div>
      </div>
    </div>
  );
};

export default Login;