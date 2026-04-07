import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const POLL_INTERVAL_MS = 15000; // auto-refresh every 15 seconds

const Trackparcel = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

    const [searchId, setSearchId] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const pollRef = useRef(null);

    const formatTs = (ts) => {
        if (!ts) return null;
        const d = new Date(ts);
        if (isNaN(d.getTime())) return null;
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const extractId = (raw = '') => {
        let id = raw.trim();
        try {
            if (id.includes('http://') || id.includes('https://')) {
                if (id.includes('id=')) {
                    id = id.split('id=')[1].trim();
                } else {
                    const url = new URL(id);
                    id = url.pathname.split('/').pop() || id;
                }
            }
        } catch { /* not a URL */ }
        return decodeURIComponent(id).replace(/^.*[\\\/]/, '');
    };

    const fetchTracking = useCallback(async (id, silent = false) => {
        if (!id) return;
        if (!silent) setLoading(true);
        try {
            const res = await axiosSecure.get(`/parcels/track/${id}`);
            if (res.data) {
                setTrackingResult(res.data);
                setLastUpdated(new Date());
                setError('');
            }
        } catch (err) {
            if (!silent) {
                if (err.response?.status === 404) {
                    setError("Tracking ID not found. Ensure it's correct.");
                } else {
                    setError('Failed to fetch tracking data. Please try again.');
                }
                setTrackingResult(null);
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [axiosSecure]);

    // Auto-poll while parcel is in transit
    useEffect(() => {
        clearInterval(pollRef.current);
        const s = trackingResult?.status?.toLowerCase();
        if (trackingResult && s !== 'delivered' && s !== 'cancelled') {
            const id = trackingResult.trackingId || trackingResult._id;
            pollRef.current = setInterval(() => fetchTracking(id, true), POLL_INTERVAL_MS);
        }
        return () => clearInterval(pollRef.current);
    }, [trackingResult, fetchTracking]);

    // Auto-load from URL query
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('id');
        if (idFromUrl) {
            const cleaned = extractId(idFromUrl);
            setSearchId(cleaned);
            fetchTracking(cleaned);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, user]);

    const handleSearch = (e) => {
        e?.preventDefault();
        clearInterval(pollRef.current);
        const cleaned = extractId(searchId);
        if (!cleaned) { setError('Please enter a valid tracking ID.'); return; }
        setSearchId(cleaned);
        setError('');
        setTrackingResult(null);
        fetchTracking(cleaned);
    };

    // ── Status → step index map ───────────────────────────────────────────────
    const STATUS_ORDER = {
        pending:          0,
        assigned:         1,
        accepted:         2,
        shipped:          3,   // "Picked Up"
        out_for_delivery: 4,
        delivered:        5,
        cancelled:        -1,
    };

    // ── 6 timeline steps ─────────────────────────────────────────────────────
    const STEPS = [
        {
            label: 'Booked',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z" /></svg>,
            getDate: (p) => formatTs(p.requestedDate || p.createdAt || p.bookingDate || p.bookedAt),
        },
        {
            label: 'Rider Assigned',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
            getDate: (p) => formatTs(p.assignedAt),
        },
        {
            label: 'Rider Accepted',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            getDate: (p) => formatTs(p.acceptedAt),
        },
        {
            label: 'Picked Up',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
            getDate: (p) => formatTs(p.pickedUpAt),
        },
        {
            label: 'Out for Delivery',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>,
            getDate: (p) => formatTs(p.outForDeliveryAt),
        },
        {
            label: 'Delivered',
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>,
            getDate: (p) => formatTs(p.deliveredAt),
        },
    ];

    const normalizedStatus = (trackingResult?.status || 'pending').toLowerCase().replace(/ /g, '_');
    const statusIndex = STATUS_ORDER[normalizedStatus] ?? 0;
    const isCancelled = statusIndex === -1;
    const isDelivered = statusIndex === 5;
    const progressPct = isCancelled ? 0 : Math.round((statusIndex / (STEPS.length - 1)) * 100);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-[#03373D] mb-3">Track Your Shipment</h1>
                <p className="text-gray-500 font-medium max-w-lg mx-auto">
                    Enter your unique Tracking ID to view real-time delivery progress.
                </p>
            </div>

            {/* Search Box */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-10 mx-auto max-w-2xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="Enter Tracking ID or paste URL..."
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 uppercase text-gray-900 font-bold placeholder-gray-400 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] focus:bg-white transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-[#03373D] text-white font-bold rounded-xl shadow-lg hover:bg-[#025a63] shadow-[#03373D]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Loading Spinner */}
            {loading && !trackingResult && (
                <div className="flex justify-center mt-12">
                    <svg className="animate-spin w-12 h-12 text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                </div>
            )}

            {/* Results */}
            {trackingResult && !loading && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-[fadeInUp_0.4s_ease-out]">

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">Shipment Status</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className={`text-3xl font-extrabold ${isCancelled ? 'text-red-600' : isDelivered ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {isCancelled ? 'CANCELLED' : STEPS[statusIndex]?.label?.toUpperCase() || 'PENDING'}
                                </h2>
                                {!isCancelled && !isDelivered && (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Live
                                    </span>
                                )}
                            </div>
                            {lastUpdated && (
                                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                    Last refreshed: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    {!isCancelled && !isDelivered && <span className="ml-1">· auto-updates every 15s</span>}
                                </p>
                            )}
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1">Route</p>
                            <p className="text-lg font-bold text-[#03373D]">
                                {trackingResult.senderDistrict} → {trackingResult.receiverDistrict}
                            </p>
                            {trackingResult.assignedRiderName && (
                                <p className="text-xs text-gray-500 mt-0.5">Rider: <span className="font-bold text-gray-700">{trackingResult.assignedRiderName}</span></p>
                            )}
                        </div>
                    </div>

                    {/* Timeline body */}
                    <div className="p-6 md:p-10 bg-gray-50/50">
                        {isCancelled ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delivery Cancelled</h3>
                                <p className="text-gray-500">This parcel has been cancelled. Please contact support for assistance.</p>
                            </div>
                        ) : (
                            <div>
                                {/* Gradient progress bar */}
                                <div className="relative h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${progressPct}%`,
                                            background: isDelivered
                                                ? 'linear-gradient(90deg, #10b981, #059669)'
                                                : 'linear-gradient(90deg, #03373D, #0d9051)',
                                        }}
                                    />
                                </div>

                                {/* Step cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {STEPS.map((step, i) => {
                                        const done = statusIndex > i;
                                        const active = statusIndex === i;
                                        const dateStr = step.getDate(trackingResult);
                                        return (
                                            <div key={i} className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all ${
                                                active ? 'bg-[#03373D]/5 border border-[#03373D]/20 shadow-sm' :
                                                done  ? 'bg-emerald-50' : 'bg-white border border-gray-100'
                                            }`}>
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm transition-all ${
                                                    done   ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                                    active ? 'bg-[#03373D] text-white shadow-[#03373D]/30 ring-4 ring-[#03373D]/10' :
                                                             'bg-gray-100 text-gray-300'
                                                }`}>
                                                    {done ? (
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : step.icon}
                                                </div>
                                                <p className={`text-xs font-black uppercase tracking-tight leading-tight mb-1 ${
                                                    active ? 'text-[#03373D]' : done ? 'text-emerald-700' : 'text-gray-300'
                                                }`}>{step.label}</p>
                                                {active && (
                                                    <span className="text-[8px] font-black uppercase tracking-widest bg-[#03373D] text-white px-1.5 py-0.5 rounded-full mb-1">Now</span>
                                                )}
                                                <p className={`text-[9px] font-medium leading-snug ${done || active ? 'text-gray-500' : 'text-gray-200'}`}>
                                                    {dateStr || (done || active ? '—' : 'Pending')}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Delivered celebration */}
                                {isDelivered && (
                                    <div className="mt-8 text-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <div className="text-4xl mb-2">🎉</div>
                                        <h3 className="text-xl font-extrabold text-emerald-700">Package Delivered!</h3>
                                        <p className="text-sm text-emerald-600 mt-1">
                                            Delivered on {formatTs(trackingResult.deliveredAt) || 'recently'}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer meta */}
                    <div className="border-t border-gray-100 px-6 md:px-10 py-4 flex flex-col sm:flex-row gap-3 sm:gap-8 bg-gray-50">
                        {[
                            { label: 'Tracking ID', value: trackingResult.trackingId || trackingResult._id?.slice(-8)?.toUpperCase() || '—' },
                            { label: 'Parcel',      value: trackingResult.parcelName || trackingResult.name || '—' },
                            { label: 'Payment',     value: trackingResult.paymentStatus || 'Pending' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                                <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trackparcel;