import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Clock, Navigation, ArrowRight, Star, Bolt } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-glow"></div>
                <div className="container hero-container animate-fade-in">
                    <div className="hero-content">
                        <div className="badge badge-primary mb-4 border border-blue-500/20">📍 Campus Exclusive</div>
                        <h1 className="hero-title">
                            Safe & Fast Rides <br />
                            Within Your <span className="text-gradient">Campus.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with verified student drivers instantly. Never be late to class again.
                            The most reliable way to get around the university.
                        </p>
                        <div className="hero-actions">
                            <Link to="/login" className="btn btn-primary btn-lg">
                                Book a Ride <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn btn-secondary btn-lg">
                                Become a Driver
                            </Link>
                        </div>

                        <div className="hero-stats mt-8">
                            <div className="stat-item">
                                <div className="avatars">
                                    <div className="avatar"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=b6e3f4" alt="Student" /></div>
                                    <div className="avatar"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=c0aede" alt="Student" /></div>
                                    <div className="avatar"><img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=ffd5dc" alt="Student" /></div>
                                </div>
                                <div className="stat-text">
                                    <div className="stars">
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                    </div>
                                    <span>Trusted by 5,000+ students</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glass-panel app-mockup">
                            <div className="mockup-header">
                                <div></div>
                                <div className="title">RideShare Campus</div>
                                <MenuIcon />
                            </div>
                            <div className="mockup-map">
                                {/* Mock Map UI */}
                                <div className="map-route"></div>
                                <div className="map-pin start"><MapPin size={16} strokeWidth={2.5} /></div>
                                <div className="map-pin end"><Navigation size={14} strokeWidth={2.5} /></div>

                                <div className="mockup-driver-card">
                                    <div className="flex items-center gap-4">
                                        <div className="driver-avatar">
                                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4" alt="Driver" />
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: 0, fontSize: '0.95rem' }}>Sarah Jenkins</h4>
                                            <p style={{ marginBottom: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Civic • 4 mins away</p>
                                        </div>
                                    </div>
                                    <div className="otp-badge">OTP: 4921</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header text-center mb-12">
                        <h2 className="section-title">Why Choose RideShare?</h2>
                        <p className="text-muted">Designed specifically for university students with safety as the #1 priority.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 features-grid">
                        <div className="glass-panel feature-card">
                            <div className="feature-icon icon-blue">
                                <ShieldCheck size={28} />
                            </div>
                            <h3>Verified Students Only</h3>
                            <p className="text-muted">Every user is verified via their college email address (.edu). No outsiders on the platform, ensuring maximum safety.</p>
                        </div>

                        <div className="glass-panel feature-card">
                            <div className="feature-icon icon-purple">
                                <Bolt size={28} />
                            </div>
                            <h3>OTP Verification</h3>
                            <p className="text-muted">Drivers must enter your unique OTP before the ride begins, ensuring you never get into the wrong car.</p>
                        </div>

                        <div className="glass-panel feature-card">
                            <div className="feature-icon icon-emerald">
                                <MapPin size={28} />
                            </div>
                            <h3>Live Tracking</h3>
                            <p className="text-muted">Real-time GPS tracking of your driver's location on the campus map from the moment you book until your drop-off.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export default Landing;
