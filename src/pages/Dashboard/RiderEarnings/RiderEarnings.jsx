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
        parcelName: parcel.parcelName || 'Parcel Delivery',
        receiverName: parcel.receiverName || 'Unknown receiver',
        receiverPhone: parcel.receiverPhone || 'No phone',
        route: `${parcel.senderDistrict || 'Pickup'} to ${parcel.receiverDistrict || 'Drop-off'}`,
        paymentStatus: parcel.paymentStatus || 'earned',
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
                <div className="flex min-h-[42vh] items-center justify-center rounded-2xl border border-gray-100 bg-white">
                    <p className="text-sm font-semibold text-gray-500">Loading earnings...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">My Earnings</h1>
                        <p className="mt-1 text-sm text-gray-500">Track balance, withdrawals, and delivery payment logs.</p>
                    </div>
                    <div className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                        {paymentLogs.length} logs
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <MoneyCard title="Total Earnings" value={formatCurrency(stats.totalEarnings)} theme="emerald" />
                    <MoneyCard title="Current Balance" value={formatCurrency(stats.currentBalance)} theme="sky" />
                    <MoneyCard title="Delivered Jobs" value={stats.completedCount} theme="amber" />
                    <MoneyCard title="Ledger Entries" value={transactions.length} theme="indigo" />
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-1 border-b border-gray-100 pb-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Withdraw Earnings</h2>
                            <p className="text-sm text-gray-500">Minimum ৳{MIN_WITHDRAWAL}. Current balance {formatCurrency(stats.currentBalance)}.</p>
                        </div>
                    </div>

                    <form onSubmit={handleWithdraw} className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_0.8fr_1fr_auto] lg:items-end">
                        <Field label="Mobile Banking Number">
                            <input
                                type="tel"
                                value={withdrawNumber}
                                onChange={(e) => setWithdrawNumber(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20"
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
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20"
                            />
                        </Field>

                        {paymentMethods.length > 0 ? (
                            <Field label="Saved Method">
                                <select
                                    value={selectedMethod}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 cursor-pointer"
                                >
                                    <option value="">Use typed number</option>
                                    {paymentMethods.map(method => (
                                        <option key={method.id} value={method.id}>{method.name} - {method.details}</option>
                                    ))}
                                </select>
                            </Field>
                        ) : (
                            <div className="hidden lg:block" />
                        )}

                        <button
                            type="submit"
                            disabled={submitting || !withdrawNumber || !withdrawAmount}
                            className="rounded-xl bg-[#03373D] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            {submitting ? 'Submitting...' : 'Withdraw'}
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Payment Logs</h2>
                            <p className="text-sm text-gray-500">Full-width earnings records from completed deliveries.</p>
                        </div>
                        <p className="text-xs font-semibold text-gray-500">{transactions.length} ledger entries</p>
                    </div>

                    {paymentLogs.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <h3 className="mb-2 text-lg font-bold text-gray-900">No payment logs yet</h3>
                            <p className="text-sm text-gray-500">Each delivered parcel will create an earning record here.</p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden grid-cols-[0.85fr_1.2fr_1fr_0.85fr_1.25fr_0.75fr_0.75fr_0.75fr] gap-3 bg-gray-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 xl:grid">
                                <div>Date</div>
                                <div>Parcel</div>
                                <div>Receiver</div>
                                <div>Phone</div>
                                <div>Route</div>
                                <div>Status</div>
                                <div>Parcel ID</div>
                                <div className="text-right">Earned</div>
                            </div>

                            {paymentLogs.map(log => (
                                <div key={log.id}>
                                    <div className="grid grid-cols-1 gap-2 px-4 py-3 transition hover:bg-emerald-100/70 xl:grid-cols-[0.85fr_1.2fr_1fr_0.85fr_1.25fr_0.75fr_0.75fr_0.75fr] xl:items-center xl:gap-3">
                                        <DataCell label="Date" value={formatDate(log.date)} />
                                        <DataCell label="Parcel" value={log.parcelName} strong />
                                        <DataCell label="Receiver" value={log.receiverName} />
                                        <DataCell label="Phone" value={log.receiverPhone} />
                                        <DataCell label="Route" value={log.route} />
                                        <DataCell label="Status" value={log.paymentStatus} />
                                        <DataCell label="Parcel ID" value={`#${log.parcelId || 'N/A'}`} />
                                        <div className="flex items-center justify-between gap-3 xl:block xl:text-right">
                                            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 xl:hidden">Earned</span>
                                            <p className="text-sm font-black text-emerald-600">{formatCurrency(log.amount)}</p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-200" />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </RiderAccessGate>
    );
};

const Field = ({ label, children }) => (
    <label className="block">
        <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-gray-500">{label}</span>
        {children}
    </label>
);

const moneyThemes = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
};

const MoneyCard = ({ title, value, theme = 'emerald' }) => (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${moneyThemes[theme]}`}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] opacity-75">{title}</p>
        <p className="mt-1 text-xl font-black">{value}</p>
    </div>
);

const DataCell = ({ label, value, strong = false }) => (
    <div className="flex min-w-0 items-center justify-between gap-3 xl:block">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 xl:hidden">{label}</span>
        <p className={`min-w-0 truncate text-sm ${strong ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>{value}</p>
    </div>
);

export default RiderEarnings;
