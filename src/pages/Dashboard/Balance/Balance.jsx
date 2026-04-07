import { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

// SVG icons
const BankIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 10V7l7-4 7 4v3M9 21v-5a1 1 0 011-1h4a1 1 0 011 1v5" />
    </svg>
);

const MobileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1M3 6h18a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z" />
    </svg>
);

const MIN_WITHDRAWAL = 100;

// Simple in-component toast
const Toast = ({ toasts, dismiss }) => (
    <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none">
        {toasts.map(t => (
            <div
                key={t.id}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white pointer-events-auto transition-all
                    ${t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-500' : 'bg-gray-700'}`}
            >
                {t.type === 'success' && (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {t.type === 'error' && (
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span>{t.message}</span>
                <button onClick={() => dismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">✕</button>
            </div>
        ))}
    </div>
);

const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const show = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));
    return { toasts, dismiss, success: m => show(m, 'success'), error: m => show(m, 'error') };
};

const Balance = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const toast = useToast();

    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [newMethod, setNewMethod] = useState({ type: 'bank', name: '', details: '' });
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [confirmWithdraw, setConfirmWithdraw] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [txFilter, setTxFilter] = useState('all');
    const [txVisible, setTxVisible] = useState(5);

    useEffect(() => {
        if (user?.email) {
            fetchBalanceData();
        }
    }, [user]);

    const fetchBalanceData = async () => {
        setLoading(true);
        try {
            const [balanceRes, transactionsRes, methodsRes] = await Promise.all([
                axiosSecure.get(`/balance?email=${user.email}`),
                axiosSecure.get(`/transactions?email=${user.email}`),
                axiosSecure.get(`/payment-methods?email=${user.email}`)
            ]);
            setBalance(balanceRes.data.balance || 0);
            setTransactions(transactionsRes.data || []);
            setPaymentMethods(methodsRes.data || []);
            if (methodsRes.data.length > 0) setSelectedMethod(methodsRes.data[0].id);
        } catch {
            // Mock data for demonstration
            setBalance(1250.75);
            setTransactions([
                { id: 1, date: '2026-04-01', description: 'Parcel Delivery Fee', amount: 150.00, type: 'credit' },
                { id: 2, date: '2026-04-10', description: 'Withdrawal to Bank', amount: -500.00, type: 'debit' },
                { id: 3, date: '2026-03-05', description: 'Parcel Delivery Fee', amount: 200.00, type: 'credit' },
                { id: 4, date: '2026-03-01', description: 'Service Charge', amount: -25.00, type: 'debit' },
                { id: 5, date: '2026-02-28', description: 'Parcel Delivery Fee', amount: 175.50, type: 'credit' },
                { id: 6, date: '2026-02-20', description: 'Parcel Delivery Fee', amount: 300.00, type: 'credit' },
                { id: 7, date: '2026-02-15', description: 'Service Charge', amount: -15.00, type: 'debit' },
            ]);
            setPaymentMethods([
                { id: '1', type: 'bank', name: 'DBBL Bank', details: 'Account ****1234' },
                { id: '2', type: 'mobile', name: 'bKash', details: '017********' },
            ]);
            setSelectedMethod('1');
        } finally {
            setLoading(false);
        }
    };

    // Fix: filter by current month only
    const now = new Date();
    const thisMonthCredits = transactions
        .filter(t => {
            const d = new Date(t.date);
            return t.type === 'credit' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawn = Math.abs(
        transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)
    );

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        if (!withdrawAmount || amount <= 0) return toast.error('Please enter a valid amount');
        if (amount < MIN_WITHDRAWAL) return toast.error(`Minimum withdrawal is ৳${MIN_WITHDRAWAL}`);
        if (amount > balance) return toast.error('Insufficient balance');
        if (!selectedMethod) return toast.error('Please select a payment method');
        setConfirmWithdraw(true);
    };

    const handleWithdrawConfirm = async () => {
        setWithdrawing(true);
        try {
            const response = await axiosSecure.post('/withdraw', {
                email: user.email,
                amount: parseFloat(withdrawAmount),
                methodId: selectedMethod
            });
            if (response.data.success) {
                toast.success('Withdrawal request submitted successfully!');
                setWithdrawAmount('');
                setConfirmWithdraw(false);
                fetchBalanceData();
            }
        } catch {
            toast.error('Withdrawal failed. Please try again.');
        } finally {
            setWithdrawing(false);
            setConfirmWithdraw(false);
        }
    };

    const handleAddPaymentMethod = async (e) => {
        e.preventDefault();
        if (!newMethod.name.trim()) return toast.error('Please enter a name for this payment method');
        if (!newMethod.details.trim()) return toast.error('Please enter payment method details');
        try {
            const response = await axiosSecure.post('/payment-methods', {
                email: user.email,
                type: newMethod.type,
                name: newMethod.name,
                details: newMethod.details
            });
            if (response.data.success) {
                toast.success('Payment method added successfully!');
                setNewMethod({ type: 'bank', name: '', details: '' });
                setShowAddMethod(false);
                fetchBalanceData();
            }
        } catch {
            toast.error('Failed to add payment method. Please try again.');
        }
    };

    const handleRemoveMethod = async (methodId) => {
        try {
            await axiosSecure.delete(`/payment-methods/${methodId}?email=${user.email}`);
            toast.success('Payment method removed.');
            setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
            if (selectedMethod === methodId) {
                const remaining = paymentMethods.filter(m => m.id !== methodId);
                setSelectedMethod(remaining.length > 0 ? remaining[0].id : '');
            }
        } catch {
            toast.error('Failed to remove payment method.');
        }
    };

    const filteredTransactions = transactions.filter(t =>
        txFilter === 'all' ? true : t.type === txFilter
    );

    const methodForWithdraw = paymentMethods.find(m => m.id === selectedMethod);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <svg className="w-8 h-8 animate-spin text-[#03373D] mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="mt-4 text-gray-500">Loading balance information...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toast toasts={toast.toasts} dismiss={toast.dismiss} />

            {/* Withdrawal Confirmation Modal */}
            {confirmWithdraw && (
                <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Withdrawal</h3>
                        <p className="text-sm text-gray-500 mb-4">Please review the details before confirming.</p>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm mb-5">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Amount</span>
                                <span className="font-bold text-gray-900">৳{parseFloat(withdrawAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Processing fee (1%)</span>
                                <span className="font-medium text-gray-700">-৳{(parseFloat(withdrawAmount) * 0.01).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="text-gray-500">You receive</span>
                                <span className="font-bold text-emerald-600">৳{(parseFloat(withdrawAmount) * 0.99).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">To</span>
                                <span className="font-medium text-gray-700">{methodForWithdraw?.name} · {methodForWithdraw?.details}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmWithdraw(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdrawConfirm}
                                disabled={withdrawing}
                                className="flex-1 py-3 rounded-xl bg-[#03373D] text-white text-sm font-bold transition hover:bg-[#025a63] disabled:opacity-60 cursor-pointer"
                            >
                                {withdrawing ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">My Balance</h1>
                    <p className="text-gray-500 mt-1">Manage your earnings and payment methods</p>
                </div>

                {/* Balance Overview Card */}
                <div className="bg-gradient-to-br from-[#03373D] to-[#025a63] rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-white/80">Current Balance</p>
                            <p className="text-5xl font-black mt-2">৳{balance.toFixed(2)}</p>
                            <p className="text-sm text-white/60 mt-2">Available for withdrawal</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-white/20 rounded-xl p-4 min-w-[130px]">
                                <p className="text-xs font-bold uppercase tracking-wider">This Month</p>
                                <p className="text-2xl font-black">৳{thisMonthCredits.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/20 rounded-xl p-4 min-w-[130px]">
                                <p className="text-xs font-bold uppercase tracking-wider">Total Withdrawn</p>
                                <p className="text-2xl font-black">৳{totalWithdrawn.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Withdrawal Form */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Withdraw Funds</h2>
                            <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw (৳)</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all"
                                        min={MIN_WITHDRAWAL}
                                        max={balance}
                                        step="0.01"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <p className="text-xs text-gray-400">Minimum: ৳{MIN_WITHDRAWAL}</p>
                                        <p className="text-xs text-gray-400">Maximum: ৳{balance.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    {paymentMethods.length > 0 ? (
                                        <select
                                            value={selectedMethod}
                                            onChange={(e) => setSelectedMethod(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all cursor-pointer"
                                        >
                                            {paymentMethods.map(method => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name} – {method.details}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No payment methods added. Please add one below.</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={!withdrawAmount || parseFloat(withdrawAmount) < MIN_WITHDRAWAL || paymentMethods.length === 0}
                                    className="w-full py-4 bg-[#03373D] text-white text-sm font-bold uppercase tracking-widest rounded-2xl shadow-lg hover:scale-[1.01] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Request Withdrawal
                                </button>
                            </form>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Withdrawal requests are processed within 1–3 business days. A 1% processing fee applies.
                                </p>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
                                <button
                                    onClick={() => setShowAddMethod(!showAddMethod)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition cursor-pointer"
                                >
                                    {showAddMethod ? 'Cancel' : 'Add New'}
                                </button>
                            </div>

                            {showAddMethod && (
                                <form onSubmit={handleAddPaymentMethod} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <select
                                            value={newMethod.type}
                                            onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all cursor-pointer"
                                        >
                                            <option value="bank">Bank Account</option>
                                            <option value="mobile">Mobile Banking</option>
                                            <option value="card">Card</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={newMethod.name}
                                            onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                                            placeholder="e.g., DBBL Bank, bKash"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                                        <input
                                            type="text"
                                            value={newMethod.details}
                                            onChange={(e) => setNewMethod({ ...newMethod, details: e.target.value })}
                                            placeholder="e.g., Account number, bKash number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                                    >
                                        Add Payment Method
                                    </button>
                                </form>
                            )}

                            {paymentMethods.length > 0 ? (
                                <div className="space-y-4">
                                    {paymentMethods.map(method => (
                                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                    method.type === 'bank' ? 'bg-blue-100 text-blue-600' :
                                                    method.type === 'mobile' ? 'bg-green-100 text-green-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                    {method.type === 'bank' ? <BankIcon /> : method.type === 'mobile' ? <MobileIcon /> : <CardIcon />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{method.name}</p>
                                                    <p className="text-sm text-gray-500">{method.details}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveMethod(method.id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium cursor-pointer shrink-0 ml-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No payment methods added yet.</p>
                                    <p className="text-sm text-gray-400 mt-2">Add a payment method to withdraw your earnings.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Transaction History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
                            <select
                                value={txFilter}
                                onChange={(e) => { setTxFilter(e.target.value); setTxVisible(5); }}
                                className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 cursor-pointer"
                            >
                                <option value="all">All</option>
                                <option value="credit">Credits</option>
                                <option value="debit">Debits</option>
                            </select>
                        </div>

                        {filteredTransactions.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {filteredTransactions.slice(0, txVisible).map(transaction => (
                                        <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                                            <div>
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                            <div className={`text-right shrink-0 ml-4 ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                <p className="font-bold">{transaction.type === 'credit' ? '+' : '-'}৳{Math.abs(transaction.amount).toFixed(2)}</p>
                                                <p className="text-xs uppercase font-medium">{transaction.type === 'credit' ? 'Credit' : 'Debit'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {filteredTransactions.length > txVisible && (
                                    <button
                                        onClick={() => setTxVisible(v => v + 5)}
                                        className="w-full mt-4 py-2.5 text-sm font-medium text-[#03373D] border border-[#03373D]/30 rounded-xl hover:bg-[#03373D]/5 transition cursor-pointer"
                                    >
                                        Show more
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No transactions found.</p>
                                <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here.</p>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Credits</span>
                                <span className="font-bold text-emerald-600">
                                    +৳{transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-500">Total Debits</span>
                                <span className="font-bold text-red-600">
                                    -৳{totalWithdrawn.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Balance;
