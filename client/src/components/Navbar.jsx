import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isLanding = location.pathname === '/';

    // Hide navbar on auth pages and admin pages
    const hideNavbarRoutes = ['/login', '/register', '/admin'];
    if (hideNavbarRoutes.some(route => location.pathname.startsWith(route))) {
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
        <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-bg0/80 border-b border-cardBorder px-6 py-4 flex justify-between items-center transition-all duration-300">
            <div className="font-bold text-xl tracking-tight text-white cursor-pointer" onClick={() => navigate('/msme')}>
                FinBridge
            </div>
            <div className="flex items-center gap-6">
                {user.role === 'MSME' && (
                    <>
                        <Link to="/msme" className="text-sm font-medium text-muted hover:text-accent transition-colors">Dashboard</Link>
                        <Link to="/upload-invoice" className="text-sm font-medium text-muted hover:text-accent transition-colors">Upload Invoice</Link>
                        <Link to="/invoices" className="text-sm font-medium text-muted hover:text-accent transition-colors">Invoices</Link>
                    </>
                )}
                {user.role === 'LENDER' && (
                    <>
                        <Link to="/lender" className="text-sm font-medium text-muted hover:text-accent transition-colors">Dashboard</Link>
                        <Link to="/analytics" className="text-sm font-medium text-muted hover:text-accent transition-colors">Analytics</Link>
                    </>
                )}
                <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-white/80 hover:text-danger hover:bg-danger/10 px-4 py-2 rounded-lg transition-all"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
