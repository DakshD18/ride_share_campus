import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, GraduationCap, ShieldAlert } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Mock validation to simulate Firebase college email restriction
        if (!email.includes('@') || !email.endsWith('.edu')) {
            setError('Please use a valid college email address ending in .edu');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Mock successful login/signup
        // In actual implementation, we'd use Firebase Auth here
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', 'passenger'); // default mock role
        navigate('/dashboard');
    };

    return (
        <div className="login-container">
            {/* Background decorations */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="glass-panel auth-panel animate-fade-in">
                <div className="auth-header text-center">
                    <div className="auth-icon">
                        <GraduationCap size={32} />
                    </div>
                    <h2>{isLogin ? 'Welcome Back' : 'Join RideShare'}</h2>
                    <p className="text-muted">{isLogin ? 'Login' : 'Sign up'} with your student email to continue</p>
                </div>

                {error && (
                    <div className="auth-alert error">
                        <ShieldAlert size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form mt-8">
                    <div className="form-group">
                        <label className="form-label">College Email (.edu)</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                className="form-input with-icon"
                                placeholder="student@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                className="form-input with-icon"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full justify-center mt-6 btn-lg">
                        {isLogin ? (
                            <>
                                <LogIn size={20} /> Login
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer mt-8 text-center">
                    <p className="mb-0 text-muted">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="toggle-auth-btn"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
