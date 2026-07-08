import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate } from '../RiderShared/riderUtils';
import { RiderCompletedLoader } from '../../../components/loaders';

const RiderCompleted = () => {
    const { completedTasks, loading } = useRiderDashboardData();

    if (loading) {
        return <RiderAccessGate><RiderCompletedLoader /></RiderAccessGate>;
    }

    const totalEarned = completedTasks.reduce((sum, parcel) => sum + Number(parcel.riderReward || 0), 0);
    const averageEarned = completedTasks.length ? totalEarned / completedTasks.length : 0;
    const latestDelivered = completedTasks.reduce((latest, parcel) => {
        const value = parcel.deliveredAt || parcel.updatedAt || parcel.pickupDate;
        const time = new Date(value || 0).getTime();
        return time > latest.time ? { time, value } : latest;
    }, { time: 0, value: '' });

    return (
        <RiderAccessGate>
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Completed</h1>
                        <p className="mt-1 text-sm text-gray-500">Delivered parcels and completed rider earnings.</p>
                    </div>
                    <div className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                        {completedTasks.length} delivered
                    </div>
                </div>

                {completedTasks.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-8 text-center shadow-sm">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">No completed deliveries yet</h3>
                        <p className="text-sm text-gray-500">Delivered parcels will start building your history here.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <KpiCard label="Total Earned" value={formatCurrency(totalEarned)} theme="emerald" />
                            <KpiCard label="Average Earned" value={formatCurrency(averageEarned)} theme="sky" />
                            <KpiCard label="Latest Delivery" value={latestDelivered.value ? formatDate(latestDelivered.value) : 'Not available'} theme="amber" />
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="hidden grid-cols-[1.2fr_1.3fr_1fr_0.9fr_0.9fr_0.8fr_0.8fr] gap-3 bg-gray-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 lg:grid">
                                <div>Parcel</div>
                                <div>Route</div>
                                <div>Receiver</div>
                                <div>Phone</div>
                                <div>Delivered</div>
                                <div>Parcel ID</div>
                                <div className="text-right">Earned</div>
                            </div>

                            {completedTasks.map(parcel => (
                                <div key={parcel._id}>
                                    <div className="grid grid-cols-1 gap-2 px-4 py-3 transition hover:bg-emerald-100/70 lg:grid-cols-[1.2fr_1.3fr_1fr_0.9fr_0.9fr_0.8fr_0.8fr] lg:items-center lg:gap-3">
                                        <DataCell label="Parcel" value={parcel.parcelName || 'Parcel Delivery'} strong />
                                        <DataCell label="Route" value={`${parcel.senderDistrict || 'Pickup'} to ${parcel.receiverDistrict || 'Drop-off'}`} />
                                        <DataCell label="Receiver" value={parcel.receiverName || 'Unknown receiver'} />
                                        <DataCell label="Phone" value={parcel.receiverPhone || 'No phone'} />
                                        <DataCell label="Delivered" value={formatDate(parcel.deliveredAt || parcel.updatedAt || parcel.pickupDate)} />
                                        <DataCell label="Parcel ID" value={parcel._id?.slice(-6) || 'N/A'} />
                                        <div className="flex items-center justify-between gap-3 lg:block lg:text-right">
                                            <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 lg:hidden">Earned</span>
                                            <p className="text-sm font-black text-emerald-600">{formatCurrency(parcel.riderReward)}</p>
                                        </div>
                                    </div>
                                    <hr className="border-gray-200" />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </RiderAccessGate>
    );
};

const kpiThemes = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
};

const KpiCard = ({ label, value, theme = 'emerald' }) => (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${kpiThemes[theme]}`}>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] opacity-75">{label}</p>
        <p className="mt-1 text-lg font-black">{value}</p>
    </div>
);

const DataCell = ({ label, value, strong = false }) => (
    <div className="flex min-w-0 items-center justify-between gap-3 lg:block">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 lg:hidden">{label}</span>
        <p className={`min-w-0 truncate text-sm ${strong ? 'font-black text-gray-900' : 'font-semibold text-gray-700'}`}>{value}</p>
    </div>
);

export default RiderCompleted;
