import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { calculateRiderReward } from '../RiderShared/riderUtils';

const ITEMS_PER_PAGE = 10;

const AllParcels = () => {
    const axiosSecure = useAxiosSecure();
    const [parcels, setParcels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    // Modal & Selection States
    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [bulkAssignModal, setBulkAssignModal] = useState(false);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [editData, setEditData] = useState({ weight: '', parcelName: '' });
    const [selectedRider, setSelectedRider] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

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

    const fetchRiders = useCallback(async () => {
        try {
            const usersRes = await axiosSecure.get('/users');
            const activeRiders = usersRes.data.filter(u => u.role === 'rider' && u.status === 'active');
            setRiders(activeRiders);
        } catch (err) {
            console.error('Failed to fetch riders:', err);
        }
    }, [axiosSecure]);

    const fetchParcels = useCallback(async () => {
        try {
            const res = await axiosSecure.get(`/all-parcels?search=${search}`);
            setParcels(res.data);
        } catch (err) {
            console.error('Failed to fetch parcels:', err);
        } finally {
            setLoading(false);
        }
    }, [axiosSecure, search]);

    // Initial fetch for riders
    useEffect(() => {
        fetchRiders();
    }, [fetchRiders]);

    // Re-fetch parcels every time 'search' changes
    useEffect(() => {
        fetchParcels();
    }, [fetchParcels]);

    // Reset selection when filters change
    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]);
    }, [filter, dateFilter, search]);

    // ---- Date filter helpers ----
    const isToday = (dateStr) => {
        if (!dateStr) return false;
        const today = new Date();
        const d = new Date(dateStr);
        return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    };
    const isLast7Days = (dateStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const d = new Date(dateStr);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
    };
    const isThisMonth = (dateStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const d = new Date(dateStr);
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    };
    const isThisYear = (dateStr) => {
        if (!dateStr) return false;
        const now = new Date();
        const d = new Date(dateStr);
        return d.getFullYear() === now.getFullYear();
    };
    const matchesDateFilter = (parcel) => {
        if (dateFilter === 'all') return true;
        const dateStr = parcel.createdAt || parcel.bookingDate || parcel.pickupDate;
        switch (dateFilter) {
            case 'today': return isToday(dateStr);
            case '7days': return isLast7Days(dateStr);
            case 'month': return isThisMonth(dateStr);
            case 'year': return isThisYear(dateStr);
            default: return true;
        }
    };
    const filteredParcels = parcels.filter(p => {
        const matchesStatus = filter === 'all' || p.status?.toLowerCase() === filter;
        // Search is now handled server-side, but we keep this as a secondary safety check
        // or clear it if you want to rely 100% on server results.
        // Given the request, we should probably still allow client filters (status/date) to work on the fetched subset.
        return matchesStatus && matchesDateFilter(p);
    });
    const totalPages = Math.ceil(filteredParcels.length / ITEMS_PER_PAGE);
    const paginatedParcels = filteredParcels.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    // ---- Selection Handlers ----
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(paginatedParcels.map(p => p._id));
        } else {
            setSelectedIds([]);
        }
    };
    const handleSelectRow = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // ---- Bulk Actions ----
    const handleBulkCancel = async () => {
        if (!window.confirm(`Are you sure you want to cancel/delete ${selectedIds.length} parcels?`)) return;
        try {
            await Promise.all(selectedIds.map(id => axiosSecure.delete(`/parcels/${id}`)));
            setSelectedIds([]);
            fetchParcels();
        } catch (err) {
            console.error('Bulk delete failed:', err);
            alert('Bulk action failed');
        }
    };

    const handleBulkAssign = async (e) => {
        e.preventDefault();
        if (!selectedRider || selectedIds.length === 0) return;
        const rider = riders.find(r => r.email === selectedRider);
        if (!rider) return;

        try {
            await Promise.all(selectedIds.map(id => 
                axiosSecure.put(`/parcels/${id}`, {
                    assignedRider: rider.email,
                    assignedRiderName: rider.name || rider.displayName,
                    riderReward: calculateRiderReward(parcels.find(parcel => parcel._id === id) || {}),
                    riderDecision: 'pending',
                    status: 'assigned',
                    assignedAt: new Date().toISOString(),
                })
            ));
            setBulkAssignModal(false);
            setSelectedIds([]);
            fetchParcels();
        } catch (err) {
            console.error('Bulk assign failed:', err);
            alert('Bulk assignment failed');
        }
    };

    // ---- Individual Handlers ----
    const handleUpdateParcel = async (e) => {
        e.preventDefault();
        const weight = parseFloat(editData.weight);
        if (isNaN(weight) || weight <= 0) return;
        const newCost = calculateDeliveryCost(selectedParcel.parcelType || 'small', selectedParcel.senderDistrict, selectedParcel.receiverDistrict, weight);
        try {
            await axiosSecure.put(`/parcels/${selectedParcel._id}`, { parcelName: editData.parcelName, parcelWeight: weight, totalCost: newCost, price: newCost });
            setEditModal(false);
            fetchParcels();
        } catch (err) { console.error(err); }
    };



    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'assigned': return 'bg-violet-100 text-violet-700 border-violet-200';
            case 'accepted': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    const getPaymentStatusColor = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const statusFilterCards = [
        {
            key: 'all',
            label: 'All Parcels',
            count: parcels.length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            colors: {
                bg: 'bg-white',
                activeBg: 'bg-[#03373D]',
                shadow: 'shadow-sm',
                activeShadow: 'shadow-xl shadow-[#03373D]/20',
                iconBg: 'bg-[#03373D]/10',
                iconColor: 'text-[#03373D]',
                activeIconBg: 'bg-white/20',
                activeIconColor: 'text-white',
            },
        },
        {
            key: 'pending',
            label: 'Pending',
            count: parcels.filter(p => p.status?.toLowerCase() === 'pending').length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            colors: {
                bg: 'bg-white',
                activeBg: 'bg-amber-400',
                shadow: 'shadow-sm',
                activeShadow: 'shadow-xl shadow-amber-400/30',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-600',
                activeIconBg: 'bg-white/20',
                activeIconColor: 'text-white',
            },
        },
        {
            key: 'shipped',
            label: 'Shipped',
            count: parcels.filter(p => p.status?.toLowerCase() === 'shipped').length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            ),
            colors: {
                bg: 'bg-white',
                activeBg: 'bg-sky-500',
                shadow: 'shadow-sm',
                activeShadow: 'shadow-xl shadow-sky-500/30',
                iconBg: 'bg-sky-100',
                iconColor: 'text-sky-600',
                activeIconBg: 'bg-white/20',
                activeIconColor: 'text-white',
            },
        },
        {
            key: 'delivered',
            label: 'Delivered',
            count: parcels.filter(p => p.status?.toLowerCase() === 'delivered').length,
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            colors: {
                bg: 'bg-white',
                activeBg: 'bg-emerald-500',
                shadow: 'shadow-sm',
                activeShadow: 'shadow-xl shadow-emerald-500/30',
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-600',
                activeIconBg: 'bg-white/20',
                activeIconColor: 'text-white',
            },
        },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                 <div className="animate-pulse space-y-2">
                    <div className="w-64 h-9 bg-gray-100 rounded-xl"></div>
                    <div className="w-96 h-4 bg-gray-50 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-50 shadow-sm animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="w-12 h-6 bg-gray-100 rounded-md"></div>
                                    <div className="w-20 h-3 bg-gray-50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center animate-pulse">
                    <div className="w-48 h-10 bg-gray-100 rounded-xl"></div>
                    <div className="w-72 h-10 bg-gray-100 rounded-xl"></div>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    <div className="h-14 bg-gray-50 border-b border-gray-100 mb-4 px-8 flex items-center gap-10">
                         {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="flex-1 h-3 bg-gray-200 rounded-full"></div>)}
                    </div>
                    <div className="p-8 space-y-6">
                         {[1, 2, 3, 4, 5].map(i => (
                             <div key={i} className="h-16 bg-gray-50 rounded-2xl border border-gray-100"></div>
                         ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-MAX bg-[#03373D] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10">
                    <div className="flex items-center gap-3">
                         <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">{selectedIds.length}</span>
                         <span className="text-xs font-black uppercase tracking-widest text-white/70">Selected</span>
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setSelectedRider(''); setBulkAssignModal(true); }}
                            className="bg-emerald-400 text-[#03373D] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-300 transition-all cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                            Bulk Assign
                        </button>
                        <button 
                            onClick={handleBulkCancel}
                            className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            Bulk Cancel
                        </button>
                    </div>
                    <button onClick={() => setSelectedIds([])} className="ml-4 p-2 text-white/40 hover:text-white transition cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">All Parcels</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage every parcel currently in the system</p>
                </div>
                <div className="text-sm text-gray-400 font-medium">
                    Showing <span className="font-bold text-gray-700">{filteredParcels.length}</span> of <span className="font-bold text-gray-700">{parcels.length}</span> parcels
                </div>
            </div>

            {/* Status Filter Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statusFilterCards.map(card => {
                    const isActive = filter === card.key;
                    return (
                        <button
                            key={card.key}
                            onClick={() => setFilter(card.key)}
                            className={`relative p-5 rounded-2xl border-none transition-all duration-300 cursor-pointer group ${
                                isActive
                                    ? `${card.colors.activeBg} ${card.colors.activeShadow} text-white scale-[1.02]`
                                    : `${card.colors.bg} ${card.colors.shadow} hover:shadow-md hover:scale-[1.01]`
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                    isActive
                                        ? `${card.colors.activeIconBg} ${card.colors.activeIconColor}`
                                        : `${card.colors.iconBg} ${card.colors.iconColor}`
                                }`}>
                                    {card.icon}
                                </div>
                                <div className="text-left">
                                    <p className={`text-2xl font-extrabold ${isActive ? 'text-white' : 'text-gray-900'}`}>{card.count}</p>
                                    <p className={`text-xs font-medium ${isActive ? 'text-white/70' : 'text-gray-500'}`}>{card.label}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Date Filter + Search Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time Range:</span>
                    <div className="flex gap-1">
                        {['all', 'today', '7days', 'month'].map((range) => (
                             <button
                                 key={range}
                                 onClick={() => setDateFilter(range)}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tighter transition-all ${
                                     dateFilter === range ? 'bg-[#03373D] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                 }`}
                             >
                                 {range}
                             </button>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input type="text" placeholder="Search by Name, ID, or Phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 w-full md:w-72 shadow-sm"/>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-x-auto overflow-y-auto h-[calc(100vh-300px)]">
                <div className="sticky top-0 z-20 grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest items-center shadow-sm min-w-[1100px]">
                    <div className="col-span-1 flex justify-center">
                         <input 
                            type="checkbox" 
                            onChange={handleSelectAll} 
                            checked={paginatedParcels.length > 0 && paginatedParcels.every(p => selectedIds.includes(p._id))}
                            className="w-4 h-4 rounded-lg accent-[#03373D] cursor-pointer"
                        />
                    </div>
                    <div className="col-span-2">Sender</div>
                    <div className="col-span-2">Receiver</div>
                    <div className="col-span-2">Route</div>
                    <div className="col-span-1">Value</div>
                    <div className="col-span-1">Payment</div>
                    <div className="col-span-1">Shipment</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {paginatedParcels.length === 0 ? (
                    <div className="p-20 text-center min-w-[1100px]">
                         <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">No matching parcels found</p>
                    </div>
                ) : (
                    paginatedParcels.map(parcel => (
                        <div key={parcel._id} className={`grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-gray-50 transition group min-w-[1100px] ${selectedIds.includes(parcel._id) ? 'bg-[#03373D]/5' : 'hover:bg-gray-50/50'}`}>
                            <div className="col-span-1 flex justify-center">
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(parcel._id)}
                                    onChange={() => handleSelectRow(parcel._id)}
                                    className="w-4 h-4 rounded-lg accent-[#03373D] cursor-pointer"
                                />
                            </div>
                            <div className="col-span-2">
                                 <p className="text-sm font-bold text-gray-900 truncate">{parcel.senderName}</p>
                                 <p className="text-xs text-gray-400">{parcel.email}</p>
                            </div>
                            <div className="col-span-2">
                                 <p className="text-sm font-bold text-gray-900 truncate">{parcel.receiverName}</p>
                                 <p className="text-xs text-gray-400">{parcel.receiverPhone}</p>
                            </div>
                            <div className="col-span-2 flex items-center gap-1.5 overflow-hidden">
                                <span className="text-xs font-bold text-emerald-600 shrink-0">{parcel.senderDistrict}</span>
                                <div className="w-6 h-px bg-gray-200 shrink-0"></div>
                                <span className="text-xs font-bold text-blue-600 shrink-0">{parcel.receiverDistrict}</span>
                            </div>
                            <div className="col-span-1">
                                <span className="text-sm font-bold text-gray-900">৳{parcel.totalCost || parcel.price}</span>
                                <p className="text-[10px] text-gray-400 mt-1">{parcel.parcelWeight || parcel.weight} kg</p>
                            </div>
                            <div className="col-span-1">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getPaymentStatusColor(parcel.paymentStatus)}`}>
                                    {parcel.paymentStatus || 'Unpaid'}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(parcel.status)}`}>
                                    {parcel.status || 'Pending'}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-1.5 transition-opacity">
                                <button onClick={() => { setSelectedParcel(parcel); setViewModal(true); }} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 hover:bg-[#03373D] hover:text-white rounded-lg transition cursor-pointer" title="Details"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                                <button onClick={() => { setSelectedParcel(parcel); setEditData({ parcelName: parcel.parcelName, weight: parcel.parcelWeight }); setEditModal(true); }} className="w-8 h-8 flex items-center justify-center bg-gray-100 text-[#03373D] hover:bg-[#03373D] hover:text-white rounded-lg transition cursor-pointer" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                                <button onClick={() => navigate('/dashboard/assign-parcels')} disabled={parcel.status === 'delivered' || !!parcel.assignedRider} className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition disabled:opacity-20 cursor-pointer" title={parcel.assignedRider ? 'Already Assigned' : 'Assign Rider'}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg></button>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 min-w-[1100px]">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
                        <div className="flex items-center gap-1">
                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-xl text-xs font-black transition cursor-pointer ${
                                        page === currentPage ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20' : 'text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals remain the same... */}
            {bulkAssignModal && (
                <div className="fixed inset-0 z-MAX flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in transition-all">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8 bg-emerald-50 border-b border-emerald-100 text-center">
                            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-emerald-500/30">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-widest text-[#03373D]">Bulk fleet dispatch</h2>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-tighter">Assigning {selectedIds.length} parcels to one rider</p>
                        </div>
                        <form onSubmit={handleBulkAssign} className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fleet Partner</label>
                                <select 
                                    value={selectedRider}
                                    onChange={(e) => setSelectedRider(e.target.value)}
                                    className="w-full px-6 py-4.5 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 cursor-pointer shadow-inner"
                                >
                                    <option value="">Choose partner...</option>
                                    {riders.map(r => <option key={r._id} value={r.email}>{r.name || r.displayName}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setBulkAssignModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-300 tracking-widest hover:text-gray-500 transition cursor-pointer">Abort</button>
                                <button type="submit" disabled={!selectedRider} className="flex-2 py-4 bg-[#03373D] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] disabled:opacity-50 transition cursor-pointer">Dispatch Fleet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewModal && selectedParcel && (
                <div className="fixed inset-0 z-MAX flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 flex justify-between items-start">
                             <div>
                                 <h2 className="text-2xl font-black text-gray-900">{selectedParcel.parcelName}</h2>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {selectedParcel._id}</p>
                             </div>
                             <button onClick={() => setViewModal(false)} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 cursor-pointer transition"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                        </div>
                        <div className="px-8 pb-8 grid grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                     <p className="text-[10px] font-black text-[#03373D] uppercase tracking-widest">Financials</p>
                                     <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                         <p className="text-3xl font-black text-[#03373D]">৳{selectedParcel.totalCost || selectedParcel.price}</p>
                                         <p className="text-[10px] font-bold text-emerald-600 uppercase">Paid Total</p>
                                     </div>
                                </div>
                                <div className="space-y-2">
                                     <p className="text-[10px] font-black text-[#03373D] uppercase tracking-widest">Route Analysis</p>
                                     <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-center overflow-hidden">
                                         <div className="shrink-0"><p className="text-sm font-black">{selectedParcel.senderDistrict}</p><p className="text-[8px] font-bold text-gray-400 uppercase">Origin</p></div>
                                         <div className="w-12 h-px border-t border-dashed border-gray-300 shrink-0 mx-2"></div>
                                         <div className="shrink-0"><p className="text-sm font-black">{selectedParcel.receiverDistrict}</p><p className="text-[8px] font-bold text-gray-400 uppercase">Terminal</p></div>
                                     </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                     <div className="space-y-1">
                                         <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Consignor</p>
                                         <p className="text-sm font-bold text-gray-900 leading-none">{selectedParcel.senderName}</p>
                                         <p className="text-[10px] font-bold text-gray-400">{selectedParcel.email}</p>
                                     </div>
                                     <div className="space-y-1">
                                         <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Consignee</p>
                                         <p className="text-sm font-bold text-gray-900 leading-none">{selectedParcel.receiverName}</p>
                                         <p className="text-[10px] font-bold text-gray-400">{selectedParcel.receiverPhone}</p>
                                     </div>
                                </div>
                                <div className="space-y-1 flex justify-between items-center px-2 pt-2">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Global Status</p>
                                    <span className="px-3 py-1 bg-[#03373D] text-white rounded-lg text-[10px] uppercase font-black shadow-lg shadow-[#03373D]/20">{selectedParcel.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {editModal && selectedParcel && (
                <div className="fixed inset-0 z-MAX flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-top-12 duration-300 border border-gray-100">
                         <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-black uppercase tracking-widest text-[#03373D]">Modify Metrics</h2>
                            <button onClick={() => setEditModal(false)} className="text-gray-300 hover:text-gray-500 cursor-pointer transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateParcel} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parcel Contents</label>
                                    <input type="text" value={editData.parcelName} onChange={(e) => setEditData({...editData, parcelName: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#03373D]/5 transition"/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dead Weight (kg)</label>
                                    <input type="number" step="0.1" value={editData.weight} onChange={(e) => setEditData({...editData, weight: e.target.value})} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-[#03373D]/5 transition"/>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                     <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                     <p className="text-[10px] text-amber-700 font-bold leading-tight">Billing will refresh upon save.</p>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-4 bg-[#03373D] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.98] transition cursor-pointer">Commit Changes</button>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default AllParcels;
