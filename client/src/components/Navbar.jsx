import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isLanding = location.pathname === '/';
    
    // Hide navbar completely on auth pages when not logged in
    const authPages = ['/login', '/register'];
    if (authPages.includes(location.pathname)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Premium Landing Navbar (Desktop Only)
    if (isLanding) {
        return (
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '76px', // Exact spec
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 48px', // Exact spec
                backdropFilter: 'blur(12px)',
                background: 'rgba(11, 18, 32, 0.65)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.10)',
                zIndex: 1000,
                minWidth: '1200px' // Enforce desktop width
            }}>
                {/* Brand Left - Text Only */}
                <div
                    onClick={() => navigate('/')}
                    style={{
                        fontWeight: 800,
                        fontSize: '20px',
                        color: '#F8FAFC',
                        letterSpacing: '-0.02em',
                        cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif"
                    }}
                >
                    FinBridge
                </div>

                {/* Right Buttons */}
                <div className="nav-button-container" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {!user ? (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-ghost navbar-button"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="btn-primary navbar-button"
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="btn-ghost navbar-button"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        );
    }

    // Legacy Dashboard Navbar (Internal Pages)
    if (!user) return null;

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', position: 'relative', zIndex: 10 }}>
            <div style={{ fontWeight: 'bold' }}>
                FinBridge
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {user.role === 'MSME' && (
                    <>
                        <Link to="/msme">Dashboard</Link>
                        <Link to="/upload-invoice">Upload Invoice</Link>
                        <Link to="/analytics">Analytics</Link>
                    </>
                )}
                {user.role === 'LENDER' && (
                    <>
                        <Link to="/lender">Dashboard</Link>
                        <Link to="/analytics">Analytics</Link>
                    </>
                )}
                <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
