import React, { useState } from 'react';
import {
    MapPin,
    Navigation,
    Car,
    Clock,
    CheckCircle,
    CreditCard,
    PhoneCall,
    Star
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const userRole = localStorage.getItem('user_role') || 'passenger';

    // App States: 'idle' -> 'searching' -> 'matched' -> 'riding' -> 'completed'
    const [rideState, setRideState] = useState('idle');

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');

    const [showOtp, setShowOtp] = useState(false);

    const handleRequestRide = (e) => {
        e.preventDefault();
        if (!pickup || !destination) return;

        setRideState('searching');

        // Simulate finding a matched driver in 3 seconds
        setTimeout(() => {
            setRideState('matched');
        }, 3000);
    };

    const handleDriverArrived = () => {
        setShowOtp(true);
    };

    const handleStartTrip = () => {
        setShowOtp(false);
        setRideState('riding');

        // Simulate journey complete in 5 seconds
        setTimeout(() => {
            setRideState('completed');
        }, 5000);
    };

    const handlePay = () => {
        setRideState('idle');
        setPickup('');
        setDestination('');
    };

    return (
        <div className="dashboard-layout">
            {/* Side map area (mocked context for premium feel) */}
            <div className="map-view-container">
                <div className="mock-map-bg pulse-map">
                    <div className="map-overlay-blur"></div>
                    {/* Mock paths and pins appear based on state */}
                    {(rideState !== 'idle') && (
                        <div className="map-dynamic-route animate-fade-in">
                            <div className="map-pin-large start"><MapPin size={24} /></div>
                            <div className="dashed-route-line"></div>
                            <div className="map-pin-large end"><Navigation size={24} /></div>
                        </div>
                    )}
                    {rideState === 'matched' && (
                        <div className="moving-car">
                            <Car size={32} color="#ec4899" />
                        </div>
                    )}
                </div>
            </div>

            {/* Control panel Area */}
            <div className="control-panel-container">
                <div className="glass-panel ride-controls">

                    <div className="dashboard-header mb-6">
                        <h2 className="mb-0">Campus Ride</h2>
                        <div className="badge badge-success">Online</div>
                    </div>

                    {/* ----- IDLE STATE ----- */}
                    {rideState === 'idle' && (
                        <form onSubmit={handleRequestRide} className="animate-fade-in">
                            <div className="location-inputs">
                                <div className="input-timeline">
                                    <div className="timeline-dot start"></div>
                                    <div className="timeline-line"></div>
                                    <div className="timeline-dot end"></div>
                                </div>

                                <div className="form-group mb-4 pl-8 relative">
                                    <label className="form-label text-sm">Pickup Location</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="E.g. Engineering Block 3"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-6 pl-8 relative">
                                    <label className="form-label text-sm">Destination</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="E.g. North Gate Hostel"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="fare-estimate glass-card mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Car className="text-primary" size={24} />
                                        <span className="font-semibold text-lg">Standard</span>
                                    </div>
                                    <div className="font-bold text-xl">₹ 25</div>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-sm text-secondary">
                                    <span>~4 mins away</span>
                                    <span>1.2 km</span>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                                Request Campus Ride
                            </button>
                        </form>
                    )}

                    {/* ----- SEARCHING STATE ----- */}
                    {rideState === 'searching' && (
                        <div className="searching-state text-center animate-fade-in">
                            <div className="radar-spinner mb-6">
                                <div className="radar-circle circle-1"></div>
                                <div className="radar-circle circle-2"></div>
                                <div className="radar-circle circle-3"></div>
                                <Car className="radar-icon" size={32} />
                            </div>
                            <h3>Looking for drivers...</h3>
                            <p>Notifying campus drivers near {pickup}</p>
                            <button
                                className="btn btn-secondary mt-4 w-full justify-center"
                                onClick={() => setRideState('idle')}
                            >
                                Cancel Request
                            </button>
                        </div>
                    )}

                    {/* ----- MATCHED STATE ----- */}
                    {rideState === 'matched' && (
                        <div className="matched-state animate-fade-in">
                            <div className="match-banner bg-success-light text-success mb-6 p-3 rounded-md text-center font-bold">
                                Driver Accepted Your Request!
                            </div>

                            <div className="driver-profile glass-card mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="driver-avatar-med">SJ</div>
                                        <div>
                                            <h4 className="mb-0">Sarah Jenkins</h4>
                                            <div className="flex items-center gap-1 text-sm text-warning">
                                                <Star size={14} fill="currentColor" /> 4.9 (120 rides)
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn-icon bg-primary" onClick={handleDriverArrived}>
                                        <PhoneCall size={20} color="white" />
                                    </button>
                                </div>
                                <div className="vehicle-info bg-surface p-3 rounded-md flex justify-between items-center">
                                    <div>
                                        <span className="text-secondary text-sm block">Vehicle</span>
                                        <span className="font-bold block">White Honda Civic</span>
                                    </div>
                                    <div className="badge badge-primary text-xl px-4 py-2">
                                        DL 4C 9812
                                    </div>
                                </div>
                            </div>

                            {!showOtp ? (
                                <div className="arrival-status text-center">
                                    <p className="text-lg font-semibold mb-2">Arriving in <span className="text-primary text-2xl">3 min</span></p>
                                    <button className="btn btn-primary w-full justify-center btn-lg" onClick={handleDriverArrived}>
                                        Simulate Driver Arrival
                                    </button>
                                </div>
                            ) : (
                                <div className="otp-section text-center p-6 border border-warning rounded-lg bg-warning-light relative overflow-hidden">
                                    <div className="pulse-warning-bg absolute inset-0 opacity-20"></div>
                                    <h4 className="text-warning mb-2 relative z-10">Show this OTP to Driver</h4>
                                    <div className="otp-display text-5xl font-extrabold tracking-widest text-warning mb-4 relative z-10">
                                        4921
                                    </div>
                                    <p className="text-sm mb-4 relative z-10 text-gray-300">Do not share until driver arrives.</p>
                                    <button className="btn btn-warning w-full justify-center relative z-10" onClick={handleStartTrip}>
                                        Driver Verified OTP
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ----- RIDING STATE ----- */}
                    {rideState === 'riding' && (
                        <div className="riding-state animate-fade-in text-center py-6">
                            <div className="pulse-success-bg inline-block p-6 rounded-full mb-6 relative">
                                <Navigation size={48} className="text-success animate-pulse relative z-10" />
                            </div>
                            <h2>En Route to Destination</h2>
                            <div className="glass-card mt-6 text-left">
                                <p className="text-secondary mb-1">Heading to</p>
                                <h3 className="mb-0 text-xl">{destination}</h3>
                                <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-primary">
                                    <Clock size={16} /> ETA: ~5 mins
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ----- COMPLETED STATE ----- */}
                    {rideState === 'completed' && (
                        <div className="completed-state animate-fade-in text-center py-2">
                            <div className="success-checkmark inline-flex items-center justify-center w-24 h-24 rounded-full bg-success text-white mb-6 animate-bounce-in">
                                <CheckCircle size={48} />
                            </div>
                            <h2>You've Arrived!</h2>
                            <p className="text-secondary mb-8">Hope you had a safe ride.</p>

                            <div className="payment-card glass-card mb-8">
                                <h3 className="text-2xl mb-2">₹ 25</h3>
                                <p className="text-sm text-secondary">Campus Standard Rate</p>

                                <div className="flex justify-center gap-2 mt-6">
                                    <Star size={32} className="text-warning cursor-pointer hover:scale-110 transition" fill="currentColor" />
                                    <Star size={32} className="text-warning cursor-pointer hover:scale-110 transition" fill="currentColor" />
                                    <Star size={32} className="text-warning cursor-pointer hover:scale-110 transition" fill="currentColor" />
                                    <Star size={32} className="text-warning cursor-pointer hover:scale-110 transition" fill="currentColor" />
                                    <Star size={32} className="text-secondary cursor-pointer hover:scale-110 transition" />
                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-lg w-full justify-center gap-2"
                                onClick={handlePay}
                            >
                                <CreditCard size={20} />
                                Pay via UPI
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
