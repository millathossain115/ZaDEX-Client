import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import CountUp from 'react-countup';
import { AdminPaymentLogsLoader } from '../../../components/ui';

const AdminPaymentLogs = () => {
    const axiosSecure = useAxiosSecure();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [methodFilter, setMethodFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

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

    const getPaymentAmount = (payment) => parseFloat(payment.totalCost || payment.price || 0) || 0;

    const getPaymentDate = (payment) => {
        const fallbackTime = payment._id ? parseInt(payment._id.substring(0, 8), 16) * 1000 : 0;
        const date = new Date(payment.paymentDate || fallbackTime || 0);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const getPaymentMethodKey = (method) => {
        const lowerMethod = method?.toLowerCase() || '';
        if (lowerMethod.includes('bkash')) return 'bkash';
        if (lowerMethod.includes('nagad')) return 'nagad';
        if (lowerMethod.includes('bank')) return 'bank';
        return 'card';
    };

    const isWithinDateFilter = (payment) => {
        if (dateFilter === 'all') return true;

        const paymentDate = getPaymentDate(payment);
        if (!paymentDate) return false;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === 'today') {
            return paymentDate >= startOfToday;
        }

        const days = dateFilter === '7d' ? 7 : 30;
        const startDate = new Date(startOfToday);
        startDate.setDate(startDate.getDate() - (days - 1));
        return paymentDate >= startDate;
    };

    const filteredPayments = (() => {
        const q = searchQuery.trim().toLowerCase();

        return payments.filter(payment => {
            const paymentMethod = payment.paymentMethod || payment.paymentType;
            const matchesMethod = methodFilter === 'all' || getPaymentMethodKey(paymentMethod) === methodFilter;
            const matchesDate = isWithinDateFilter(payment);

            if (!matchesMethod || !matchesDate) return false;
            if (!q) return true;

            return [
                payment.transactionId,
                payment._id,
                payment.senderName,
                payment.senderEmail,
                payment.receiverName,
                payment.receiverPhone,
                payment.parcelName,
                payment.name,
            ].some(value => (value || '').toString().toLowerCase().includes(q));
        });
    })();

    const totalRevenue = payments.reduce((sum, payment) => sum + getPaymentAmount(payment), 0);
    const filteredRevenue = filteredPayments.reduce((sum, payment) => sum + getPaymentAmount(payment), 0);
    const averagePayment = payments.length ? Math.round(totalRevenue / payments.length) : 0;
    const latestPaymentDate = payments[0] ? getPaymentDate(payments[0]) : null;

    const kpiCards = [
        {
            label: 'Total Revenue',
            value: totalRevenue,
            prefix: '৳',
            suffix: '',
            note: `${payments.length} successful payments`,
            theme: 'primary',
        },
        {
            label: 'Filtered Revenue',
            value: filteredRevenue,
            prefix: '৳',
            suffix: '',
            note: `${filteredPayments.length} visible records`,
            theme: 'emerald',
        },
        {
            label: 'Average Payment',
            value: averagePayment,
            prefix: '৳',
            suffix: '',
            note: 'Per successful parcel',
            theme: 'blue',
        },
        {
            label: 'Latest Payment',
            value: latestPaymentDate ? latestPaymentDate.toLocaleDateString() : 'No payments',
            note: latestPaymentDate ? latestPaymentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Waiting for first record',
            theme: 'amber',
            textValue: true,
        },
    ];

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
        return <AdminPaymentLogsLoader />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Payment Logs</h1>
                <p className="text-gray-500 mt-1">Review all successful transactions across the platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map(card => (
                    <KpiCard key={card.label} card={card} />
                ))}
            </div>

            {/* Search Controls (Above table) */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full border-2 border-gray-100 rounded-xl bg-white focus-within:border-[#03373D]/30 focus-within:ring-4 focus-within:ring-[#03373D]/10 transition-all lg:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search transaction, sender, receiver, parcel..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 rounded-xl border-none focus:ring-0 text-sm placeholder-gray-400"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="h-12 rounded-xl border-2 border-gray-100 bg-white px-3 text-sm font-bold text-gray-600 outline-none transition focus:border-[#03373D]/30 focus:ring-4 focus:ring-[#03373D]/10 cursor-pointer"
                    >
                        <option value="all">All methods</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                        <option value="bank">Bank</option>
                        <option value="card">Card / Other</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="h-12 rounded-xl border-2 border-gray-100 bg-white px-3 text-sm font-bold text-gray-600 outline-none transition focus:border-[#03373D]/30 focus:ring-4 focus:ring-[#03373D]/10 cursor-pointer"
                    >
                        <option value="all">All dates</option>
                        <option value="today">Today</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                    </select>
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
                        {searchQuery || methodFilter !== 'all' || dateFilter !== 'all'
                            ? 'No matching transaction found for the selected search or filters.'
                            : 'There are currently no paid parcels in the system.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                            <div key={payment._id} className="grid grid-cols-1 lg:grid-cols-7 gap-4 px-8 py-6 items-center hover:bg-emerald-50/70 transition-colors">
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

const cardThemes = {
    primary: 'bg-linear-to-br from-[#03373D] to-[#025a63] text-white border-transparent shadow-xl shadow-[#03373D]/15 hover:shadow-[#03373D]/25',
    emerald: 'bg-white text-gray-900 border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-100',
    blue: 'bg-white text-gray-900 border-blue-100 hover:border-blue-200 hover:shadow-blue-100',
    amber: 'bg-white text-gray-900 border-amber-100 hover:border-amber-200 hover:shadow-amber-100',
};

const iconThemes = {
    primary: 'bg-white/20 text-white',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
};

const KpiCard = ({ card }) => (
    <div className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${cardThemes[card.theme]}`}>
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-widest ${card.theme === 'primary' ? 'text-white/60' : 'text-gray-400'}`}>
                    {card.label}
                </p>
                <h2 className="mt-2 min-w-0 truncate text-3xl font-extrabold leading-tight">
                    {card.textValue ? (
                        card.value
                    ) : (
                        <>
                            {card.prefix}<CountUp end={card.value} separator="," duration={2.2} />{card.suffix}
                        </>
                    )}
                </h2>
                <p className={`mt-2 text-xs font-semibold ${card.theme === 'primary' ? 'text-white/60' : 'text-gray-500'}`}>
                    {card.note}
                </p>
            </div>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconThemes[card.theme]}`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 10v-1m9-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    </div>
);

export default AdminPaymentLogs;
