import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileBadge from './ProfileBadge';
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
            <nav className="fixed top-0 left-0 right-0 h-20 px-12 flex justify-between items-center backdrop-blur bg-slate-950/70 border-b border-white/10 z-50 min-w-[1200px]">
                {/* Brand Left - Text Only */}
                <div
                    onClick={() => navigate('/')}
                    className="font-extrabold text-lg text-white tracking-tight cursor-pointer"
                >
                    FinBridge
                </div>

                {/* Right Buttons */}
                <div className="flex gap-3 items-center">
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

    const linkClass = ({ isActive }) =>
        isActive
            ? 'px-3 py-2 rounded-lg text-sm font-medium text-white bg-white/10 border border-white/10 transition-all'
            : 'px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all';

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/60 border-b border-white/10 px-6 py-3 flex justify-between items-center">
            <div
                className="cursor-pointer flex items-center gap-0"
                onClick={() => navigate('/msme')}
            >
                <span className="font-bold text-lg tracking-tight text-blue-400">Fin</span>
                <span className="font-bold text-lg tracking-tight text-white">Bridge</span>
            </div>
            <div className="flex items-center gap-1">
                {user.role === 'MSME' && (
                    <>
                        <NavLink to="/msme" end className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/upload-invoice" className={linkClass}>Upload Invoice</NavLink>
                        <NavLink to="/invoices" className={linkClass}>Invoices</NavLink>
                    </>
                )}
                {user.role === 'LENDER' && (
                    <>
                        <NavLink to="/lender" end className={linkClass}>Dashboard</NavLink>
                        <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
                    </>
                )}
                <div className="ml-3">
                    <ProfileBadge user={user} onLogout={handleLogout} profilePath="/profile" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
