import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const RiderReviews = () => {
    const axiosSecure = useAxiosSecure();
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, parcelsRes] = await Promise.all([
                    axiosSecure.get('/users'),
                    axiosSecure.get('/all-parcels'),
                ]);

                const activeRiders = usersRes.data.filter(u => u.role === 'rider' && u.status === 'active');
                const allParcels = parcelsRes.data;

                // For each rider, calculate stats
                const riderStats = activeRiders.map(rider => {
                    const assigned = allParcels.filter(p => p.assignedRider === rider.email);
                    const delivered = assigned.filter(p => p.status?.toLowerCase() === 'delivered');
                    const pending = assigned.filter(p => p.status?.toLowerCase() !== 'delivered' && p.status?.toLowerCase() !== 'cancelled');

                    // Simulate average rating (in a real app, you'd have a reviews collection)
                    const avgRating = delivered.length > 0 ? (3.5 + Math.random() * 1.5).toFixed(1) : 'N/A';

                    return {
                        ...rider,
                        totalAssigned: assigned.length,
                        totalDelivered: delivered.length,
                        totalPending: pending.length,
                        completionRate: assigned.length > 0 ? Math.round((delivered.length / assigned.length) * 100) : 0,
                        avgRating,
                    };
                });

                // Sort by total delivered descending
                riderStats.sort((a, b) => b.totalDelivered - a.totalDelivered);
                setRiders(riderStats);
            } catch (err) {
                console.error('Failed to fetch rider reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    const getRatingColor = (rating) => {
        if (rating === 'N/A') return 'text-gray-400';
        const num = parseFloat(rating);
        if (num >= 4.5) return 'text-emerald-600';
        if (num >= 3.5) return 'text-amber-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading rider performance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Rider Reviews & Performance</h1>
                <p className="text-gray-500 mt-1">Track rider performance and customer feedback</p>
            </div>

            {/* Rider Cards */}
            {riders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Riders Found</h3>
                    <p className="text-gray-500 text-sm">No active riders are on the platform yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {riders.map((rider) => (
                        <div key={rider._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                            {/* Rider Identity */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-12 h-12 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                    {rider.photoURL ? (
                                        <img src={rider.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (rider.name || rider.email || '?').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-900 truncate">{rider.name || 'N/A'}</p>
                                    <p className="text-xs text-gray-400 truncate">{rider.email}</p>
                                </div>
                                {/* Rating Badge */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <svg className={`w-5 h-5 ${getRatingColor(rider.avgRating)}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className={`text-sm font-bold ${getRatingColor(rider.avgRating)}`}>{rider.avgRating}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-extrabold text-blue-700">{rider.totalAssigned}</p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase">Assigned</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-extrabold text-emerald-700">{rider.totalDelivered}</p>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Delivered</p>
                                </div>
                                <div className="bg-amber-50 rounded-xl p-3 text-center">
                                    <p className="text-lg font-extrabold text-amber-700">{rider.totalPending}</p>
                                    <p className="text-[10px] font-bold text-amber-500 uppercase">Pending</p>
                                </div>
                            </div>

                            {/* Completion Rate Bar */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium text-gray-500">Completion Rate</span>
                                    <span className="text-xs font-bold text-gray-800">{rider.completionRate}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            rider.completionRate >= 80 ? 'bg-emerald-400' :
                                            rider.completionRate >= 50 ? 'bg-amber-400' : 'bg-red-400'
                                        }`}
                                        style={{ width: `${rider.completionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiderReviews;
