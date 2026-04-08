import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import CountUp from 'react-countup';

const AdminStatistics = () => {
    const axiosSecure = useAxiosSecure();
    const [stats, setStats] = useState({
        totalParcels: 0,
        todayParcels: 0,
        activeRiders: 0,
        totalUsers: 0,
        totalEarnings: 0,
        deliveredCount: 0,
        pendingCount: 0,
        shippedCount: 0,
    });
    const [recentParcels, setRecentParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ weight: '', parcelName: '' });

    // Pricing logic
    const basePrices = {
        document: 50, small: 80, medium: 120, large: 180,
        fragile: 150, liquid: 160, electronics: 200,
    };

    const weightMultiplier = (weight) => {
        if (weight <= 0.5) return 1;
        if (weight <= 1) return 1.2;
        if (weight <= 3) return 1.5;
        if (weight <= 5) return 1.8;
        if (weight <= 10) return 2.2;
        return 2.8;
    };

    const calculateDeliveryCost = (parcelType, senderDistrict, receiverDistrict, weight) => {
        const base = basePrices[parcelType] || 80;
        const wMultiplier = weightMultiplier(weight);
        const isSameCity = senderDistrict === receiverDistrict;
        const distanceMultiplier = isSameCity ? 1 : 1.6;
        const total = Math.ceil(base * wMultiplier * distanceMultiplier);
        return total;
    };

    const fetchStats = useCallback(async () => {
        try {
            const [parcelsRes, usersRes] = await Promise.all([
                axiosSecure.get('/all-parcels'),
                axiosSecure.get('/users'),
            ]);

            const parcels = parcelsRes.data;
            const users = usersRes.data;

            const today = new Date().toISOString().split('T')[0];
            const todayParcels = parcels.filter(p => p.createdAt?.startsWith(today) || p.bookingDate?.startsWith(today));

            const delivered = parcels.filter(p => p.status?.toLowerCase() === 'delivered');
            const pending = parcels.filter(p => p.status?.toLowerCase() === 'pending');
            const shipped = parcels.filter(p => p.status?.toLowerCase() === 'shipped');
            const activeRiders = users.filter(u => u.role === 'rider' && u.status === 'active');

            const totalEarnings = parcels
                .filter(p => p.paymentStatus === 'paid')
                .reduce((sum, p) => sum + (parseFloat(p.totalCost) || parseFloat(p.price) || 0), 0);

            setStats({
                totalParcels: parcels.length,
                todayParcels: todayParcels.length,
                activeRiders: activeRiders.length,
                totalUsers: users.length,
                totalEarnings,
                deliveredCount: delivered.length,
                pendingCount: pending.length,
                shippedCount: shipped.length,
            });

            // Recent 5 parcels
            const sorted = [...parcels].sort((a, b) => new Date(b.createdAt || b.bookingDate || 0) - new Date(a.createdAt || a.bookingDate || 0));
            setRecentParcels(sorted.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch admin stats:', err);
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleUpdateParcel = async (e) => {
        e.preventDefault();
        if (!selectedParcel) return;

        const weight = parseFloat(editData.weight);
        if (isNaN(weight) || weight <= 0) {
            alert('Please enter a valid weight');
            return;
        }

        const newCost = calculateDeliveryCost(
            selectedParcel.parcelType || 'small',
            selectedParcel.senderDistrict,
            selectedParcel.receiverDistrict,
            weight
        );

        try {
            await axiosSecure.put(`/parcels/${selectedParcel._id}`, {
                parcelName: editData.parcelName,
                parcelWeight: weight,
                totalCost: newCost,
                price: newCost 
            });
            setIsEditModalOpen(false);
            fetchStats();
        } catch (err) {
            console.error('Failed to update parcel:', err);
            alert('Update failed');
        }
    };

    const deliveryRate = stats.totalParcels > 0 ? Math.round((stats.deliveredCount / stats.totalParcels) * 100) : 0;

    // --- Skeleton Components ---
    const CardSkeleton = () => (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 bg-gray-100 rounded-xl"></div>
                <div className="w-16 h-5 bg-gray-100 rounded-md"></div>
            </div>
            <div className="space-y-2 flex flex-col items-end">
                <div className="w-12 h-3 bg-gray-50 rounded-full"></div>
                <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
            </div>
        </div>
    );

    const StatRowSkeleton = () => (
        <div className="flex items-center gap-4 py-4 px-3 animate-pulse border-b border-gray-50">
            <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
            <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-100 rounded-full"></div>
                <div className="w-20 h-2 bg-gray-50 rounded-full"></div>
            </div>
            <div className="w-24 h-4 bg-gray-100 rounded-full"></div>
            <div className="w-16 h-4 bg-gray-50 rounded-full"></div>
            <div className="w-20 h-8 bg-gray-100 rounded-xl"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-2">
                    <div className="w-48 h-8 bg-gray-100 rounded-lg"></div>
                    <div className="w-64 h-3 bg-gray-50 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                            <div className="space-y-1.5">
                                <div className="w-8 h-5 bg-gray-100 rounded-md"></div>
                                <div className="w-20 h-2 bg-gray-50 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100 animate-pulse">
                            <div className="w-24 h-2 bg-gray-200 rounded-full mb-3"></div>
                            <div className="w-32 h-5 bg-gray-200 rounded-md mb-4"></div>
                            <div className="flex justify-between items-end">
                                <div className="w-12 h-8 bg-gray-200 rounded-lg"></div>
                                <div className="w-20 h-4 bg-gray-200/50 rounded-md"></div>
                            </div>
                        </div>
                     ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="space-y-2">
                             <div className="w-48 h-5 bg-gray-100 rounded-md"></div>
                             <div className="w-64 h-2 bg-gray-50 rounded-full"></div>
                        </div>
                        <div className="w-32 h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                    <div className="space-y-4">
                         {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide border-l-2 border-[#03373D] pl-2 mt-0.5">PLATFORM REAL-TIME ANALYTICS</p>
            </div>

            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Total Earnings */}
                <div className="bg-[#03373D] rounded-2xl p-5 text-white shadow-xl shadow-[#03373D]/20 relative overflow-hidden group transition-all hover:scale-[1.02]">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="flex items-center justify-between mb-3 relative">
                        <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-400 text-[#03373D] px-2 py-0.5 rounded-md">Revenue</span>
                    </div>
                    <p className="text-[10px] text-white/50 font-black uppercase tracking-wider mb-0.5 px-0.5">Earnings</p>
                    <p className="text-3xl font-black relative leading-tight tracking-tight">৳<CountUp end={stats.totalEarnings} separator="," duration={2.5} /></p>
                </div>

                {/* Total Parcels */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white shadow-inner shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">+{stats.todayParcels} New</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 px-0.5 text-right">Volume</p>
                    <p className="text-3xl font-black text-gray-900 text-right leading-tight tracking-tight"><CountUp end={stats.totalParcels} duration={2} /></p>
                </div>

                {/* Active Riders */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white shadow-inner shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm text-center">Active</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 px-0.5 text-right">Team</p>
                    <p className="text-3xl font-black text-gray-900 text-right leading-tight tracking-tight"><CountUp end={stats.activeRiders} duration={2} /></p>
                </div>

                {/* Success Rate */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white shadow-inner shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md uppercase tracking-tighter shadow-sm">Rate</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 px-0.5 text-right">Success</p>
                    <p className="text-3xl font-black text-gray-900 text-right leading-tight tracking-tight"><CountUp end={deliveryRate} duration={2} />%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link to="/dashboard/manage-users" className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 transition-all hover:border-purple-200 shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900 leading-none"><CountUp end={stats.totalUsers} duration={2} /></p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Registered Users</p>
                    </div>
                </Link>
                
                <Link to="/dashboard/all-parcels" className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 transition-all hover:border-amber-200 shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900 leading-none"><CountUp end={stats.pendingCount} duration={2} /></p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Pending Orders</p>
                    </div>
                </Link>

                <Link to="/dashboard/all-parcels" className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 transition-all hover:border-blue-200 shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900 leading-none"><CountUp end={stats.shippedCount} duration={2} /></p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Out to Deliver</p>
                    </div>
                </Link>

                <Link to="/dashboard/all-parcels" className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 transition-all hover:border-emerald-200 shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xl font-black text-gray-900 leading-none"><CountUp end={stats.deliveredCount} duration={2} /></p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Completion Goal</p>
                    </div>
                </Link>
            </div>

            {/* Redesigned Parcel Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-amber-50 rounded-2xl p-5 border-l-4 border-amber-400 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-125 transition-transform">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"/></svg>
                    </div>
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-0.5">Queue Status</p>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Pending Approval</h3>
                    <div className="flex items-end justify-between">
                         <p className="text-3xl font-black text-gray-900 leading-none"><CountUp end={stats.pendingCount} duration={2} /></p>
                         <p className="text-[9px] font-black text-amber-600 bg-white/50 px-2 py-0.5 rounded-md">ACTION REQUIRED</p>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border-l-4 border-blue-400 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-125 transition-transform">
                         <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/></svg>
                    </div>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Dispatching</p>
                    <h3 className="text-base font-bold text-gray-900 mb-3">In Field Transit</h3>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-gray-900 leading-none"><CountUp end={stats.shippedCount} duration={2} /></p>
                        <p className="text-[9px] font-black text-blue-600 bg-white/50 px-2 py-0.5 rounded-md">TRACKING LIVE</p>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-5 border-l-4 border-emerald-400 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-125 transition-transform">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"/></svg>
                    </div>
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Efficiency</p>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Delivered Successfully</h3>
                    <div className="flex items-end justify-between">
                        <p className="text-3xl font-black text-gray-900 leading-none"><CountUp end={stats.deliveredCount} duration={2} /></p>
                        <p className="text-[9px] font-black text-emerald-600 bg-white/50 px-2 py-0.5 rounded-md">DAILY GOAL</p>
                    </div>
                </div>
            </div>

            {/* Recent Parcel Activity List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-black text-gray-900">Recent Shipping Activity</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Real-time update of last 5 booked items</p>
                    </div>
                    <a href="/dashboard/all-parcels" className="bg-[#03373D]/5 text-[#03373D] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#03373D] hover:text-white transition-all shadow-sm text-center">View All Parcels</a>
                </div>
                
                {recentParcels.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-50 rounded-2xl">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Waiting for incoming parcels...</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left min-w-[900px]">
                                <thead className="bg-gray-50/50">
                                    <tr className="border-b border-gray-100 uppercase text-[9px] font-black text-gray-400 tracking-widest">
                                        <th className="py-2.5 pl-3">Order Details</th>
                                        <th className="py-2.5">Manifest</th>
                                        <th className="py-2.5">Specs/Rate</th>
                                        <th className="py-2.5">Payment</th>
                                        <th className="py-2.5">Assignment</th>
                                        <th className="py-2.5">Log Status</th>
                                        <th className="py-2.5 text-right pr-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentParcels.map((parcel) => (
                                        <tr key={parcel._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 pl-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-[#03373D]/5 group-hover:text-[#03373D] transition-colors relative shrink-0">
                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                        {parcel.paymentStatus === 'paid' && (
                                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 max-w-45">
                                                        <p className="text-sm font-black text-gray-900 group-hover:text-[#03373D] transition-colors truncate">{parcel.parcelName || parcel.name || 'Unnamed'}</p>
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">TRK: {parcel._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[11px] font-extrabold text-gray-800">{parcel.senderName}</span>
                                                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                        <span className="text-[11px] font-extrabold text-gray-800">{parcel.receiverName}</span>
                                                    </div>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 leading-none">{parcel.senderDistrict} → {parcel.receiverDistrict}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">৳{parcel.totalCost || parcel.price || 0}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{parcel.parcelWeight || parcel.weight || 0} KG Weight</p>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                    parcel.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                    {parcel.paymentStatus || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col">
                                                    {parcel.assignedRider ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-[#03373D] uppercase tracking-tighter">Assigned</span>
                                                            <p className="text-[9px] text-gray-400 font-bold truncate max-w-24">{parcel.assignedRiderName || parcel.assignedRider}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Not Assigned</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                    parcel.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                    parcel.status?.toLowerCase() === 'shipped' ? 'bg-blue-50 text-blue-600' :
                                                    parcel.status?.toLowerCase() === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        parcel.status?.toLowerCase() === 'pending' ? 'bg-amber-400 animate-pulse' :
                                                        parcel.status?.toLowerCase() === 'shipped' ? 'bg-blue-400 animate-pulse' :
                                                        parcel.status?.toLowerCase() === 'delivered' ? 'bg-emerald-400' : 'bg-gray-400'
                                                    }`}></span>
                                                    {parcel.status || 'Received'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right pr-3 flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedParcel(parcel);
                                                        setIsDetailModalOpen(true);
                                                    }}
                                                    className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-[#03373D] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
                                                    title="Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedParcel(parcel);
                                                        setEditData({ 
                                                            parcelName: parcel.parcelName || parcel.name || '', 
                                                            weight: parcel.parcelWeight || parcel.weight || '' 
                                                        });
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="w-9 h-9 rounded-xl bg-gray-100 text-[#03373D] hover:bg-[#03373D] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Mobile/Tablet Card View */}
                        <div className="lg:hidden space-y-4">
                            {recentParcels.map((parcel) => (
                                <div key={parcel._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-3 shadow-sm">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 relative shrink-0 shadow-sm border border-gray-100">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                {parcel.paymentStatus === 'paid' && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border border-white rounded-full"></div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-gray-900 truncate">{parcel.parcelName || parcel.name || 'Unnamed'}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">TRK: {parcel._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-black text-gray-900">৳{parcel.totalCost || parcel.price || 0}</p>
                                            <span className={`inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-[8px] font-black uppercase tracking-widest ${
                                                parcel.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {parcel.paymentStatus || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Route</p>
                                            <p className="text-[11px] font-bold text-gray-800 line-clamp-1">{parcel.senderDistrict} → {parcel.receiverDistrict}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Weight</p>
                                            <p className="text-[11px] font-bold text-gray-800">{parcel.parcelWeight || parcel.weight || 0} KG</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Courier</p>
                                            <p className="text-[11px] font-bold text-[#03373D] line-clamp-1">{parcel.assignedRiderName || parcel.assignedRider || 'Unassigned'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Status</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    parcel.status?.toLowerCase() === 'pending' ? 'bg-amber-400 animate-pulse' :
                                                    parcel.status?.toLowerCase() === 'shipped' ? 'bg-blue-400 animate-pulse' :
                                                    parcel.status?.toLowerCase() === 'delivered' ? 'bg-emerald-400' : 'bg-gray-400'
                                                }`}></span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${
                                                    parcel.status?.toLowerCase() === 'pending' ? 'text-amber-600' :
                                                    parcel.status?.toLowerCase() === 'shipped' ? 'text-blue-600' :
                                                    parcel.status?.toLowerCase() === 'delivered' ? 'text-emerald-600' : 'text-gray-500'
                                                }`}>
                                                    {parcel.status || 'Received'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 pt-1">
                                        <button 
                                            onClick={() => {
                                                setSelectedParcel(parcel);
                                                setIsDetailModalOpen(true);
                                            }}
                                            className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-xs font-black cursor-pointer shadow-sm"
                                        >
                                            Details
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setSelectedParcel(parcel);
                                                setEditData({ 
                                                    parcelName: parcel.parcelName || parcel.name || '', 
                                                    weight: parcel.parcelWeight || parcel.weight || '' 
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                            className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-[#03373D] hover:bg-[#03373D] hover:text-white transition-colors text-xs font-black cursor-pointer shadow-sm"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modals are kept the same... */}
            {isDetailModalOpen && selectedParcel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
                        <div className="bg-[#03373D] p-5 sm:p-6 text-white flex flex-row items-center justify-between shrink-0 gap-4">
                            <div className="min-w-0">
                                <h2 className="text-lg sm:text-xl font-black truncate">Parcel Details</h2>
                                <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-widest mt-1 truncate">Order Ref: {selectedParcel._id}</p>
                            </div>
                            <button onClick={() => setIsDetailModalOpen(false)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer shrink-0">
                                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parcel Contents</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedParcel.parcelName || selectedParcel.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{selectedParcel.parcelType}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                                        <p className="text-sm font-bold text-gray-700">{selectedParcel.parcelWeight || selectedParcel.weight} KG</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery Cost</p>
                                        <p className="text-sm font-bold text-[#03373D]">৳{selectedParcel.totalCost || selectedParcel.price}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Route Manifest</p>
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                                        <div className="text-center">
                                            <p className="text-[11px] font-black text-gray-900">{selectedParcel.senderDistrict}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Origin</p>
                                        </div>
                                        <div className="flex-1 px-4 flex items-center justify-center">
                                            <div className="w-full h-px border-t border-dashed border-gray-300 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#03373D] rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[11px] font-black text-gray-900">{selectedParcel.receiverDistrict}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Destination</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Information</p>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 uppercase font-black text-xs">S</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{selectedParcel.senderName}</p>
                                                <p className="text-[10px] text-gray-500">{selectedParcel.senderPhone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 uppercase font-black text-xs">R</div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-800">{selectedParcel.receiverName}</p>
                                                <p className="text-[10px] text-gray-500">{selectedParcel.receiverPhone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Tracking</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#03373D]/5 text-[#03373D] text-[10px] font-black uppercase tracking-widest">
                                        {selectedParcel.status || 'Received'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedParcel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300 border border-gray-100 flex flex-col max-h-[90vh]">
                        <div className="p-5 sm:p-6 border-b border-gray-50 flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-black text-gray-900">Modify Parcel</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateParcel} className="p-5 sm:p-8 space-y-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parcel Name</label>
                                    <input 
                                        type="text"
                                        value={editData.parcelName}
                                        onChange={(e) => setEditData({...editData, parcelName: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 transition"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight (KG)</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={editData.weight}
                                        onChange={(e) => setEditData({...editData, weight: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 transition"
                                    />
                                </div>
                                <p className="text-[10px] text-amber-600 font-bold bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 flex items-center gap-2">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Cost will be recalculated automatically based on new weight.
                                </p>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase text-gray-400 tracking-widest hover:bg-gray-50 rounded-xl transition cursor-pointer">Cancel</button>
                                <button type="submit" className="flex-2 py-3 bg-[#03373D] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#03373D]/20 hover:scale-[1.02] transition cursor-pointer">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStatistics;
