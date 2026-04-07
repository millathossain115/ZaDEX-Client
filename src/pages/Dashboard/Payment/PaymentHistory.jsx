import { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/parcels?email=${user.email}`)
                .then(res => {
                    // Filter only the parcels that have been paid
                    const paidParcels = res.data.filter(p => p.paymentStatus === 'paid');
                    
                    // Sort by newest payment date if exists, else requested date
                    paidParcels.sort((a, b) => {
                        const dateA = new Date(a.paymentDate || a.requestedDate || 0);
                        const dateB = new Date(b.paymentDate || b.requestedDate || 0);
                        return dateB - dateA;
                    });
                    
                    
                    console.log(`[PaymentHistory] Successfully fetched ${res.data.length} total parcels.`);
                    console.log(`[PaymentHistory] Filtered ${paidParcels.length} paid parcels for user.`);
                    
                    setPayments(paidParcels);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('[PaymentHistory] Failed to fetch payment history:', err.response || err.message || err);
                    setLoading(false);
                });
        }
    }, [user, axiosSecure]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Payment History</h1>
                <p className="text-gray-500 mt-1">View all your successful transactions</p>
            </div>
            
            {/* Stats Card */}
            <div className="bg-linear-to-br from-[#03373D] to-[#025a63] rounded-2xl p-6 text-white mb-8 shadow-xl max-w-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-0.5">Total Paid</p>
                        <h2 className="text-3xl font-extrabold">
                            ৳{payments.reduce((sum, p) => sum + (parseFloat(p.totalCost || p.price || 0)), 0)}
                        </h2>
                    </div>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-500">You haven't made any payments yet. When you pay for a parcel, your receipt will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="hidden md:grid grid-cols-6 gap-4 px-8 py-5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Transaction Details</div>
                        <div>Date</div>
                        <div>Method</div>
                        <div>Amount</div>
                        <div className="text-right">Status</div>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {payments.map(payment => (
                            <div key={payment._id} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-8 py-6 items-center hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-2">
                                    <p className="font-bold text-gray-900 mb-1">{payment.parcelName || payment.name || 'Parcel Booking'}</p>
                                    <p className="text-xs font-mono text-gray-400 truncate pr-4">ID: {payment.transactionId || payment._id}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">
                                        {payment.paymentDate 
                                            ? new Date(payment.paymentDate).toLocaleDateString() 
                                            : new Date().toLocaleDateString()
                                        }
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {payment.paymentDate 
                                            ? new Date(payment.paymentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                                            : ''
                                        }
                                    </p>
                                </div>
                                
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                        {payment.paymentMethod || 'Card'}
                                    </span>
                                </div>
                                
                                <div>
                                    <p className="text-base font-extrabold text-gray-900">৳{payment.totalCost || payment.price}</p>
                                </div>
                                
                                <div className="flex md:justify-end">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Successful
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;