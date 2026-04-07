import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { calculateRiderReward } from '../RiderShared/riderUtils';

const AssignParcels = () => {
    const axiosSecure = useAxiosSecure();
    const [parcels, setParcels] = useState([]);
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });
    
    // Modal State
    const [selectedParcelForModal, setSelectedParcelForModal] = useState(null);
    const [riderSearchQuery, setRiderSearchQuery] = useState('');
    const [riderStatusFilter, setRiderStatusFilter] = useState('active');

    const filteredRiders = riders.filter(r => {
        const matchesSearch = 
            (r.name && r.name.toLowerCase().includes(riderSearchQuery.toLowerCase())) ||
            (r.phone && String(r.phone).toLowerCase().includes(riderSearchQuery.toLowerCase()));
        
        const rStatus = r.status?.toLowerCase() || 'active'; // fallback
        const matchesStatus = 
            riderStatusFilter === 'all' ? true :
            riderStatusFilter === 'active' ? rStatus === 'active' :
            riderStatusFilter === 'inactive' ? rStatus !== 'active' : true;
            
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [parcelsRes, usersRes] = await Promise.all([
                    axiosSecure.get('/all-parcels'),
                    axiosSecure.get('/users'),
                ]);

                // Unassigned parcels (no rider assigned, not yet delivered or cancelled)
                const unassigned = parcelsRes.data.filter(p =>
                    !p.assignedRider &&
                    p.status?.toLowerCase() !== 'delivered' &&
                    p.status?.toLowerCase() !== 'cancelled' &&
                    p.status?.toLowerCase() !== 'assigned'
                );
                setParcels(unassigned);

                // Fetch all riders
                const allRiders = usersRes.data.filter(u => u.role === 'rider');
                setRiders(allRiders);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    // Auto-hide toast
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleAssign = async (parcelId, riderEmail, riderName) => {
        setAssigning(parcelId);
        try {
            await axiosSecure.put(`/parcels/${parcelId}`, {
                assignedRider: riderEmail,
                assignedRiderName: riderName,
                riderReward: calculateRiderReward(parcels.find(p => p._id === parcelId) || {}),
                riderDecision: 'assigned', // Initial state
                status: 'assigned',
                assignedAt: new Date().toISOString(),
            });
            // Remove from list
            setParcels(prev => prev.filter(p => p._id !== parcelId));
            setToast({ show: true, type: 'success', message: `Parcel assigned to ${riderName} successfully!` });
            setSelectedParcelForModal(null);
        } catch (err) {
            console.error('Failed to assign parcel:', err);
            setToast({ show: true, type: 'error', message: 'Failed to assign parcel. Try again.' });
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Page Header Skeleton */}
                <div className="mb-8">
                    <div className="h-9 w-64 bg-gray-200 rounded-xl mb-3"></div>
                    <div className="h-4 w-96 max-w-full bg-gray-100 rounded-lg"></div>
                </div>

                {/* Info Bar Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-3 w-32 bg-gray-100 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-6 w-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-3 w-32 bg-gray-100 rounded-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Parcels Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="h-6 w-48 bg-gray-200 rounded-lg"></div>
                                                <div className="h-5 w-12 bg-gray-100 rounded-md"></div>
                                                <div className="h-5 w-16 bg-gray-100 rounded-md"></div>
                                            </div>
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-30 flex flex-col justify-center">
                                                <div className="h-3 w-24 bg-gray-200 rounded-lg mb-3"></div>
                                                <div className="h-4 w-40 bg-gray-300 rounded-lg mb-2"></div>
                                                <div className="h-3 w-full max-w-50 bg-gray-200 rounded-lg mb-2"></div>
                                                <div className="h-3 w-32 bg-gray-100 rounded-lg"></div>
                                            </div>
                                        </div>
                                        <div className="md:pt-9.5">
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-30 flex flex-col justify-center">
                                                <div className="h-3 w-24 bg-gray-200 rounded-lg mb-3"></div>
                                                <div className="h-4 w-40 bg-gray-300 rounded-lg mb-2"></div>
                                                <div className="h-3 w-full max-w-50 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-48">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div>
                                    <div className="w-full h-11 bg-gray-200 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Modal */}
            {selectedParcelForModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-[fadeInUp_0.2s_ease-out]">
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-3xl">
                            <div>
                                <h2 className="text-2xl font-extrabold text-gray-900">Select a Rider</h2>
                                <p className="text-sm text-gray-500 mt-0.5">Assigning <span className="font-bold text-gray-800">{selectedParcelForModal.parcelName || 'Unnamed Parcel'}</span></p>
                            </div>
                            <button onClick={() => setSelectedParcelForModal(null)} className="p-2 hover:bg-gray-200 bg-gray-100 rounded-full transition">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-white z-10 sticky top-0">
                            <div className="relative flex-1">
                                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <input 
                                    type="text" 
                                    placeholder="Search by Name or Mobile Number..." 
                                    value={riderSearchQuery}
                                    onChange={(e) => setRiderSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 transition"
                                />
                            </div>
                            <div className="shrink-0">
                                <select 
                                    value={riderStatusFilter}
                                    onChange={(e) => setRiderStatusFilter(e.target.value)}
                                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 transition cursor-pointer"
                                >
                                    <option value="all">All Riders</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-white rounded-b-3xl">
                            {filteredRiders.length === 0 ? (
                                <div className="text-center text-gray-500 py-10">
                                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    <p className="text-lg font-bold text-gray-700">No Riders Found</p>
                                    <p className="text-sm">Try modifying your search or filters.</p>
                                </div>
                            ) : (
                                filteredRiders.map(rider => (
                                    <div key={rider._id} className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md hover:border-[#03373D]/30 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 group-hover:border-[#03373D] transition">
                                                {rider.photoURL || rider.image ? (
                                                    <img src={rider.photoURL || rider.image} alt={rider.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg leading-tight">{rider.name || rider.displayName || 'Unnamed Rider'}</h3>
                                                <div className="flex flex-col gap-1 mt-1.5">
                                                    <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                        {rider.email}
                                                    </p>
                                                    <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                        {rider.phone || 'Phone unavailable'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            disabled={assigning === selectedParcelForModal._id}
                                            onClick={() => handleAssign(selectedParcelForModal._id, rider.email, rider.name || rider.email)}
                                            className="w-full sm:w-auto bg-[#03373D] text-white font-bold px-6 py-2.5 rounded-xl text-sm border border-transparent hover:bg-emerald-600 hover:shadow-lg transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {assigning === selectedParcelForModal._id ? (
                                                <>
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Assigning...
                                                </>
                                            ) : 'Assign to Rider'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Assign Parcels</h1>
                <p className="text-gray-500 mt-1">Review full sender/receiver info and assign paid parcels to active riders</p>
            </div>

            {/* Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-amber-800">{parcels.length}</p>
                        <p className="text-xs text-amber-600 font-medium">Unassigned Parcels</p>
                    </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-emerald-800">{riders.length}</p>
                        <p className="text-xs text-emerald-600 font-medium">Available Riders</p>
                    </div>
                </div>
            </div>

            {/* Parcels to Assign */}
            {parcels.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">All Caught Up!</h3>
                    <p className="text-gray-500 text-sm">No parcels need assignment right now.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {parcels.map(parcel => (
                        <div key={parcel._id} className="bg-white rounded-2xl border border-gray-200 border-l-[6px] border-l-[#03373D] shadow-sm p-6 hover:shadow-md transition">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                {/* Parcel Detailed Info */}
                                <div className="flex items-start gap-4 min-w-0 flex-1">
                                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        
                                        {/* Sender Column */}
                                        <div>
                                            <div className="flex items-center gap-3 space-y-0.5 mb-3">
                                                <h3 className="font-bold text-gray-900 text-xl tracking-tight">{parcel.parcelName || parcel.name || 'Unnamed Parcel'}</h3>
                                                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-xs">{parcel.parcelWeight || parcel.weight || 0} kg</span>
                                                <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs">৳{parcel.totalCost || parcel.price || 0}</span>
                                            </div>
                                            
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-30">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                                    Pickup From
                                                </p>
                                                <p className="text-sm font-bold text-gray-800">{parcel.senderName} <span className="font-medium text-gray-500 text-xs ml-1">({parcel.senderPhone})</span></p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {parcel.senderAddress}{parcel.senderArea && `, ${parcel.senderArea}`}{parcel.senderDistrict && `, ${parcel.senderDistrict}`}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{parcel.senderEmail}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Receiver Column */}
                                        <div className="md:pt-9.5">
                                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 h-30">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                                    Deliver To
                                                </p>
                                                <p className="text-sm font-bold text-gray-800">{parcel.receiverName} <span className="font-medium text-gray-500 text-xs ml-1">({parcel.receiverPhone})</span></p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {parcel.receiverAddress}{parcel.receiverArea && `, ${parcel.receiverArea}`}{parcel.receiverDistrict && `, ${parcel.receiverDistrict}`}
                                                </p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>

                                {/* Assign Action */}
                                <div className="flex flex-col items-center shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 w-full lg:w-48 text-center">
                                    <div className="w-12 h-12 bg-[#03373D]/10 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedParcelForModal(parcel)}
                                        className="w-full bg-[#03373D] text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-[#025a63] hover:shadow-md transition active:scale-[0.98]"
                                    >
                                        Assign Rider
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignParcels;
