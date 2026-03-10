import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Map, Search, Car, User, ShieldCheck, CheckCircle2, Clock, Star, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [rideState, setRideState] = useState('idle'); // idle, searching, matched, riding, completed
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    // Mock ride flow simulation
    const handleRequestRide = (e) => {
        e.preventDefault();
        if (!pickup || !destination) return;

        setRideState('searching');

        // Simulate finding a match
        setTimeout(() => {
            setRideState('matched');

            // Simulate driver arriving and starting ride
            setTimeout(() => {
                setRideState('riding');

                // Simulate ride completion
                setTimeout(() => {
                    setRideState('completed');
                }, 8000);

            }, 5000);

        }, 3000);
    };

    const resetDashboard = () => {
        setRideState('idle');
        setPickup('');
        setDestination('');
        setShowOptions(false);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar / Control Panel */}
            <div className="control-panel-container">
                <div className="dashboard-header mb-6">
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>Where to?</h2>
                    <div className="badge badge-primary">Rider Mode</div>
                </div>

                <div className="ride-controls glass-card" style={{ padding: '1.5rem' }}>
                    {rideState === 'idle' && (
                        <form onSubmit={handleRequestRide} className="animate-fade-in">
                            <div className="location-inputs">
                                <div className="input-timeline">
                                    <div className="timeline-dot start"></div>
                                    <div className="timeline-line"></div>
                                    <div className="timeline-dot end"></div>
                                </div>

                                <div className="form-group" style={{ marginLeft: '2rem' }}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Current location (e.g., North Dorm)"
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-0" style={{ marginLeft: '2rem' }}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Destination (e.g., Science Building)"
                                            value={destination}
                                            onChange={(e) => {
                                                setDestination(e.target.value);
                                                if (e.target.value.length > 2) setShowOptions(true);
                                                else setShowOptions(false);
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {showOptions && pickup && destination && (
                                <div className="ride-options animate-fade-in mb-6">
                                    <h4 className="text-muted text-sm mb-3">AVAILABLE RIDES</h4>

                                    <div className="glass-card mb-3" style={{ padding: '1rem', border: '1px solid var(--primary-color)', background: 'rgba(59, 130, 246, 0.1)' }}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Car size={24} className="text-blue-400" />
                                                <div>
                                                    <h4 style={{ marginBottom: 0, color: 'white' }}>Campus Share</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted">
                                                        <Clock size={12} /> <span>3 mins away</span>
                                                        <span>•</span>
                                                        <User size={12} /> <span>2 seats left</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h3 style={{ marginBottom: 0, color: 'white' }}>$2.50</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-full justify-center btn-lg mt-4"
                                disabled={!pickup || !destination}
                                style={{ opacity: (!pickup || !destination) ? 0.5 : 1 }}
                            >
                                Request Ride
                            </button>
                        </form>
                    )}

                    {rideState === 'searching' && (
                        <div className="searching-container text-center animate-fade-in py-8">
                            <div className="radar-spinner mb-6">
                                <Search size={32} className="radar-icon" />
                                <div className="radar-circle circle-1"></div>
                                <div className="radar-circle circle-2"></div>
                                <div className="radar-circle circle-3"></div>
                            </div>
                            <h3 style={{ color: 'white', fontSize: '1.4rem' }}>Finding your driver...</h3>
                            <p className="text-muted">Matching you with verified students nearby.</p>

                            <button
                                className="btn btn-secondary w-full mt-6"
                                onClick={resetDashboard}
                            >
                                Cancel Request
                            </button>
                        </div>
                    )}

                    {rideState === 'matched' && (
                        <div className="matched-container animate-fade-in">
                            <div className="match-banner badge-success mb-4 text-center w-full py-2 rounded-md font-semibold">
                                Driver Matched! Arriving in 3 mins
                            </div>

                            <div className="driver-profile glass-card mb-4" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="driver-avatar-med">
                                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=c0aede" alt="Driver" style={{ width: '100%', borderRadius: '12px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '0.2rem', color: 'white' }}>Michael Chang</h3>
                                        <div className="flex items-center gap-1 text-sm text-muted">
                                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                            <span>4.9 (124 campus rides)</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="btn-icon bg-slate-800"><MessageSquare size={18} /></button>
                                        <button className="btn-icon bg-slate-800"><Phone size={18} /></button>
                                    </div>
                                </div>

                                <div className="vehicle-info flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                                    <div>
                                        <h4 style={{ marginBottom: '0.2rem', fontSize: '0.9rem', color: 'white' }}>Honda Civic (Blue)</h4>
                                        <span className="badge badge-primary">ABC 1234</span>
                                    </div>
                                    <Car size={32} className="text-blue-400" opacity={0.5} />
                                </div>
                            </div>

                            <div className="otp-container glass-card mb-6 text-center pulse-warning-bg">
                                <p className="text-sm font-semibold mb-2" style={{ color: 'white' }}>Share this OTP to start the ride</p>
                                <div className="text-4xl font-bold tracking-widest text-white">
                                    8 4 2 9
                                </div>
                            </div>

                            <div className="route-summary mb-4 px-2">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="mb-0 text-sm text-slate-300 truncate">{pickup}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <p className="mb-0 text-sm text-slate-300 truncate">{destination}</p>
                                </div>
                            </div>

                            <button className="btn btn-secondary w-full text-danger mt-2" onClick={resetDashboard}>
                                Cancel Ride
                            </button>
                        </div>
                    )}

                    {rideState === 'riding' && (
                        <div className="riding-container animate-fade-in">
                            <div className="pulse-success-bg p-4 rounded-xl text-center mb-6 border border-emerald-500/20">
                                <div className="flex justify-center mb-2">
                                    <ShieldCheck size={32} className="text-emerald-400" />
                                </div>
                                <h3 className="text-emerald-400 mb-1">OTP Verified</h3>
                                <p className="mb-0 text-sm text-emerald-100/70">You are on your way to {destination}</p>
                            </div>

                            <div className="flex justify-between items-center mb-6 px-2">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-1">4 mins</h2>
                                    <p className="text-muted mb-0">Est. drop-off at 10:42 AM</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm text-muted">Distance</span>
                                    <h4 className="text-white mb-0">1.2 miles</h4>
                                </div>
                            </div>

                            <div className="driver-profile glass-card mb-4 bg-slate-900/50 hidden lg:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-400 to-indigo-600">
                                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=c0aede" alt="Driver" style={{ width: '100%', borderRadius: '50%' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ marginBottom: '0.1rem', fontSize: '0.95rem', color: 'white' }}>Michael is driving</h4>
                                        <p style={{ marginBottom: 0, fontSize: '0.8rem' }} className="text-muted">Safe campus ride in progress.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {rideState === 'completed' && (
                        <div className="completed-container text-center animate-fade-in py-6">
                            <div className="flex justify-center mb-4">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-bounce-in border border-emerald-500/20">
                                    <CheckCircle2 size={40} className="text-emerald-400" />
                                </div>
                            </div>
                            <h2 className="text-white mb-2">You have arrived!</h2>
                            <p className="text-muted mb-6">Thanks for keeping the campus safe and green.</p>

                            <div className="glass-card mb-6 bg-slate-900/50">
                                <h3 className="text-white mb-4">Total Fare: <span className="text-emerald-400">$2.50</span></h3>

                                <button className="btn w-full mb-3" style={{ background: '#6366f1', color: 'white', fontWeight: 600 }}>
                                    Pay via UPI
                                </button>
                                <button className="btn btn-secondary w-full">
                                    Pay Cash
                                </button>
                            </div>

                            <button className="btn btn-primary w-full" onClick={resetDashboard}>
                                Done
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Map View Area (Mocked for now) */}
            <div className="map-view-container">
                {rideState === 'idle' && (
                    <div className="flex items-center justify-center h-full text-slate-500 opacity-50 flex-col gap-4">
                        <Map size={64} strokeWidth={1} />
                        <p className="font-medium tracking-wide">Enter destination to see route on map</p>
                    </div>
                )}

                {rideState === 'searching' && (
                    <div className="map-overlay-blur">
                        <div className="flex items-center justify-center h-full text-blue-400 opacity-60">
                            <Map size={64} strokeWidth={1} />
                        </div>
                    </div>
                )}

                {(rideState === 'matched' || rideState === 'riding') && (
                    <div className="map-dynamic-route animate-fade-in">
                        <div className="map-pin-large start z-10">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>

                        <div className="dashed-route-line"></div>

                        <div className="map-pin-large end z-10">
                            <Navigation size={20} className="text-white" />
                        </div>

                        {rideState === 'riding' && (
                            <div className="moving-car">
                                <Car size={24} className="text-primary-color" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
