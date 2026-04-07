import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ActiveRider = () => {
    const axiosSecure = useAxiosSecure();
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchActiveRiders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axiosSecure.get('/rider-applications');
            const active = res.data.filter(app => app.status === 'active');
            setRiders(active);
        } catch (err) {
            console.error('Failed to fetch active riders:', err);
            setError('Failed to load active riders.');
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchActiveRiders();
    }, [fetchActiveRiders]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-[#03373D]/20 border-t-[#03373D] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Active Riders</h1>
                <p className="text-gray-500 mt-1">Manage and monitor all approved riders in the network</p>
            </div>

            {error ? (
                <div className="bg-red-50 p-6 rounded-2xl text-red-600 text-center">
                    <p>{error}</p>
                    <button onClick={fetchActiveRiders} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl">Retry</button>
                </div>
            ) : riders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                    <p className="text-gray-500">No active riders found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="hidden lg:grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                        <div className="col-span-2">Rider</div>
                        <div>Region</div>
                        <div>Bike Details</div>
                        <div className="text-right">Contact</div>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {riders.map((rider) => (
                            <div key={rider._id} className="grid grid-cols-1 lg:grid-cols-5 gap-4 px-6 py-5 items-center">
                                <div className="col-span-2 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                                        {rider.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{rider.name}</p>
                                        <p className="text-xs text-gray-500">{rider.email}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">{rider.region}</div>
                                <div className="text-sm text-gray-600 font-medium">{rider.bikeSpecs}</div>
                                <div className="text-right text-sm font-bold text-[#03373D]">{rider.phone}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveRider;