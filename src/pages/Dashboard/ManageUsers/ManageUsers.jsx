import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { user: currentUser } = useAuth();

    // Filter & Search
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');

    // Toast
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };

    // Modals
    const [editModal, setEditModal] = useState({ show: false, user: null });
    const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
    const [disableModal, setDisableModal] = useState({ show: false, user: null });
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    // Three-dot menu
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch all users
    const { data: users = [], refetch, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    // Fetch all parcels for stats
    const { data: parcels = [] } = useQuery({
        queryKey: ['all-parcels-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/all-parcels');
            return res.data;
        }
    });

    // Calculate parcel counts per user
    const getUserParcelStats = (userEmail) => {
        const userParcels = parcels.filter(p => p.email === userEmail);
        const delivered = userParcels.filter(p => p.status?.toLowerCase() === 'delivered');
        return { total: userParcels.length, delivered: delivered.length };
    };

    // Calculate rider delivery stats
    const getRiderDeliveryStats = (riderEmail) => {
        const assigned = parcels.filter(p => p.assignedRider === riderEmail);
        const delivered = assigned.filter(p => p.status?.toLowerCase() === 'delivered');
        return { total: assigned.length, delivered: delivered.length };
    };

    // Get user's district from their parcels
    const getUserDistrict = (userEmail, role) => {
        if (role === 'admin') return 'Headquarters';
        if (role === 'rider') {
            const riderParcels = parcels.filter(p => p.assignedRider === userEmail);
            if (riderParcels.length > 0) return riderParcels[0].senderDistrict || riderParcels[0].receiverDistrict;
        } else {
            const userParcels = parcels.filter(p => p.email === userEmail);
            if (userParcels.length > 0) return userParcels[0].senderDistrict;
        }
        return null;
    };

    const isSelf = (user) => user.email === currentUser?.email;

    // ── Role change via dropdown ─────────────────────────────
    const handleRoleChange = (user, newRole) => {
        if (isSelf(user)) return;
        if (newRole === user.role) return;

        const endpoint = newRole === 'admin'
            ? `/users/make-admin/${user._id}`
            : newRole === 'rider'
                ? `/users/make-rider/${user._id}`
                : `/users/make-user/${user._id}`;

        axiosSecure.patch(endpoint)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    showToast('success', `${user.name} is now a ${newRole}!`);
                    refetch();
                }
            })
            .catch(() => showToast('error', 'Failed to change role. Try again.'));
    };

    // ── Toggle Disable / Enable (with confirmation modal) ────
    const handleDisableConfirm = () => {
        const user = disableModal.user;
        if (!user) return;
        setIsProcessing(true);
        const newDisabled = !user.disabled;
        axiosSecure.patch(`/users/disable/${user._id}`, { disabled: newDisabled })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    showToast('success', `${user.name} has been ${newDisabled ? 'disabled' : 'enabled'}.`);
                    setDisableModal({ show: false, user: null });
                    refetch();
                }
            })
            .catch(() => showToast('error', 'Action failed. Try again.'))
            .finally(() => setIsProcessing(false));
    };

    // ── Open Edit Modal ──────────────────────────────────────
    const openEdit = (user) => {
        setEditForm({ name: user.name || '', email: user.email || '', role: user.role || 'user' });
        setEditModal({ show: true, user });
        setOpenMenuId(null);
    };

    // ── Save Edit ────────────────────────────────────────────
    const handleSaveEdit = async () => {
        setIsProcessing(true);
        try {
            const res = await axiosSecure.put(`/users/${editModal.user._id}`, editForm);
            if (res.data.modifiedCount > 0) {
                showToast('success', `${editForm.name}'s profile updated!`);
                setEditModal({ show: false, user: null });
                refetch();
            } else {
                showToast('success', 'No changes detected.');
                setEditModal({ show: false, user: null });
            }
        } catch {
            showToast('error', 'Failed to update user. Try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Delete User ──────────────────────────────────────────
    const handleDelete = async () => {
        setIsProcessing(true);
        try {
            const res = await axiosSecure.delete(`/users/${deleteModal.user._id}`);
            if (res.data.deletedCount > 0) {
                showToast('success', `${deleteModal.user.name} has been removed.`);
                setDeleteModal({ show: false, user: null });
                refetch();
            }
        } catch {
            showToast('error', 'Failed to delete user. Try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // ── Filtering ────────────────────────────────────────────
    const normalizedSearch = search.trim().toLowerCase();
    const filteredUsers = users.filter(u => {
        // Tab filter
        if (activeTab === 'user' && (u.role || 'user') !== 'user') return false;
        if (activeTab === 'rider' && u.role !== 'rider') return false;
        if (activeTab === 'admin' && u.role !== 'admin') return false;
        if (activeTab === 'blocked' && !u.disabled) return false;

        // Search filter
        if (normalizedSearch) {
            return [u.name, u.email, u.phone]
                .some(val => (val || '').toLowerCase().includes(normalizedSearch));
        }
        return true;
    });

    // Tab config
    const tabs = [
        { key: 'all', label: 'All Users', count: users.length, color: 'bg-[#03373D]' },
        { key: 'user', label: 'Users', count: users.filter(u => (u.role || 'user') === 'user').length, color: 'bg-gray-500' },
        { key: 'rider', label: 'Riders', count: users.filter(u => u.role === 'rider').length, color: 'bg-emerald-500' },
        { key: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'bg-purple-500' },
        { key: 'blocked', label: 'Blocked', count: users.filter(u => u.disabled).length, color: 'bg-red-500' },
    ];

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // ─── Loading / Error ─────────────────────────────────────
    if (isLoading) return (
        <div className="space-y-6">
            <div className="animate-pulse space-y-2">
                <div className="w-48 h-8 bg-gray-100 rounded-lg"></div>
                <div className="w-64 h-3 bg-gray-50 rounded-full"></div>
            </div>
            <div className="flex gap-2">
                {[1,2,3,4,5].map(i => <div key={i} className="w-24 h-9 bg-gray-100 rounded-xl animate-pulse"></div>)}
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-14 bg-gray-50 border-b border-gray-100"></div>
                <div className="p-6 space-y-4">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
                </div>
            </div>
        </div>
    );

    if (isError) return (
        <div className="bg-red-50 p-6 rounded-2xl text-red-600 text-center">
            <p>Failed to load users.</p>
            <button onClick={() => refetch()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl cursor-pointer">Retry</button>
        </div>
    );

    return (
        <div className="space-y-6 relative">

            {/* Toast */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all ${
                    toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {toast.type === 'success'
                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    }
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Edit, disable, or change roles for registered users</p>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    Showing <span className="font-bold text-gray-700">{filteredUsers.length}</span> of <span className="font-bold text-gray-700">{users.length}</span> users
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                            activeTab === tab.key
                                ? `${tab.color} text-white shadow-lg`
                                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 shadow-sm'
                        }`}
                    >
                        {tab.label}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                            activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
                        }`}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 w-full md:w-96 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto">
                {/* Table Header */}
                <div className="sticky top-0 z-10 grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest items-center min-w-275">
                    <div>User</div>
                    <div>Phone</div>
                    <div>Joined</div>
                    <div>District</div>
                    <div>Parcels</div>
                    <div>Role</div>
                    <div>Set Role</div>
                    <div>Status</div>
                    <div className="text-right">⋯</div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="p-16 text-center min-w-275">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No users match your filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 pb-32">
                        {filteredUsers.map((user, index) => {
                            const isAdmin = user.role === 'admin';
                            const stats = user.role === 'rider'
                                ? getRiderDeliveryStats(user.email)
                                : getUserParcelStats(user.email);
                            const district = getUserDistrict(user.email, user.role);
                            const self = isSelf(user);
                            const isLastItem = index >= filteredUsers.length - 2 && filteredUsers.length > 3;

                            return (
                                <div key={user._id} className={`grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-3 px-6 py-4 items-center transition-colors min-w-275 ${user.disabled ? 'bg-gray-50/70 opacity-60' : 'hover:bg-gray-50/50'}`}>

                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                                            user.role === 'admin' ? 'bg-purple-500' : user.role === 'rider' ? 'bg-emerald-600' : 'bg-[#03373D]'
                                        }`}>
                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                {self && <span className="text-[8px] font-black bg-[#03373D] text-white px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">You</span>}
                                            </div>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="col-span-1">
                                        <p className="text-xs text-gray-600 font-medium">{user.phone || '—'}</p>
                                    </div>

                                    {/* Joined */}
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold">{formatDate(user.registrationDate)}</p>
                                    </div>

                                    {/* District */}
                                    <div>
                                        {isAdmin ? (
                                            <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-tighter">System</span>
                                        ) : district ? (
                                            <span className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md">{district}</span>
                                        ) : (
                                            <span className="text-[10px] text-gray-300">—</span>
                                        )}
                                    </div>

                                    {/* Parcels */}
                                    <div>
                                        {!isAdmin ? (
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-gray-900 leading-none">{stats.total}</p>
                                                <p className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">{stats.delivered} done</p>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">N/A</span>
                                        )}
                                    </div>

                                    {/* Role Badge */}
                                    <div>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            user.role === 'admin'  ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'rider'  ? 'bg-emerald-100 text-emerald-700' :
                                                                      'bg-gray-100 text-gray-600'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </div>

                                    {/* Role Dropdown */}
                                    <div>
                                        <select
                                            value={user.role || 'user'}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            disabled={self}
                                            className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 cursor-pointer transition ${
                                                self ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-200 hover:border-[#03373D]/30'
                                            }`}
                                        >
                                            <option value="user">User</option>
                                            <option value="rider">Rider</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                            user.disabled ? 'bg-red-100 text-red-600' : 'bg-emerald-50 text-emerald-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.disabled ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                                            {user.disabled ? 'Blocked' : 'Active'}
                                        </span>
                                    </div>

                                    {/* 3-dot Menu */}
                                    <div className="flex justify-end relative" ref={openMenuId === user._id ? menuRef : null}>
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)}
                                            className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                                        >
                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="5" r="1.5"/>
                                                <circle cx="12" cy="12" r="1.5"/>
                                                <circle cx="12" cy="19" r="1.5"/>
                                            </svg>
                                        </button>

                                        {openMenuId === user._id && (
                                            <div className={`absolute ${isLastItem ? 'bottom-12' : 'top-12'} right-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 py-2 overflow-hidden animate-[fadeInUp_0.2s_ease-out]`}>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => openEdit(user)}
                                                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    Edit Profile
                                                </button>

                                                {/* Disable / Enable */}
                                                {!self && (
                                                    <button
                                                        onClick={() => { setDisableModal({ show: true, user }); setOpenMenuId(null); }}
                                                        className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                                                            user.disabled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-600 hover:bg-orange-50'
                                                        }`}
                                                    >
                                                        {user.disabled ? (
                                                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Enable User</>
                                                        ) : (
                                                            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>Disable User</>
                                                        )}
                                                    </button>
                                                )}

                                                {/* Delete */}
                                                {!self && (
                                                    <>
                                                        <div className="border-t border-gray-100 my-1"></div>
                                                        <button
                                                            onClick={() => { setDeleteModal({ show: true, user }); setOpenMenuId(null); }}
                                                            className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition cursor-pointer"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Delete User
                                                        </button>
                                                    </>
                                                )}

                                                {self && (
                                                    <div className="px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        Can&apos;t modify yourself
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────── */}
            {editModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Updating: {editModal.user?.email}</p>
                            </div>
                            <button onClick={() => setEditModal({ show: false, user: null })} className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Email</label>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] cursor-pointer transition"
                                >
                                    <option value="user">User</option>
                                    <option value="rider">Rider</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setEditModal({ show: false, user: null })}
                                disabled={isProcessing}
                                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isProcessing}
                                className="px-8 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-[#03373D] hover:bg-[#025a63] rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                            >
                                {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                {isProcessing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Disable/Enable Confirm Modal ────────────────────── */}
            {disableModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-8 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${disableModal.user?.disabled ? 'bg-emerald-100' : 'bg-orange-100'}`}>
                                {disableModal.user?.disabled ? (
                                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                ) : (
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {disableModal.user?.disabled ? 'Enable User?' : 'Disable User?'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {disableModal.user?.disabled
                                    ? <>Are you sure you want to re-enable <span className="font-bold text-gray-800">{disableModal.user?.name}</span>? They will regain access to the platform.</>
                                    : <>Are you sure you want to disable <span className="font-bold text-gray-800">{disableModal.user?.name}</span>? They will lose access to the platform.</>
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    disabled={isProcessing}
                                    onClick={handleDisableConfirm}
                                    className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                                        disableModal.user?.disabled ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                    }`}
                                >
                                    {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    {isProcessing ? 'Processing...' : disableModal.user?.disabled ? 'Yes, Enable' : 'Yes, Disable'}
                                </button>
                                <button
                                    disabled={isProcessing}
                                    onClick={() => setDisableModal({ show: false, user: null })}
                                    className="w-full py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ────────────────────────────── */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User?</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to permanently delete <span className="font-bold text-gray-800">{deleteModal.user?.name}</span>? This cannot be undone.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    disabled={isProcessing}
                                    onClick={handleDelete}
                                    className="w-full py-4 rounded-2xl text-white font-bold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    {isProcessing ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                                <button
                                    disabled={isProcessing}
                                    onClick={() => setDeleteModal({ show: false, user: null })}
                                    className="w-full py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
