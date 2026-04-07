import { useMemo, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate } from '../RiderShared/riderUtils';

const MIN_WITHDRAWAL = 100;

const RiderEarnings = () => {
    const axiosSecure = useAxiosSecure();
    const { user, completedTasks, transactions, paymentMethods, stats, loading, refetch } = useRiderDashboardData();
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawNumber, setWithdrawNumber] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const paymentLogs = useMemo(() => completedTasks.map(parcel => ({
        id: parcel._id,
        date: parcel.deliveredAt || parcel.updatedAt || parcel.pickupDate,
        parcelId: parcel._id?.slice(-6),
        amount: parcel.riderReward,
    })), [completedTasks]);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);

        if (!amount || amount < MIN_WITHDRAWAL || amount > stats.currentBalance || !withdrawNumber.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            await axiosSecure.post('/withdraw', {
                email: user?.email,
                amount,
                number: withdrawNumber,
                methodId: selectedMethod || undefined,
                channel: selectedMethod ? undefined : 'mobile',
            });

            setWithdrawAmount('');
            setWithdrawNumber('');
            refetch();
        } catch (err) {
            console.error('Failed to request rider withdrawal:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <RiderAccessGate>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500 font-medium">Loading earnings...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Earnings</h1>
                    <p className="text-gray-500 mt-1">Track your balance, request withdrawals, and review payment logs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <MoneyCard title="Total Earnings" value={formatCurrency(stats.totalEarnings)} />
                    <MoneyCard title="Current Balance" value={formatCurrency(stats.currentBalance)} />
                    <MoneyCard title="Delivered Jobs" value={stats.completedCount} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.6fr] gap-8 items-start">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900">Withdraw Earnings</h2>
                        <p className="text-sm text-gray-500 mt-1">Send your balance to bKash or Nagad whenever you are ready.</p>

                        <form onSubmit={handleWithdraw} className="space-y-5 mt-6">
                            <Field label="Mobile Banking Number">
                                <input
                                    type="tel"
                                    value={withdrawNumber}
                                    onChange={(e) => setWithdrawNumber(e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20"
                                />
                            </Field>

                            <Field label="Amount">
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    min={MIN_WITHDRAWAL}
                                    max={stats.currentBalance}
                                    placeholder={`Minimum ${MIN_WITHDRAWAL}`}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20"
                                />
                            </Field>

                            {paymentMethods.length > 0 && (
                                <Field label="Saved Method">
                                    <select
                                        value={selectedMethod}
                                        onChange={(e) => setSelectedMethod(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 cursor-pointer"
                                    >
                                        <option value="">Use typed number</option>
                                        {paymentMethods.map(method => (
                                            <option key={method.id} value={method.id}>{method.name} - {method.details}</option>
                                        ))}
                                    </select>
                                </Field>
                            )}

                            <button
                                type="submit"
                                disabled={submitting || !withdrawNumber || !withdrawAmount}
                                className="w-full py-4 rounded-2xl bg-[#03373D] text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#025a63] transition disabled:opacity-50 cursor-pointer"
                            >
                                {submitting ? 'Submitting...' : 'Withdraw'}
                            </button>

                            <p className="text-xs text-gray-400">Minimum withdrawal is ৳{MIN_WITHDRAWAL}. If transaction history is unavailable, current balance falls back to your delivered earnings total.</p>
                        </form>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Payment Logs</h2>
                            <p className="text-sm text-gray-500 mt-1">Date, parcel, and amount earned from successful deliveries.</p>
                        </div>

                        {paymentLogs.length === 0 ? (
                            <div className="p-12 text-center">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No payment logs yet</h3>
                                <p className="text-gray-500 text-sm">Each delivered parcel will create an earning record here.</p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                                    <div>Date</div>
                                    <div>Parcel ID</div>
                                    <div className="text-right">Earned</div>
                                </div>
                                {paymentLogs.map(log => (
                                    <div key={log.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0">
                                        <div className="font-semibold text-gray-900">{formatDate(log.date)}</div>
                                        <div className="text-gray-600">#{log.parcelId}</div>
                                        <div className="md:text-right font-black text-emerald-600">{formatCurrency(log.amount)}</div>
                                    </div>
                                ))}
                            </>
                        )}

                        {transactions.length > 0 && (
                            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50">
                                <p className="text-sm text-gray-500">Recorded balance ledger entries: <span className="font-bold text-gray-900">{transactions.length}</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RiderAccessGate>
    );
};

const Field = ({ label, children }) => (
    <label className="block">
        <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
        {children}
    </label>
);

const MoneyCard = ({ title, value }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">{title}</p>
        <p className="text-3xl font-black text-gray-900 mt-4">{value}</p>
    </div>
);

export default RiderEarnings;
