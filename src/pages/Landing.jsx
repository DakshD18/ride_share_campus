import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, User, MapPin, Star,
  ArrowRight, CheckCircle, ChevronDown
} from 'lucide-react';

/* ── Inject global styles + keyframes ── */
const injectStyles = () => {
  if (document.getElementById('landing-styles')) return;
  const style = document.createElement('style');
  style.id = 'landing-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

    .landing-root * { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatCard {
      0%,100% { transform: translateY(0px) rotate(-1deg); }
      50%     { transform: translateY(-14px) rotate(-1deg); }
    }
    @keyframes floatCard2 {
      0%,100% { transform: translateY(0px) rotate(1.5deg); }
      50%     { transform: translateY(-10px) rotate(1.5deg); }
    }
    @keyframes orbPulse {
      0%,100% { transform: scale(1); opacity: 0.6; }
      50%     { transform: scale(1.12); opacity: 0.9; }
    }
    @keyframes dotPing {
      0%  { transform: scale(1); opacity: 1; }
      75%,100% { transform: scale(2.2); opacity: 0; }
    }

    .hero-delay-1 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
    .hero-delay-2 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
    .hero-delay-3 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
    .hero-delay-4 { animation: heroFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both; }

    .float-card-1 { animation: floatCard 5s ease-in-out infinite; }
    .float-card-2 { animation: floatCard2 6s ease-in-out infinite 1s; }
    .orb-pulse { animation: orbPulse 6s ease-in-out infinite; }

    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }

    .btn-cta:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 8px 30px rgba(59,130,246,0.5) !important; }
    .btn-cta:active { transform: translateY(-1px); }
    .btn-ghost:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
    .role-panel:hover { transform: translateY(-4px); }

    .ping-dot::after {
      content: '';
      position: absolute; inset: 0;
      border-radius: 50%;
      background: inherit;
      animation: dotPing 1.4s cubic-bezier(0,0,0.2,1) infinite;
    }

    .scroll-indicator { animation: heroFadeUp 1s 1.2s both; }
    .scroll-bounce { animation: floatCard 1.5s ease-in-out infinite; }

    @media (max-width: 768px) {
      .hero-grid { flex-direction: column !important; }
      .hero-visual { display: none !important; }
      .roles-grid { flex-direction: column !important; }
      .steps-row { flex-direction: column !important; align-items: flex-start !important; }
      .step-connector { display: none !important; }
      .stats-row { flex-wrap: wrap !important; }
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
    background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem',
    padding: '1.25rem 1.5rem', width: '280px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Ride</span>
      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600 }}>En Route</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Car size={18} color="white" />
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Rahul S.</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Honda City · MH12 AB 1234</div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px', alignItems: 'center' }}>
        <Star size={12} fill="#f59e0b" color="#f59e0b" />
        <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>4.9</span>
      </div>
    </div>
    <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.3rem' }}>OTP Confirmation</div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {['4','7','2','1'].map((d, i) => (
          <div key={i} style={{ width: '36px', height: '36px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>{d}</div>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: '8px', height: '8px', flexShrink: 0 }}>
        <div className="ping-dot" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981' }} />
      </div>
      <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #10b981)', borderRadius: '999px' }} />
      </div>
      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>2 min away</span>
    </div>
  </div>
);

/* ── Second floating card ── */
const MockRequestCard = () => (
  <div style={{
    background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem',
    padding: '1rem 1.25rem', width: '220px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
  }}>
    <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ride Request</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
      <MapPin size={13} color="#10b981" />
      <span style={{ fontSize: '0.82rem', color: '#e2e8f0' }}>Main Gate → Library</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <User size={13} color="#3b82f6" />
        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>2 passengers</span>
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>₹35</span>
    </div>
  </div>
);

/* ── Step component ── */
const Step = ({ num, title, desc, delay }) => (
  <div className={`reveal reveal-delay-${delay}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%', marginBottom: '1rem',
      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.1rem', fontWeight: 800, color: 'white', fontFamily: "'Syne', sans-serif",
      boxShadow: '0 4px 20px rgba(59,130,246,0.4)', flexShrink: 0,
    }}>{num}</div>
    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif" }}>{title}</h4>
    <p style={{ fontSize: '0.83rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{desc}</p>
  </div>
);

/* ════════════════════════════════════
   MAIN LANDING COMPONENT
════════════════════════════════════ */
const Landing = () => {
  injectStyles();
  useReveal();

  return (
    <div className="landing-root" style={{ fontFamily: "'Outfit', sans-serif", color: '#f8fafc', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: '80px' }}>
        <div className="orb-pulse" style={{ position: 'absolute', top: '-10%', left: '-5%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: '4rem', justifyContent: 'space-between' }}>

            {/* Left — Text */}
            <div style={{ flex: '1', maxWidth: '580px' }}>
              <div className="hero-delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '999px', marginBottom: '1.75rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 6px #3b82f6' }} />
                <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: 600, letterSpacing: '0.04em' }}>Campus-Only Ride Sharing</span>
              </div>

              <h1 className="hero-delay-2 hero-title" style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '1.25rem', fontFamily: "'Syne', sans-serif" }}>
                Your Campus,{' '}
                <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Your Ride.
                </span>
              </h1>

              <p className="hero-delay-3" style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
                Safe, affordable rides between verified students. OTP-secured pickups, live GPS tracking, and UPI payments — built exclusively for your campus.
              </p>

              <div className="hero-delay-4" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                <Link to="/login" className="btn-cta" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.8rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.95rem',
                  textDecoration: 'none', transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                  letterSpacing: '0.02em',
                }}>
                  Get Started Here <ArrowRight size={17} />
                </Link>
                <a href="#how-it-works" className="btn-ghost" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.85rem 1.8rem', background: 'rgba(255,255,255,0.05)',
                  color: '#cbd5e1', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.25s',
                }}>
                  See How It Works
                </a>
              </div>

              <div className="hero-delay-4" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                {['Verified Students Only', 'OTP Protected', 'Free to Join'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual */}
            <div className="hero-visual" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '420px', height: '420px' }}>
              <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.1)', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
              <div style={{ position: 'absolute', width: '240px', height: '240px', borderRadius: '50%', border: '1px dashed rgba(59,130,246,0.15)' }} />
              <div className="float-card-1" style={{ position: 'relative', zIndex: 2 }}>
                <MockRideCard />
              </div>
              <div className="float-card-2" style={{ position: 'absolute', bottom: '10px', right: '-20px', zIndex: 3 }}>
                <MockRequestCard />
              </div>
              <div style={{ position: 'absolute', top: '20px', left: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 10px rgba(59,130,246,0.6)' }} />
              <div style={{ position: 'absolute', bottom: '50px', left: '-10px', width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.6)' }} />
            </div>
          </div>
        </div>

        <div className="scroll-indicator" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#334155', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div className="scroll-bounce"><ChevronDown size={18} color="#334155" /></div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="stats-row" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '1rem', padding: '1.25rem 0' }}>
            {[
              { val: '100%', label: 'Verified Students' },
              { val: 'OTP', label: 'Secured Every Ride' },
              { val: 'Live', label: 'GPS Tracking' },
              { val: '₹0', label: 'Platform Fee' },
              { val: 'UPI', label: 'Instant Payments' },
            ].map((s, i) => (
              <div key={i} className="reveal" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", background: 'linear-gradient(135deg, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, marginTop: '0.15rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.85rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '999px', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Simple Process</span>
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", marginBottom: '0.75rem' }}>
              Ready in <span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>3 steps</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
              No complicated setup. Just sign up, request or offer a ride, and go.
            </p>
          </div>

          <div className="steps-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '0', justifyContent: 'center' }}>
            <Step num="1" title="Verify College Email" desc="Sign up with your official college email. Instant verification keeps the platform student-only." delay="1" />
            <div className="step-connector reveal reveal-delay-2" style={{ flex: '0 0 80px', height: '2px', background: 'linear-gradient(90deg, #3b82f6, #10b981)', marginTop: '26px', borderRadius: '999px', opacity: 0.4 }} />
            <Step num="2" title="Book or Offer a Ride" desc="Passengers request a pickup. Drivers see requests on their dashboard and accept." delay="2" />
            <div className="step-connector reveal reveal-delay-3" style={{ flex: '0 0 80px', height: '2px', background: 'linear-gradient(90deg, #3b82f6, #10b981)', marginTop: '26px', borderRadius: '999px', opacity: 0.4 }} />
            <Step num="3" title="OTP Confirm & Ride" desc="Passenger shows OTP to driver at pickup. Ride starts only after confirmation." delay="3" />
          </div>
        </div>
      </section>

      {/* ── FOR PASSENGERS & DRIVERS ── */}
      <section style={{ padding: '6rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", marginBottom: '0.75rem' }}>
              One platform, <span style={{ background: 'linear-gradient(135deg, #60a5fa, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>two roles</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Whether you need a ride or want to offer one — we've got you covered.</p>
          </div>

          <div className="roles-grid" style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Passenger */}
            <div className="role-panel reveal reveal-delay-1" style={{
              flex: 1, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(59,130,246,0.15)', borderRadius: '1.5rem', padding: '2.25rem',
              transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <User size={26} color="#60a5fa" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'Syne', sans-serif" }}>For Passengers</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Get safe, affordable rides around campus anytime. No more waiting for buses or walking alone at night.
              </p>
              {['Book rides in seconds', 'See driver details & rating', 'OTP-verified pickup safety', 'Pay via UPI after the ride', 'Rate your driver'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.7rem' }}>
                  <CheckCircle size={15} color="#3b82f6" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>{item}</span>
                </div>
              ))}
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem',
                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
              }}>
                Join as Passenger <ArrowRight size={16} />
              </Link>
            </div>

            {/* Driver */}
            <div className="role-panel reveal reveal-delay-2" style={{
              flex: 1, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(16,185,129,0.15)', borderRadius: '1.5rem', padding: '2.25rem',
              transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #059669)' }} />
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Car size={26} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', fontFamily: "'Syne', sans-serif" }}>For Drivers</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
                Earn by sharing rides with fellow students on your daily campus routes. Your schedule, your terms.
              </p>
              {['Set your own availability', 'Accept or decline requests', 'Verify riders with OTP', 'Receive UPI payments instantly', 'Build your reputation score'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.7rem' }}>
                  <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: '#94a3b8' }}>{item}</span>
                </div>
              ))}
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem',
                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none', boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
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
            background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59,130,246,0.15)', borderRadius: '2rem',
            padding: '4rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
              <h2 className="cta-title" style={{ fontSize: '2.6rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif", marginBottom: '1rem' }}>
                Ready to ride smarter?
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', margin: '0 auto 2rem' }}>
                Join your campus ride-sharing community today. It's free, safe, and built just for students like you.
              </p>
              <Link to="/login" className="btn-cta" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem',
                textDecoration: 'none', boxShadow: '0 4px 20px rgba(59,130,246,0.4)', transition: 'all 0.25s',
              }}>
                Get Started <ArrowRight size={18} />
              </Link>
              <p style={{ fontSize: '0.8rem', color: '#334155', marginTop: '1.25rem' }}>
                College email required · No credit card · Instant access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Car size={14} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif" }}>
              RideShare<span style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Campus</span>
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
            © 2025 RideShareCampus · Built for students, by students
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" style={{ fontSize: '0.82rem', color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#94a3b8'}
                onMouseLeave={e => e.target.style.color = '#475569'}>
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