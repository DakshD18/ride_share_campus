import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, User, MapPin, Star,
  ArrowRight, CheckCircle, ChevronDown,
  Shield, Zap, QrCode, Smartphone
} from 'lucide-react';

/* ── Inject global styles + keyframes ── */
const injectStyles = () => {
  if (document.getElementById('landing-styles')) return;
  const style = document.createElement('style');
  style.id = 'landing-styles';
  style.textContent = `
    .landing-root * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatCard {
      0%,100% { transform: translateY(0px) rotate(-1deg); }
      50%     { transform: translateY(-16px) rotate(-1deg); }
    }
    @keyframes floatCard2 {
      0%,100% { transform: translateY(0px) rotate(1.5deg); }
      50%     { transform: translateY(-12px) rotate(1.5deg); }
    }
    @keyframes orbFloat {
      0%,100% { transform: scale(1) translate(0, 0); }
      33%     { transform: scale(1.1) translate(20px, -15px); }
      66%     { transform: scale(0.95) translate(-15px, 10px); }
    }
    @keyframes dotPing {
      0%  { transform: scale(1); opacity: 1; }
      75%,100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes gradientShift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes countFade {
      from { opacity: 0; transform: translateY(12px) scale(0.9); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .hero-delay-1 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
    .hero-delay-2 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
    .hero-delay-3 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
    .hero-delay-4 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
    .hero-delay-5 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s both; }

    .float-card-1 { animation: floatCard 5s ease-in-out infinite; }
    .float-card-2 { animation: floatCard2 6s ease-in-out infinite 1s; }
    .orb-float { animation: orbFloat 12s ease-in-out infinite; }

    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }

    .btn-cta { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
    .btn-cta:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 8px 32px rgba(99,102,241,0.45) !important; }
    .btn-cta:active { transform: translateY(-1px); }
    .btn-ghost:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-2px); }
    .role-panel { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .role-panel:hover { transform: translateY(-6px); }

    .ping-dot::after {
      content: '';
      position: absolute; inset: 0;
      border-radius: 50%;
      background: inherit;
      animation: dotPing 1.4s cubic-bezier(0,0,0.2,1) infinite;
    }

    .scroll-indicator { animation: heroFadeUp 1s 1.2s both; }
    .scroll-bounce { animation: floatCard 1.5s ease-in-out infinite; }

    .stat-card { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.3) !important; }

    .feature-badge { transition: all 0.2s; }
    .feature-badge:hover { transform: scale(1.05); }

    @media (max-width: 768px) {
      .hero-grid { flex-direction: column !important; }
      .hero-visual { display: none !important; }
      .roles-grid { flex-direction: column !important; }
      .steps-row { flex-direction: column !important; align-items: center !important; }
      .step-connector { display: none !important; }
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .hero-title { font-size: 2.6rem !important; }
      .cta-title { font-size: 2rem !important; }
    }
  `;
  document.head.appendChild(style);
};

