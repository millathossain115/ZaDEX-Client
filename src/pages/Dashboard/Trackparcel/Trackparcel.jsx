import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Trackparcel = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    
    // State
    const [searchId, setSearchId] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // On mount or location change, parse the ID from the query string
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('id');
        if (idFromUrl) {
            setSearchId(idFromUrl);
            handleSearch(idFromUrl);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, user]);

    const handleSearch = async (trackingId = searchId) => {
        let extractedId = trackingId ? trackingId.trim() : '';

        // Aggressively safely extract the ID if the user pastes the full tracking URL instead of just the ID
        try {
            if (extractedId.includes('http://') || extractedId.includes('https://')) {
                // If the URL contains ?id= at the end, extract everything after the =
                if (extractedId.includes('id=')) {
                    extractedId = extractedId.split('id=')[1].trim();
                } else {
                    // Otherwise try to grab the last path segment as the ID
                    const url = new URL(extractedId);
                    extractedId = url.pathname.split('/').pop() || extractedId;
                }
            }
        } catch {
            // Not a valid URL structure, just treat as raw ID
        }

        // Clean up any rogue URL encoding or accidental paths just in case
        extractedId = decodeURIComponent(extractedId).replace(/^.*(\\|\/)/, '');

        if (!extractedId) {
            setError('Please enter a valid tracking ID.');
            return;
        }

        setError('');
        setTrackingResult(null);
        setLoading(true);

        // Standardize the search box to visually show just the ID after processing the URL
        setSearchId(extractedId);

        try {
            // Hit the server's tracking endpoint directly!
            const res = await axiosSecure.get(`/parcels/track/${extractedId}`);
            
            if (res.data) {
                setTrackingResult(res.data);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                 setError("Tracking ID not found. Ensure it's correct.");
            } else {
                 setError('Failed to fetch tracking data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const StatusStep = ({ title, date, active, completed }) => (
        <div className="flex w-full mt-4 md:mt-0 md:flex-col md:items-center">
            {/* Horizontal timeline logic for desktop, stacked for mobile logic integrated visually using flex */}
            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-0 md:mb-4 mr-4 md:mr-0 z-10 relative shadow-md transition-colors ${
                completed ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 
                active ? 'bg-indigo-600 text-white shadow-indigo-600/30 animate-pulse' : 
                'bg-gray-100 text-gray-400'
            }`}>
                {completed ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </div>
            
            <div className="flex-1 pb-8 md:pb-0 md:text-center min-w-30">
                <h4 className={`text-base font-bold mb-1 ${active || completed ? 'text-gray-900' : 'text-gray-400'}`}>{title}</h4>
                <p className="text-xs text-gray-500 font-medium">{date || 'Pending...'}</p>
            </div>
        </div>
    );

    const getStatusIndex = (currentStatus) => {
        switch((currentStatus || 'pending').toLowerCase()) {
            case 'pending': return 0;
            case 'shipped': return 1;
            case 'out for delivery': return 2;
            case 'delivered': return 3;
            case 'cancelled': return -1;
            default: return 0;
        }
    };

    const statusIndex = trackingResult ? getStatusIndex(trackingResult.status) : 0;
    const isCancelled = statusIndex === -1;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-[#03373D] mb-3">Track Your Shipment</h1>
                <p className="text-gray-500 font-medium max-w-lg mx-auto">
                    Enter your unique Tracing ID below to instantly view your parcel's current status and delivery progress.
                </p>
            </div>

            {/* Search Box Segment */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-10 mx-auto max-w-2xl transform transition hover:shadow-2xl">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                    className="flex flex-col sm:flex-row gap-4"
                >
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
                            placeholder="Enter Tracing ID (e.g. ZDX-XXXX / MongoID)"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 uppercase text-gray-900 font-bold placeholder-gray-400 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] focus:bg-white transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-[#03373D] text-white font-bold rounded-xl shadow-lg hover:bg-[#025a63] shadow-[#03373D]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:active:scale-100"
                    >
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-semibold border border-red-100 flex items-center gap-2 animate-[fadeInUp_0.3s_ease-out]">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Loading Indicator */}
            {loading && !trackingResult && !error && (
                <div className="flex justify-center mt-12 animate-pulse">
                     <svg className="w-12 h-12 text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}

            {/* Tracking Results Area */}
            {trackingResult && !loading && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-[fadeInUp_0.4s_ease-out]">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">Status Overview</p>
                            <h2 className={`text-3xl font-extrabold ${isCancelled ? 'text-red-600' : 'text-gray-900'}`}>
                                {isCancelled ? 'CANCELLED' : trackingResult.status?.toUpperCase() || 'PENDING'}
                            </h2>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Route</p>
                            <p className="text-lg font-semibold text-[#03373D]">{trackingResult.senderDistrict} → {trackingResult.receiverDistrict}</p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 relative overflow-hidden bg-gray-50/50">
                        {isCancelled ? (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                     <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delivery Cancelled</h3>
                                <p className="text-gray-500">Unfortunately, tracking timeline is unavailable because the parcel was cancelled.</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Timeline connecting lines (desktop) */}
                                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 z-0"></div>
                                <div className="hidden md:block absolute top-6 left-[10%] h-1 bg-emerald-500 z-0 transition-all duration-1000" 
                                    style={{ width: `${Math.min(100, (statusIndex / 3) * 80)}%` }}>
                                </div>
                                
                                {/* Vertical line (mobile) */}
                                <div className="md:hidden absolute top-6 bottom-12 left-6 w-1 bg-gray-200 z-0"></div>
                                <div className="md:hidden absolute top-6 left-6 w-1 bg-emerald-500 z-0 transition-all duration-1000" 
                                    style={{ height: `${statusIndex === 0 ? '0%' : statusIndex === 1 ? '33%' : statusIndex === 2 ? '66%' : '100%'}` }}>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between w-full relative z-10">
                                    <StatusStep 
                                        title="Confirmed" 
                                        date={trackingResult.requestedDate || 'Booked Time'} 
                                        active={statusIndex === 0} 
                                        completed={statusIndex > 0} 
                                    />
                                    <StatusStep 
                                        title="In Transit" 
                                        date={statusIndex >= 1 ? 'Handed to driver' : ''} 
                                        active={statusIndex === 1} 
                                        completed={statusIndex > 1} 
                                    />
                                    <StatusStep 
                                        title="Out for Delivery" 
                                        date={statusIndex >= 2 ? 'Nearing destination' : ''} 
                                        active={statusIndex === 2} 
                                        completed={statusIndex > 2} 
                                    />
                                    <StatusStep 
                                        title="Delivered" 
                                        date={statusIndex === 3 ? 'Package arrived' : ''} 
                                        active={statusIndex === 3} 
                                        completed={statusIndex === 3} 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trackparcel;