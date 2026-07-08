import { useState } from 'react';
import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate } from '../RiderShared/riderUtils';
import { RiderCompletedLoader } from '../../../components/loaders';

const RiderCompleted = () => {
    const { completedTasks, loading } = useRiderDashboardData();
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [routeFilter, setRouteFilter] = useState('all');

    if (loading) {
        return <RiderAccessGate><RiderCompletedLoader /></RiderAccessGate>;
    }

    const getDeliveryDate = (parcel) => {
        const date = new Date(parcel.deliveredAt || parcel.updatedAt || parcel.pickupDate || 0);
        return Number.isNaN(date.getTime()) ? null : date;
    };

    const matchesDateFilter = (parcel) => {
        if (dateFilter === 'all') return true;

        const deliveryDate = getDeliveryDate(parcel);
        if (!deliveryDate) return false;

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (dateFilter === 'today') {
            return deliveryDate >= startOfToday;
        }

        const days = dateFilter === '7d' ? 7 : 30;
        const startDate = new Date(startOfToday);
        startDate.setDate(startDate.getDate() - (days - 1));
        return deliveryDate >= startDate;
    };

    const filteredTasks = completedTasks.filter(parcel => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch = !q || [
            parcel._id,
            parcel.parcelName,
            parcel.name,
            parcel.senderDistrict,
            parcel.receiverDistrict,
            parcel.receiverName,
            parcel.receiverPhone,
        ].some(value => (value || '').toString().toLowerCase().includes(q));

        const isSameDistrict = parcel.senderDistrict && parcel.receiverDistrict && parcel.senderDistrict === parcel.receiverDistrict;
        const matchesRoute = routeFilter === 'all' || (
            routeFilter === 'same'
                ? isSameDistrict
                : !isSameDistrict
        );

        return matchesSearch && matchesDateFilter(parcel) && matchesRoute;
    });

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

                        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px]">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search parcel, receiver, phone, route, or ID..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20"
                                    />
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 cursor-pointer"
                                >
                                    <option value="all">All dates</option>
                                    <option value="today">Today</option>
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                </select>
                                <select
                                    value={routeFilter}
                                    onChange={(e) => setRouteFilter(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#03373D]/20 cursor-pointer"
                                >
                                    <option value="all">All routes</option>
                                    <option value="same">Same district</option>
                                    <option value="cross">Inter district</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Delivery records</p>
                                <p className="text-xs font-semibold text-gray-500">{filteredTasks.length} of {completedTasks.length} shown</p>
                            </div>
                            <div className="hidden grid-cols-[1.2fr_1.3fr_1fr_0.9fr_0.9fr_0.8fr_0.8fr] gap-3 bg-gray-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 lg:grid">
                                <div>Parcel</div>
                                <div>Route</div>
                                <div>Receiver</div>
                                <div>Phone</div>
                                <div>Delivered</div>
                                <div>Parcel ID</div>
                                <div className="text-right">Earned</div>
                            </div>

                            {filteredTasks.length === 0 ? (
                                <div className="px-5 py-8 text-center">
                                    <h3 className="mb-2 text-lg font-bold text-gray-900">No matching deliveries</h3>
                                    <p className="text-sm text-gray-500">Try changing the search or filters.</p>
                                </div>
                            ) : (
                                filteredTasks.map(parcel => (
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
                                ))
                            )}
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
