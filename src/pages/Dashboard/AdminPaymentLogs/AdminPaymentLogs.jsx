import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import CountUp from 'react-countup';

const AdminPaymentLogs = () => {
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch all parcels, then we'll filter only the paid ones locally for the logs
        axiosSecure.get('/all-parcels')
            .then(res => {
                const paidParcels = res.data.filter(p => p.paymentStatus === 'paid');
                // Sort by payment date descending (or latest ID fallback)
                paidParcels.sort((a, b) => {
                    const timeA = a.paymentDate ? new Date(a.paymentDate).getTime() : (a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const timeB = b.paymentDate ? new Date(b.paymentDate).getTime() : (b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return timeB - timeA;
                });
                setPayments(paidParcels);
                setLoading(false);
            })
            .catch(err => {
                console.error('[AdminPaymentLogs] Error fetching payments:', err);
                setLoading(false);
            });
    }, [axiosSecure]);

    // Local filtering by transaction ID (and potentially receiver phone or email as fallback)
    const filteredPayments = payments.filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
            (p._id && p._id.toLowerCase().includes(q)) ||
            (p.senderEmail && p.senderEmail.toLowerCase().includes(q)) ||
            (p.receiverPhone && p.receiverPhone.includes(q))
        );
    });

    const getPaymentMethodUI = (method, accNumber) => {
        const lowerMethod = method?.toLowerCase() || '';
        let ui = { colorClass: 'bg-gray-100 text-gray-700 border-gray-200', label: method || 'Card' };
        
        if (lowerMethod.includes('bkash')) {
            ui = { colorClass: 'bg-pink-100 text-pink-700 border-pink-200', label: 'bKash' };
        } else if (lowerMethod.includes('nagad')) {
            ui = { colorClass: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Nagad' };
        } else if (lowerMethod.includes('bank')) {
            ui = { colorClass: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Bank' };
        }
        
        return (
            <div className="flex flex-col gap-1 items-start">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${ui.colorClass}`}>
                    {ui.label}
                </span>
                {accNumber && (
                    <span className="text-[10px] text-gray-500 font-mono tracking-tight">{accNumber}</span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-9 w-64 bg-gray-200 rounded-xl mb-3"></div>
                    <div className="h-4 w-96 max-w-full bg-gray-100 rounded-lg"></div>
                </div>
                {/* Stats Card Skeleton */}
                <div className="h-28 w-full max-w-sm bg-gray-200 rounded-2xl mb-8"></div>
                
                {/* Search Bar Skeleton */}
                <div className="flex justify-end mb-4">
                    <div className="h-12 w-full md:w-80 bg-gray-200 rounded-xl"></div>
                </div>
                
                {/* Table Skeleton */}
                <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                    <div className="h-14 bg-gray-50 border-b border-gray-100"></div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-24 border-b border-gray-50 flex items-center px-8 gap-6">
                            <div className="h-4 bg-gray-200 rounded w-[25%]"></div>
                            <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
                            <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
                            <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
                            <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
                            <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Payment Logs</h1>
                <p className="text-gray-500 mt-1">Review all successful transactions across the platform.</p>
            </div>

            {/* Total Collected Stats */}
            <div className="bg-linear-to-br from-[#03373D] to-[#025a63] rounded-2xl p-6 text-white mb-8 shadow-xl max-w-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-0.5">Total Revenue</p>
                        <h2 className="text-3xl font-extrabold flex items-center pr-1">
                            ৳<CountUp end={payments.reduce((sum, p) => sum + (parseFloat(p.totalCost || p.price || 0)), 0)} separator="," duration={2.5} />
                        </h2>
                    </div>
                </div>
            </div>

            {/* Search Controls (Above table) */}
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-4">
                <div className="relative w-full md:w-80 border-2 border-gray-100 rounded-xl bg-white shadow-sm focus-within:border-[#03373D]/30 focus-within:ring-4 focus-within:ring-[#03373D]/10 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Transaction ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 rounded-xl border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Logs Table */}
            {filteredPayments.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-gray-500">
                        {searchQuery ? `No matching transaction found for "${searchQuery}".` : "There are currently no paid parcels in the system."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="hidden lg:grid grid-cols-7 gap-4 px-8 py-5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Sender & Parcel</div>
                        <div>Receiver</div>
                        <div>Date</div>
                        <div>Method & Acc</div>
                        <div>Amount</div>
                        <div className="text-right">Trans. ID</div>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {filteredPayments.map(payment => (
                            <div key={payment._id} className="grid grid-cols-1 lg:grid-cols-7 gap-4 px-8 py-6 items-center hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-2">
                                    <p className="font-bold text-gray-900 mb-1">{payment.senderName || 'N/A'}</p>
                                    {/* <p className="text-xs text-gray-500">{payment.senderEmail || 'N/A'}</p> */}
                                    <p className="text-xs text-blue-600 font-medium mt-1 truncate pr-4">{payment.parcelName || payment.name}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">{payment.receiverName || 'N/A'}</p>
                                    <p className="text-xs text-gray-400">{payment.receiverPhone || 'N/A'}</p>
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
                                    {getPaymentMethodUI(
                                        payment.paymentMethod || payment.paymentType, 
                                        payment.paymentNumber || payment.accountNumber || payment.senderNumber
                                    )}
                                </div>
                                
                                <div>
                                    <p className="text-base font-extrabold text-gray-900">৳{payment.totalCost || payment.price}</p>
                                </div>
                                
                                <div className="flex lg:justify-end">
                                    <span className="font-mono text-[11px] px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg flex items-center shrink-0 border border-gray-200">
                                        {payment.transactionId || payment._id}
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

export default AdminPaymentLogs;
