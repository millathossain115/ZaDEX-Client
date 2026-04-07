import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';
import useUserRole from '../Hooks/useUserRole';
import logo from '../assets/LOGOS/Logo2.png';

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const [userData, isRoleLoading] = useUserRole();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isRider = userData?.role === 'rider';

    const handleLogout = () => {
        logOut()
            .then(() => navigate('/'))
            .catch(err => console.error('Logout failed:', err));
    };

    const closeSidebar = () => setSidebarOpen(false);

    const sidebarLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isActive
                ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#03373D]'
        }`;

    const sectionLabelClass = 'text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-1';

    const renderAdminNav = () => (
        <div className="flex-1 space-y-1 overflow-y-auto">
            <p className={sectionLabelClass}>Overview</p>

            <NavLink to="/dashboard" end className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistics
            </NavLink>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Parcel Management</p>

                <NavLink to="/dashboard/all-parcels" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    All Parcels
                </NavLink>

                <NavLink to="/dashboard/assign-parcels" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Assign Parcels
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>People</p>

                <NavLink to="/dashboard/manage-riders" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Riders
                </NavLink>

                <NavLink to="/dashboard/manage-users" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    All Users
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Feedback</p>

                <NavLink to="/dashboard/rider-reviews" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Rider Reviews
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Account</p>

                <NavLink to="/dashboard/profile" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                </NavLink>

                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#03373D] transition-all duration-200" onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );

    const renderUserNav = () => (
        <div className="flex-1 space-y-1 overflow-y-auto">
            <p className={sectionLabelClass}>Menu</p>

            <NavLink to="/dashboard" end className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Parcels
            </NavLink>

            <NavLink to="/add-parcel" className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Add New Parcel
            </NavLink>

            <NavLink to="/dashboard/payment-history" className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Payment History
            </NavLink>

            <NavLink to="/dashboard/track" className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Track Parcel
            </NavLink>

            <NavLink to="/dashboard/profile" className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
            </NavLink>

            <div className="pt-4 mt-4 border-t border-gray-100">
                <p className={sectionLabelClass}>Balance & Payments</p>

                <NavLink to="/dashboard/balance" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    My Balance
                </NavLink>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
                <p className={sectionLabelClass}>General</p>

                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#03373D] transition-all duration-200" onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );

    const renderRiderNav = () => (
        <div className="flex-1 space-y-1 overflow-y-auto">
            <p className={sectionLabelClass}>Overview</p>

            <NavLink to="/dashboard/rider-overview" className={sidebarLinkClass} onClick={closeSidebar}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13h8V3H3v10zm10 8h8V3h-8v18zm-10 0h8v-6H3v6z" />
                </svg>
                My Statistics
            </NavLink>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Tasks</p>

                <NavLink to="/dashboard/delivery-list" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9m-7-4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Delivery List
                </NavLink>

                <NavLink to="/dashboard/ongoing-tasks" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ongoing Tasks
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>History</p>

                <NavLink to="/dashboard/completed" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Finance</p>

                <NavLink to="/dashboard/earnings" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1a9 9 0 100-18 9 9 0 000 18z" />
                    </svg>
                    My Earnings
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Feedback</p>

                <NavLink to="/dashboard/my-reviews" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    My Reviews
                </NavLink>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
                <p className={sectionLabelClass}>Account</p>

                <NavLink to="/dashboard/profile" className={sidebarLinkClass} onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                </NavLink>

                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#03373D] transition-all duration-200" onClick={closeSidebar}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F0F0F0]">
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Zadex" className="h-7" />
                                <span className="text-2xl font-black tracking-tight italic"><span className="text-gray-800">Za</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9051] to-emerald-400">DEX</span></span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {isAdmin && (
                                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#03373D]/10 text-[#03373D] uppercase tracking-wider">
                                    Admin
                                </span>
                            )}
                            {!isAdmin && isRider && (
                                <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                                    Rider
                                </span>
                            )}
                            <Link
                                to="/"
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#03373D] transition hidden sm:flex items-center justify-center"
                                title="Back to Home"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-400">{user?.email}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.displayName?.charAt(0)?.toUpperCase() || 'U'
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeSidebar}></div>
                )}

                <aside className={`fixed lg:sticky top-16 left-0 z-50 lg:z-auto h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-100 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                    <div className="flex flex-col h-full p-5">
                        <div className={`rounded-2xl p-4 mb-6 text-white ${isAdmin ? 'bg-linear-to-br from-[#1a1a2e] to-[#16213e]' : isRider ? 'bg-linear-to-br from-[#7c2d12] to-[#c2410c]' : 'bg-linear-to-br from-[#03373D] to-[#025a63]'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg overflow-hidden">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.displayName?.charAt(0)?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-sm truncate">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-white/60 truncate">{user?.email}</p>
                                </div>
                                {isAdmin && <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-white/15 uppercase tracking-wider shrink-0">Admin</span>}
                                {!isAdmin && isRider && <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-white/15 uppercase tracking-wider shrink-0">Rider</span>}
                            </div>
                        </div>

                        {isAdminLoading || isRoleLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <svg className="w-6 h-6 animate-spin text-gray-300" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            </div>
                        ) : isAdmin ? (
                            renderAdminNav()
                        ) : isRider ? (
                            renderRiderNav()
                        ) : (
                            renderUserNav()
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 w-full cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 p-6 lg:p-10 min-h-[calc(100vh-4rem)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