/* ── Scroll reveal hook ── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

/* ── Floating mock ride card ── */
const MockRideCard = () => (
  <div style={{
    background: 'rgba(14,14,36,0.8)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(99,102,241,0.15)', borderRadius: '1.25rem',
    padding: '1.25rem 1.5rem', width: '280px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#706d8a', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-heading)' }}>Active Ride</span>
      <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem', background: 'rgba(34,197,94,0.12)', color: '#64ffda', borderRadius: '999px', border: '1px solid rgba(34,197,94,0.25)', fontWeight: 600 }}> On Route </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #64ffda, #007bb5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Car size={18} color="white" />
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f0ff', fontFamily: 'var(--font-heading)' }}>Rahul S.</div>
        <div style={{ fontSize: '0.72rem', color: '#706d8a' }}>Honda City · MH12 AB 1234</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', alignItems: 'center' }}>
        <Star size={12} fill="#ffb86c" color="#ffb86c" />
        <span style={{ fontSize: '0.75rem', color: '#ffb86c', fontWeight: 600 }}>4.9</span>
      </div>
    </div>
    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.68rem', color: '#706d8a', marginBottom: '0.3rem' }}>OTP Confirmation</div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {['4','7','2','1'].map((d, i) => (
          <div key={i} style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#a6fff0', fontFamily: 'monospace' }}>{d}</div>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
        <div className="ping-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#64ffda' }} />
      </div>
      <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #64ffda, #64ffda)', borderRadius: '999px' }} />
      </div>
      <span style={{ fontSize: '0.72rem', color: '#706d8a' }}>2 min away</span>
    </div>
  </div>
);

/* ── Second floating card ── */
const MockRequestCard = () => (
  <div style={{
    background: 'rgba(14,14,36,0.85)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(245,158,11,0.2)', borderRadius: '1rem',
    padding: '1rem 1.25rem', width: '220px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
  }}>
    <div style={{ fontSize: '0.7rem', color: '#706d8a', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-heading)' }}>Ride Request</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
      <MapPin size={13} color="#ffb86c" />
      <span style={{ fontSize: '0.82rem', color: '#b8b5d0' }}>Main Gate → Library</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <User size={13} color="#64ffda" />
        <span style={{ fontSize: '0.78rem', color: '#706d8a' }}>2 passengers</span>
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffb86c' }}>₹35</span>
    </div>
  </div>
);

/* ── Step component ── */
const Step = ({ num, title, desc, delay }) => (
  <div className={`reveal reveal-delay-${delay}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1, maxWidth: '240px' }}>
    <div style={{
      width: '56px', height: '56px', borderRadius: '16px', marginBottom: '1.25rem',
      background: 'linear-gradient(135deg, #64ffda, #007bb5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.1rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)',
      boxShadow: '0 6px 24px rgba(99,102,241,0.4)', flexShrink: 0,
    }}>{num}</div>
    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f0ff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>{title}</h4>
    <p style={{ fontSize: '0.84rem', color: '#706d8a', lineHeight: 1.65, margin: 0 }}>{desc}</p>
  </div>
);

/* ════════════════════════════════════
   MAIN LANDING COMPONENT
════════════════════════════════════ */
const Landing = () => {
  injectStyles();
  useReveal();

  return (
    <div className="landing-root" style={{ fontFamily: 'var(--font-body)', color: '#f1f0ff', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Ambient orbs */}
        <div className="orb-float" style={{ position: 'absolute', top: '-15%', left: '-8%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0%', right: '-12%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '60%', left: '50%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: '4rem', justifyContent: 'space-between' }}>

            {/* Left — Text */}
            <div style={{ flex: '1', maxWidth: '580px' }}>
              <div className="hero-delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '999px', marginBottom: '1.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#64ffda', boxShadow: '0 0 8px #64ffda' }} />
                <span style={{ fontSize: '0.78rem', color: '#a6fff0', fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'var(--font-heading)' }}>Campus-Only Ride Sharing</span>
              </div>

              <h1 className="hero-delay-2 hero-title" style={{ fontSize: '3.8rem', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                Your Campus,{' '}
                <span style={{ background: 'linear-gradient(135deg, #a6fff0 0%, #64ffda 40%, #ffb86c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Your Ride.
                </span>
              </h1>

              <p className="hero-delay-3" style={{ fontSize: '1.1rem', color: '#b8b5d0', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '480px' }}>
                Safe, affordable rides between verified students. OTP-secured pickups, live GPS tracking, and UPI payments — built exclusively for your campus.
              </p>

              <div className="hero-delay-4" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn-cta" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.8rem', background: 'linear-gradient(135deg, #64ffda, #52e0c4)',
                  color: 'white', borderRadius: '0.85rem', fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
                  letterSpacing: '-0.01em', fontFamily: 'var(--font-heading)',
                }}>
                  Get Started Here <ArrowRight size={17} />
                </Link>
                <a href="#how-it-works" className="btn-ghost" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.8rem', background: 'rgba(255,255,255,0.04)',
                  color: '#b8b5d0', borderRadius: '0.85rem', fontWeight: 600, fontSize: '0.95rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-heading)',
                }}>
                  See How It Works
                </a>
              </div>

              <div className="hero-delay-5" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {['Verified Students Only', 'OTP Protected', 'Free to Join'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={14} color="#64ffda" />
                    <span style={{ fontSize: '0.82rem', color: '#706d8a', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual */}
            <div className="hero-visual" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '420px', height: '420px' }}>
              <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.1)', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px dashed rgba(139,92,246,0.12)' }} />
              <div className="float-card-1" style={{ position: 'relative', zIndex: 2 }}>
                <MockRideCard />
              </div>
              <div className="float-card-2" style={{ position: 'absolute', bottom: '10px', right: '-20px', zIndex: 3 }}>
                <MockRequestCard />
              </div>
              <div style={{ position: 'absolute', top: '20px', left: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#64ffda', boxShadow: '0 0 12px rgba(99,102,241,0.6)' }} />
              <div style={{ position: 'absolute', bottom: '50px', left: '-10px', width: '5px', height: '5px', borderRadius: '50%', background: '#ffb86c', boxShadow: '0 0 10px rgba(245,158,11,0.6)' }} />
              <div style={{ position: 'absolute', top: '80px', right: '10px', width: '6px', height: '6px', borderRadius: '50%', background: '#007bb5', boxShadow: '0 0 10px rgba(139,92,246,0.6)' }} />
            </div>
          </div>
        </div>

        <div className="scroll-indicator" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#45425e', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Scroll</span>
          <div className="scroll-bounce"><ChevronDown size={18} color="#45425e" /></div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ padding: '3rem 0', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)', background: 'rgba(14,14,36,0.3)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
            {[
              { val: '100%', label: 'Verified Students', icon: Shield, color: '#64ffda' },
              { val: 'OTP', label: 'Secured Every Ride', icon: QrCode, color: '#007bb5' },
              { val: 'Live', label: 'GPS Tracking', icon: MapPin, color: '#64ffda' },
              { val: '₹0', label: 'Platform Fee', icon: Zap, color: '#ffb86c' },
              { val: 'UPI', label: 'Instant Payments', icon: Smartphone, color: '#a6fff0' },
            ].map((s, i) => (
              <div key={i} className="stat-card reveal" style={{ textAlign: 'center', padding: '1.25rem 1rem', background: 'rgba(14,14,36,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `rgba(${s.color === '#64ffda' ? '99,102,241' : s.color === '#007bb5' ? '139,92,246' : s.color === '#64ffda' ? '34,197,94' : s.color === '#ffb86c' ? '245,158,11' : '129,140,248'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f0ff', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)', marginBottom: '0.15rem' }}>{s.val}</div>
                <div style={{ fontSize: '0.75rem', color: '#706d8a', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.85rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '999px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#ffb86c', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>Simple Process</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)', marginBottom: '0.75rem' }}>
              Ready in <span style={{ background: 'linear-gradient(135deg, #a6fff0, #ffb86c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>3 steps</span>
            </h2>
            <p style={{ color: '#706d8a', fontSize: '1rem', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              No complicated setup. Just sign up, request or offer a ride, and go.
            </p>
          </div>

          <div className="steps-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '0', justifyContent: 'center' }}>
            <Step num="1" title="Verify College Email" desc="Sign up with your official college email. Instant verification keeps the platform student-only." delay="1" />
            <div className="step-connector reveal reveal-delay-2" style={{ flex: '0 0 80px', height: '2px', background: 'linear-gradient(90deg, #64ffda, #ffb86c)', marginTop: '28px', borderRadius: '999px', opacity: 0.35 }} />
            <Step num="2" title="Book or Offer a Ride" desc="Passengers request a pickup. Drivers see requests on their dashboard and accept." delay="2" />
            <div className="step-connector reveal reveal-delay-3" style={{ flex: '0 0 80px', height: '2px', background: 'linear-gradient(90deg, #ffb86c, #007bb5)', marginTop: '28px', borderRadius: '999px', opacity: 0.35 }} />
            <Step num="3" title="OTP Confirm & Ride" desc="Passenger shows OTP to driver at pickup. Ride starts only after confirmation." delay="3" />
          </div>
        </div>
      </section>

      {/* ── FOR PASSENGERS & DRIVERS ── */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)', marginBottom: '0.75rem' }}>
              One platform, <span style={{ background: 'linear-gradient(135deg, #a6fff0, #ffb86c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>two roles</span>
            </h2>
            <p style={{ color: '#706d8a', fontSize: '1rem' }}>Whether you need a ride or want to offer one — we've got you covered.</p>
          </div>

          <div className="roles-grid" style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Passenger */}
            <div className="role-panel reveal reveal-delay-1" style={{
              flex: 1, background: 'rgba(14,14,36,0.55)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(99,102,241,0.12)', borderRadius: '1.5rem', padding: '2.25rem',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #64ffda, #a6fff0)' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <User size={26} color="#a6fff0" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f0ff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>For Passengers</h3>
              <p style={{ color: '#706d8a', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Get safe, affordable rides around campus anytime. No more waiting for buses or walking alone at night.
              </p>
              {['Book rides in seconds', 'See driver details & rating', 'OTP-verified pickup safety', 'Pay via UPI after the ride', 'Rate your driver'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.7rem' }}>
                  <CheckCircle size={15} color="#64ffda" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#b8b5d0' }}>{item}</span>
                </div>
              ))}
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem',
                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #64ffda, #52e0c4)',
                color: 'white', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,102,241,0.35)', fontFamily: 'var(--font-heading)',
              }}>
                Join as Passenger <ArrowRight size={16} />
              </Link>
            </div>

            {/* Driver */}
            <div className="role-panel reveal reveal-delay-2" style={{
              flex: 1, background: 'rgba(14,14,36,0.55)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(245,158,11,0.12)', borderRadius: '1.5rem', padding: '2.25rem',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ffb86c, #ffb86c)' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Car size={26} color="#ffb86c" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f0ff', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>For Drivers</h3>
              <p style={{ color: '#706d8a', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Earn by sharing rides with fellow students on your daily campus routes. Your schedule, your terms.
              </p>
              {['Set your own availability', 'Accept or decline requests', 'Verify riders with OTP', 'Receive UPI payments instantly', 'Build your reputation score'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.7rem' }}>
                  <CheckCircle size={15} color="#ffb86c" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#b8b5d0' }}>{item}</span>
                </div>
              ))}
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem',
                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #ffb86c, #ffb86c)',
                color: '#0c0c1d', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(245,158,11,0.35)', fontFamily: 'var(--font-heading)',
              }}>
                Join as Driver <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="reveal" style={{
            background: 'rgba(14,14,36,0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.15)', borderRadius: '2rem',
            padding: '4rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
              <h2 className="cta-title" style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
                Ready to ride smarter?
              </h2>
              <p style={{ color: '#706d8a', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2rem' }}>
                Join your campus ride-sharing community today. It's free, safe, and built just for students like you.
              </p>
              <Link to="/login" className="btn-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #64ffda, #52e0c4)',
                color: 'white', borderRadius: '0.85rem', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', boxShadow: '0 6px 24px rgba(99,102,241,0.4)', fontFamily: 'var(--font-heading)',
              }}>
                Get Started <ArrowRight size={18} />
              </Link>
              <p style={{ fontSize: '0.8rem', color: '#45425e', marginTop: '1.25rem' }}>
                College email required · No credit card · Instant access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #64ffda, #007bb5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
              RideShare<span style={{ background: 'linear-gradient(135deg, #a6fff0, #64ffda)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#45425e', margin: 0 }}>
            © 2025 RideShareCampus · Built for students, by students
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" style={{ fontSize: '0.82rem', color: '#706d8a', textDecoration: 'none', transition: 'color 0.2s', fontFamily: 'var(--font-heading)' }}
                onMouseEnter={e => e.target.style.color = '#b8b5d0'}
                onMouseLeave={e => e.target.style.color = '#706d8a'}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;