import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, User, LogIn, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="brand">
                    <div className="brand-icon">
                        <Car size={24} />
                    </div>
                    <span className="brand-text">RideShare<span className="text-gradient">Campus</span></span>
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links desktop-only">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
                    <div className="nav-actions">
                        <Link to="/login" className="btn btn-secondary">
                            <LogIn size={18} />
                            <span>Login</span>
                        </Link>
                        <Link to="/login" className="btn btn-primary">
                            <User size={18} />
                            <span>Sign Up</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle btn-icon desktop-hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Home</Link>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Dashboard</Link>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full mt-4 justify-center">Login / Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
