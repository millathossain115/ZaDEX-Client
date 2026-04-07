import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ManageRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [tab, setTab] = useState('pending');
    const [applications, setApplications] = useState([]);
    const [activeRiders, setActiveRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, usersRes] = await Promise.all([
                    axiosSecure.get('/rider-applications'),
                    axiosSecure.get('/users'),
                ]);

                setApplications(appsRes.data.filter(a => a.status === 'pending'));
                setActiveRiders(usersRes.data.filter(u => u.role === 'rider' && u.status === 'active'));
            } catch (err) {
                console.error('Failed to fetch rider data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const handleApprove = async (application) => {
        try {
            await axiosSecure.patch(`/rider-applications/${application._id}`, { status: 'active' });

            setApplications(prev => prev.filter(a => a._id !== application._id));
            setActiveRiders(prev => [...prev, { ...application, role: 'rider', status: 'active' }]);
            setToast({ show: true, type: 'success', message: `${application.name || application.email} approved as a rider!` });
        } catch (err) {
            console.error('Failed to approve rider:', err);
            setToast({ show: true, type: 'error', message: 'Failed to approve rider.' });
        }
    };

    const handleReject = async (application) => {
        try {
            await axiosSecure.patch(`/rider-applications/${application._id}`, { status: 'rejected' });
            setApplications(prev => prev.filter(a => a._id !== application._id));
            setToast({ show: true, type: 'success', message: 'Application rejected.' });
        } catch (err) {
            console.error('Failed to reject rider:', err);
            setToast({ show: true, type: 'error', message: 'Failed to reject application.' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading rider data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Toast */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Riders</h1>
                <p className="text-gray-500 mt-1">Approve applications and track active riders</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={() => setTab('pending')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        tab === 'pending'
                            ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Pending Applications
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${tab === 'pending' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                        {applications.length}
                    </span>
                </button>
                <button
                    onClick={() => setTab('active')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                        tab === 'active'
                            ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Active Riders
                    <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${tab === 'active' ? 'bg-white/20' : 'bg-emerald-100 text-emerald-700'}`}>
                        {activeRiders.length}
                    </span>
                </button>
            </div>

            {/* Pending Tab */}
            {tab === 'pending' && (
                <>
                    {applications.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Pending Applications</h3>
                            <p className="text-gray-500 text-sm">All rider applications have been reviewed.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-lg">
                                                {(app.name || app.email || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{app.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-400">{app.email}</p>
                                                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                    {app.phone && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">📱 {app.phone}</span>
                                                    )}
                                                    {app.district && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">📍 {app.district}</span>
                                                    )}
                                                    {app.ageRange && (
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">🎂 {app.ageRange}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <button
                                                onClick={() => handleReject(app)}
                                                className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleApprove(app)}
                                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Active Tab */}
            {tab === 'active' && (
                <>
                    {activeRiders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Riders</h3>
                            <p className="text-gray-500 text-sm">No riders are currently active on the platform.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {activeRiders.map(rider => (
                                <div key={rider._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold overflow-hidden">
                                            {rider.photoURL ? (
                                                <img src={rider.photoURL} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                (rider.name || rider.email || '?').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 text-sm truncate">{rider.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-400 truncate">{rider.email}</p>
                                        </div>
                                        <span className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {rider.phone && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">📱 {rider.phone}</span>
                                        )}
                                        {rider.district && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">📍 {rider.district}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ManageRiders;
