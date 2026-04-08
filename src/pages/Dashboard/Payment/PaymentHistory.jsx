import { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const generateInvoice = (payment) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(3, 55, 61); // #03373D
        doc.text('ZaDEX', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Invoice for Parcel Booking', 14, 30);
        doc.text(`Transaction ID: ${payment.transactionId || payment._id}`, 14, 36);
        doc.text(`Date: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}`, 14, 42);

        // Sender & Receiver Details
        autoTable(doc, {
            startY: 50,
            head: [['Sender Details', 'Receiver Details']],
            body: [
                [
                    `${payment.senderName || user?.displayName || 'N/A'}\n${payment.senderPhone || ''}\n${payment.senderDistrict || ''}`, 
                    `${payment.receiverName || 'N/A'}\n${payment.receiverPhone || ''}\n${payment.receiverDistrict || ''}`
                ],
            ],
            theme: 'grid',
            headStyles: { fillColor: [3, 55, 61] }
        });

        // Payment Details
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [['Description', 'Payment Method', 'Amount']],
            body: [
                [
                    payment.parcelName || payment.name || 'Parcel Booking',
                    `${payment.paymentMethod || 'Card'} ${payment.paymentNumber || payment.accountNumber || payment.senderNumber ? `(${payment.paymentNumber || payment.accountNumber || payment.senderNumber})` : ''}`,
                    `BDT ${payment.totalCost || payment.price || 0}`
                ],
            ],
            theme: 'striped',
            headStyles: { fillColor: [3, 55, 61] }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for choosing ZaDEX!', 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

        doc.save(`Invoice_${payment.transactionId || payment._id}.pdf`);
    };

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
                    <div className="hidden xl:grid grid-cols-7 gap-4 px-8 py-5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-2">Transaction Details</div>
                        <div>Receiver</div>
                        <div>Date</div>
                        <div>Method & Acc</div>
                        <div>Amount</div>
                        <div className="text-right">Action</div>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {payments.map(payment => (
                            <div key={payment._id} className="grid grid-cols-1 xl:grid-cols-7 gap-4 px-8 py-6 items-center hover:bg-gray-50/50 transition-colors">
                                <div className="col-span-2">
                                    <p className="font-bold text-gray-900 mb-1">{payment.parcelName || payment.name || 'Parcel Booking'}</p>
                                    <p className="text-xs font-mono text-gray-400 truncate pr-4">ID: {payment.transactionId || payment._id}</p>
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
                                
                                <div className="flex xl:justify-end items-center gap-3">
                                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Success
                                    </span>
                                    <button 
                                        onClick={() => generateInvoice(payment)}
                                        className="p-2 sm:px-3 sm:py-1.5 bg-[#03373D]/5 text-[#03373D] border border-[#03373D]/10 hover:bg-[#03373D] hover:text-white rounded-xl transition flex items-center gap-1.5"
                                        title="Download Invoice PDF"
                                    >
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                        <span className="text-xs font-bold sm:hidden">Invoice</span>
                                    </button>
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