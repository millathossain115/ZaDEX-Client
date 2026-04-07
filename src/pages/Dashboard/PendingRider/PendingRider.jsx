import { useCallback, useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PendingRider = () => {
    const axiosSecure = useAxiosSecure();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Action modals
    const [confirmModal, setConfirmModal] = useState({ show: false, type: '', application: null });
    const [viewModal, setViewModal] = useState({ show: false, application: null });
    const [isProcessing, setIsProcessing] = useState(false);

    // Toast logic
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            console.log('📋 Fetching pending rider applications...');
            const res = await axiosSecure.get('/rider-applications');
            const pending = res.data.filter(app => app.status === 'pending' || !app.status);
            console.log(`✅ Found ${pending.length} pending application(s)`);
            setApplications(pending);
        } catch (err) {
            console.error('❌ Failed to fetch applications:', err);
            setError('Failed to load applications. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
    };

    const handleAction = async () => {
        setIsProcessing(true);
        const { type, application } = confirmModal;
        const newStatus = type === 'approve' ? 'active' : 'rejected';

        console.log(`🔄 ${type === 'approve' ? '✅ Approving' : '❌ Rejecting'} rider application for: ${application.email}`);

        try {
            // 1. Update the application document status
            await axiosSecure.patch(`/rider-applications/${application._id}`, { status: newStatus });
            console.log(`📄 Application ${application._id} status → ${newStatus}`);

            // 2. If approved, update the user's role in the users collection too
            if (type === 'approve') {
                await axiosSecure.patch(`/users/role/${application.email}`, { role: 'rider' });
                console.log(`🏍️ User role updated → ${application.email}: rider`);
            }

            showToast('success', `Rider application ${type}d successfully!`);
            setApplications(prev => prev.filter(app => app._id !== application._id));
            setConfirmModal({ show: false, type: '', application: null });
        } catch (err) {
            console.error(`❌ Failed to ${type} application:`, err);
            showToast('error', `Failed to ${type} application. Please try again.`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#03373D]/20 border-t-[#03373D] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading applications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Pending Rider Applications</h1>
                <p className="text-gray-500 mt-1">Review and manage new rider sign-ups for the ZaDex network</p>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex flex-col items-center gap-4">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="font-semibold">{error}</p>
                    <button onClick={fetchApplications} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">Try Again</button>
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Pending Applications</h3>
                    <p className="text-gray-500">Everything is caught up! There are no new rider applications to review at this moment.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Rider Information</div>
                        <div>Region & District</div>
                        <div>Vehicle Details</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* Application Rows */}
                    <div className="divide-y divide-gray-50">
                        {applications.map((app) => (
                            <div key={app._id} className="grid grid-cols-1 lg:grid-cols-6 gap-4 px-6 py-6 items-center hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#03373D] flex items-center justify-center text-white font-bold text-sm">
                                            {app.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{app.name}</p>
                                            <p className="text-xs text-gray-500">{app.email}</p>
                                            <p className="text-xs text-gray-400 font-medium">{app.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold text-gray-700">{app.region}</span>
                                        <span className="text-xs text-gray-500">{app.district}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-[#03373D] uppercase tracking-tight">{app.bikeSpecs}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{app.bikeReg}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        Pending Review
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 lg:justify-end">
                                    <button 
                                        onClick={() => setViewModal({ show: true, application: app })}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        title="View Details"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => setConfirmModal({ show: true, type: 'reject', application: app })}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Reject"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                    <button 
                                        onClick={() => setConfirmModal({ show: true, type: 'approve', application: app })}
                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                        title="Approve"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewModal.show && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest font-bold">Reviewing: {viewModal.application?.name}</p>
                            </div>
                            <button onClick={() => setViewModal({ show: false, application: null })} className="p-2 hover:bg-gray-200 rounded-full transition">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NID Number</p>
                                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{viewModal.application?.nid}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age Range</p>
                                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{viewModal.application?.age}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Driving License</p>
                                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{viewModal.application?.license}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Application Date</p>
                                    <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                        {viewModal.application?.createdAt ? new Date(viewModal.application.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Short Bio</p>
                                <div className="text-sm text-gray-600 leading-relaxed bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50 italic">
                                    "{viewModal.application?.bio}"
                                </div>
                            </div>
                        </div>
                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setConfirmModal({ show: true, type: 'reject', application: viewModal.application });
                                    setViewModal({ show: false, application: null });
                                }}
                                className="px-6 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => {
                                    setConfirmModal({ show: true, type: 'approve', application: viewModal.application });
                                    setViewModal({ show: false, application: null });
                                }}
                                className="px-8 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition"
                            >
                                Approve Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-[scaleIn_0.2s_ease-out]">
                        <div className="p-8 text-center">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                confirmModal.type === 'approve' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                            }`}>
                                {confirmModal.type === 'approve' ? (
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {confirmModal.type === 'approve' ? 'Approve Rider?' : 'Reject Application?'}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {confirmModal.type === 'approve' 
                                    ? `Are you sure you want to approve ${confirmModal.application?.name} as a rider? They will be granted rider access immediately.`
                                    : `Are you sure you want to reject ${confirmModal.application?.name}'s application? This action will be recorded.`
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                <button 
                                    disabled={isProcessing}
                                    onClick={handleAction}
                                    className={`w-full py-4 rounded-2xl text-white font-bold transition flex items-center justify-center gap-2 ${
                                        confirmModal.type === 'approve' 
                                            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20' 
                                            : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20'
                                    }`}
                                >
                                    {isProcessing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    {isProcessing ? 'Processing...' : `Yes, ${confirmModal.type} it`}
                                </button>
                                <button 
                                    disabled={isProcessing}
                                    onClick={() => setConfirmModal({ show: false, type: '', application: null })}
                                    className="w-full py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition"
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

export default PendingRider;