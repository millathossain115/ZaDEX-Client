import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../../assets/LOGOS/Logo2.png';
import { AuthContext } from '../../../Contexts/AuthContext/AuthContext';
import useUserRole from '../../../Hooks/useUserRole';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);
    const [userData] = useUserRole();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logOut()
            .then(() => navigate('/'))
            .catch(err => console.error('Logout failed:', err));
    };

    // Shared style function for NavLink active state
    const navLinkClass = ({ isActive }) =>
        `px-3 py-1.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 ${
            isActive
                ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#03373D] border border-gray-200'
        }`;

    const mobileNavLinkClass = ({ isActive }) =>
        `block px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
            isActive
                ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#03373D] border border-gray-200'
        }`;

    return (
        <nav className="bg-white shadow-lg drop-shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <img src={logo} alt="Zadex" className="h-7" />
                            <span className="text-lg font-extrabold text-[#0d9051]">ZaDEX</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-2">
                        
                        <NavLink to="/about" className={navLinkClass}>
                            About Us
                        </NavLink>
                        <NavLink to="/coverage" className={navLinkClass}>
                            Coverage
                        </NavLink>
                        <NavLink to="/pricing" className={navLinkClass}>
                            Pricing
                        </NavLink>
                        {(!userData?.role || userData?.role === 'user') && (
                            <NavLink to="/rider" className={navLinkClass}>
                                Be a rider
                            </NavLink>
                        )}
                        {(!userData?.role || userData?.role === 'user') && (
                            <NavLink to="/add-parcel" className={navLinkClass}>
                                Add Parcel
                            </NavLink>
                        )}
                        {/* Dashboard - Only visible when logged in */}
                        {user && (
                            <NavLink to="/dashboard" className={navLinkClass}>
                                Dashboard
                            </NavLink>
                        )}
                    </div>

                    {/* Auth Buttons - Desktop */}
                    <div className="hidden lg:flex items-center space-x-3">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            user.displayName?.charAt(0)?.toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 max-w-25 truncate">
                                        {user.displayName || 'User'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium text-sm cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-[#03373D] border border-[#03373D] px-4 py-1.5 rounded-lg hover:bg-[#03373D]/5 transition font-medium text-sm">
                                    Sign In
                                </Link>
                                <Link to="/register" className="bg-[#03373D] text-white px-4 py-1.5 rounded-lg hover:bg-[#025a63] transition font-medium text-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile/Tablet menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#03373D] focus:outline-none"
                        >
                            <svg
                                className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile/Tablet Menu */}
                {isOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <NavLink to="/coverage" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                Coverage
                            </NavLink>
                            <NavLink to="/about" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                About Us
                            </NavLink>
                            <NavLink to="/pricing" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                Pricing
                            </NavLink>
                            {(!userData?.role || userData?.role === 'user') && (
                                <NavLink to="/rider" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                    Be a rider
                                </NavLink>
                            )}
                            {(!userData?.role || userData?.role === 'user') && (
                                <NavLink to="/add-parcel" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                    Add Parcel
                                </NavLink>
                            )}
                            {/* Dashboard - Only visible when logged in */}
                            {user && (
                                <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                                    Dashboard
                                </NavLink>
                            )}
                            <div className="px-3 py-2 space-y-2 border-t border-gray-200 mt-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <div className="w-8 h-8 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                                                {user.photoURL ? (
                                                    <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.displayName?.charAt(0)?.toUpperCase() || 'U'
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full px-3 py-2 rounded-md text-red-500 border border-red-300 hover:bg-red-50 transition font-medium text-center cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-[#03373D] border border-[#03373D] hover:bg-[#03373D]/5 transition font-medium text-center">
                                            Sign In
                                        </Link>
                                        <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md bg-[#03373D] text-white hover:bg-[#025a63] transition font-medium text-center">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;