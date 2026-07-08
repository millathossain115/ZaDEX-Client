import React, { useState } from 'react';
import RiderAccessGate from '../_shared/RiderAccessGate';
import { RiderDashboardLoader } from '../../../components/ui';
import useRiderDashboardData from '../_shared/useRiderDashboardData';
import { formatCurrency, formatDate } from '../_shared/riderUtils';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const RiderOverview = () => {
    const { stats, deliveryList, ongoingTasks, transactions, completedTasks, loading, error, refetch } = useRiderDashboardData();
    const axiosSecure = useAxiosSecure();
    const [actionLoading, setActionLoading] = useState(null);

    const handleUpdateStatus = async (parcel, actionType) => {
        try {
            setActionLoading(parcel._id);
            let updates = {};
            if (actionType === 'accept') {
                updates = { status: 'accepted', riderDecision: 'accepted' };
            } else if (actionType === 'decline') {
                updates = { assignedRider: null, riderDecision: 'declined', status: 'pending' }; 
            } else if (actionType === 'pickedUp') {
                updates = { status: 'shipped' }; 
            } else if (actionType === 'delivered') {
                updates = { status: 'delivered', deliveredAt: new Date().toISOString() };
            }

            if (actionType === 'pickedUp' || actionType === 'delivered') {
                await axiosSecure.put(`/parcels/status/${parcel._id}`, { status: updates.status });
                if (updates.deliveredAt) {
                    await axiosSecure.put(`/parcels/${parcel._id}`, { deliveredAt: updates.deliveredAt });
                }
            } else {
                await axiosSecure.put(`/parcels/${parcel._id}`, updates);
            }
            
            refetch();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <RiderAccessGate>
                <RiderDashboardLoader />
            </RiderAccessGate>
        );
    }

    if (error) {
        return (
            <RiderAccessGate>
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                    {error}
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-4 pb-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage active deliveries and earnings.</p>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        {stats.totalAssigned} assigned jobs
                    </div>
                </div>

                {/* 1. Top-Level Statistics (KPI Cards) */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                    <StatCard 
                        title="Today's Earnings" 
                        value={formatCurrency(stats.todaysEarnings)} 
                        accent="emerald"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        }
                    />
                    <StatCard 
                        title="Active Tasks" 
                        value={stats.ongoingCount} 
                        accent="sky"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        }
                    />
                    <StatCard 
                        title="Total Deliveries" 
                        value={stats.completedCount} 
                        accent="amber"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        }
                    />
                    <StatCard 
                        title="Average Rating" 
                        value={`${stats.averageRating} ⭐`} 
                        accent="slate"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                        }
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-4">
                    {/* Left Column: Inbox & Active */}
                    <div className="space-y-4">
                        {/* 2. New Assignments Queue */}
                        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold text-gray-900">New Assignments</h2>
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{deliveryList.length}</span>
                                </div>
                                <p className="hidden sm:block text-xs text-gray-400">Waiting for rider decision</p>
                            </div>
                            
                            {deliveryList.length === 0 ? (
                                <div className="p-6 text-center">
                                    <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">No new assignments right now.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {deliveryList.map((parcel) => (
                                        <div key={parcel._id} className="p-3 transition hover:bg-gray-50/80">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                                                <div className="min-w-0 lg:w-44">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parcel #{parcel._id.slice(-6)}</span>
                                                    <h3 className="font-black text-base text-gray-900 mt-0.5">Earn {formatCurrency(parcel.riderReward)}</h3>
                                                </div>
                                                <div className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-black uppercase self-start lg:self-auto">
                                                    {parcel.parcelWeight} kg
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-w-0 text-sm">
                                                    <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                                            Pickup
                                                        </p>
                                                        <p className="font-semibold text-gray-900 truncate">{parcel.senderArea}, {parcel.senderDistrict}</p>
                                                    </div>
                                                    <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                                            Drop-off
                                                        </p>
                                                        <p className="font-semibold text-gray-900 truncate">{parcel.receiverArea}, {parcel.receiverDistrict}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 lg:w-56">
                                                    <button 
                                                        disabled={actionLoading === parcel._id}
                                                        onClick={() => handleUpdateStatus(parcel, 'accept')}
                                                        className="flex-1 bg-[#03373D] text-white py-2 rounded-lg text-xs font-black hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/25 active:translate-y-0 active:scale-[0.98] transition-all flex justify-center items-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                                                    >
                                                        {actionLoading === parcel._id ? <Spinner /> : 'Accept'}
                                                    </button>
                                                    <button 
                                                        disabled={actionLoading === parcel._id}
                                                        onClick={() => handleUpdateStatus(parcel, 'decline')}
                                                        className="flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-black hover:bg-red-500 hover:text-white hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 active:translate-y-0 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                                                    >
                                                        {actionLoading === parcel._id ? null : 'Decline'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 3. Ongoing Tasks */}
                        <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold text-gray-900">Ongoing Tasks</h2>
                                    <span className={ongoingTasks.length > 0 ? "bg-sky-100 text-sky-800 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse" : "bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full"}>{ongoingTasks.length}</span>
                                </div>
                                <p className="hidden sm:block text-xs text-gray-400">Pickup and delivery workflow</p>
                            </div>

                            {ongoingTasks.length === 0 ? (
                                <div className="p-6 text-center">
                                    <div className="bg-sky-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">You have no active deliveries.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 p-3">
                                    {ongoingTasks.map(parcel => {
                                        // Calculate if pending > 4 hours
                                        const updateTime = new Date(parcel.updatedAt || parcel.createdAt || Date.now());
                                        const pendingForMs = Date.now() - updateTime.getTime();
                                        const isUrgent = pendingForMs > 4 * 60 * 60 * 1000; // > 4 hours

                                        return (
                                            <div key={parcel._id} className="rounded-xl border-l-4 border-[#03373D] border-y border-r border-y-gray-100 border-r-gray-100 p-3 shadow-sm transition hover:shadow-md">
                                                <div className="flex justify-between items-start gap-3 mb-2.5 border-b border-gray-100 pb-2.5">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="bg-[#03373D]/10 text-[#03373D] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                                                                {parcel.parcelType || 'Standard'}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${parcel.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {parcel.paymentStatus === 'Paid' ? 'PAID' : 'COD'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1.5 font-medium truncate">ID: {parcel._id}</p>
                                                    </div>
                                                    {isUrgent && (
                                                        <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md text-xs font-bold animate-pulse shrink-0">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                            Urgent
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2.5">
                                                    {/* Sender */}
                                                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pickup</p>
                                                            <a href={`tel:${parcel.senderPhone}`} className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:translate-y-0 active:scale-[0.98] transition-all">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                Call
                                                            </a>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 truncate">{parcel.senderName}</p>
                                                        <div className="flex items-start gap-1.5 mt-0.5">
                                                            <MapIcon url={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parcel.senderAddress + ' ' + parcel.senderArea)}`} />
                                                            <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{parcel.senderAddress}, {parcel.senderArea}</p>
                                                        </div>
                                                    </div>

                                                    {/* Receiver */}
                                                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                                                            <a href={`tel:${parcel.receiverPhone}`} className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-600 hover:text-white hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:translate-y-0 active:scale-[0.98] transition-all">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                Call
                                                            </a>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900 truncate">{parcel.receiverName}</p>
                                                        <div className="flex items-start gap-1.5 mt-0.5">
                                                            <MapIcon url={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parcel.receiverAddress + ' ' + parcel.receiverArea)}`} />
                                                            <p className="text-xs text-gray-600 line-clamp-2 leading-tight">{parcel.receiverAddress}, {parcel.receiverArea}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Live Status Button */}
                                                <div className="flex justify-end">
                                                    {parcel.status === 'accepted' ? (
                                                        <button 
                                                            disabled={actionLoading === parcel._id}
                                                            onClick={() => handleUpdateStatus(parcel, 'pickedUp')}
                                                            className="w-full sm:w-auto bg-amber-500 text-white font-bold px-5 py-2 rounded-lg shadow-sm hover:bg-sky-600 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500/25 active:translate-y-0 active:scale-[0.98] transition-all flex justify-center items-center h-9 text-xs disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                                                        >
                                                            {actionLoading === parcel._id ? <Spinner /> : 'Mark as Picked Up'}
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            disabled={actionLoading === parcel._id}
                                                            onClick={() => handleUpdateStatus(parcel, 'delivered')}
                                                            className="w-full sm:w-auto bg-[#03373D] text-white font-bold px-5 py-2 rounded-lg shadow-sm hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/25 active:translate-y-0 active:scale-[0.98] transition-all flex justify-center items-center h-9 text-xs disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                                                        >
                                                            {actionLoading === parcel._id ? <Spinner /> : 'Mark as Delivered'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Wallet & Payouts */}
                    <div>
                        <section className="bg-gradient-to-br from-[#03373D] to-[#025a63] rounded-xl p-4 text-white shadow-lg sticky top-6">
                            <h2 className="text-xs font-black text-white/70 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Finance
                            </h2>
                            
                            <div className="mb-4">
                                <p className="text-xs text-white/70">Available Balance</p>
                                <p className="text-3xl font-black mt-0.5 leading-none">{formatCurrency(stats.currentBalance)}</p>
                            </div>
                            
                            <button className="w-full bg-white text-[#03373D] font-black py-2.5 rounded-lg hover:bg-emerald-400 hover:text-[#03373D] hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300/40 active:translate-y-0 active:scale-[0.98] transition-all shadow-sm mb-5 text-sm cursor-pointer">
                                Request Withdrawal
                            </button>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 border-b border-white/10 pb-2">Recent Transfers</h3>
                                    {transactions.length === 0 ? (
                                        <p className="text-xs text-white/50 italic">No recent withdrawals.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {transactions.slice(0, 3).map((tx, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm gap-3">
                                                    <div>
                                                        <p className="font-medium">{formatDate(tx.date || tx.createdAt)}</p>
                                                        <p className="text-xs text-white/60">{tx.status || 'Success'}</p>
                                                    </div>
                                                    <p className="font-bold">{formatCurrency(tx.amount)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 border-b border-white/10 pb-2">Latest Earnings</h3>
                                    {completedTasks.length === 0 ? (
                                        <p className="text-xs text-white/50 italic">No earnings yet.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {completedTasks.slice(0, 5).map(parcel => (
                                                <div key={parcel._id} className="flex justify-between items-center text-sm gap-3">
                                                    <p className="font-medium truncate pr-2" title={`Parcel #${parcel._id}`}>#{parcel._id.slice(-6)}</p>
                                                    <p className="font-bold text-emerald-300">+{formatCurrency(parcel.riderReward)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </RiderAccessGate>
    );
};

const StatCard = ({ title, value, accent, icon }) => {
    const tones = {
        amber: 'from-amber-50 to-orange-50 text-amber-700 border-amber-100',
        sky: 'from-sky-50 to-cyan-50 text-sky-700 border-sky-100',
        emerald: 'from-emerald-50 to-green-50 text-emerald-700 border-emerald-100',
        slate: 'from-slate-50 to-gray-100 text-slate-700 border-slate-200',
    };

    const iconBgTones = {
        amber: 'bg-amber-100/50 text-amber-700',
        sky: 'bg-sky-100/50 text-sky-700',
        emerald: 'bg-emerald-100/50 text-emerald-700',
        slate: 'bg-slate-200/50 text-slate-700',
    };

    return (
        <div className={`bg-gradient-to-br ${tones[accent]} rounded-xl border shadow-sm p-3.5 relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md cursor-default`}>
            <div className="flex justify-between items-start">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-75 mb-1 truncate">{title}</p>
                    <p className="text-xl lg:text-2xl font-black leading-tight">{value}</p>
                </div>
                <div className={`p-2 rounded-lg shrink-0 ${iconBgTones[accent]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const MapIcon = ({ url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#03373D] hover:text-[#025a63] mt-0.5 shrink-0 transition" title="View on Google Maps">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
    </a>
);

export default RiderOverview;
