import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, normalizeStatus } from '../RiderShared/riderUtils';

const RiderOngoingTasks = () => {
    const axiosSecure = useAxiosSecure();
    const { ongoingTasks, loading, refetch } = useRiderDashboardData();
    const [actingId, setActingId] = useState('');

    const handleStatusUpdate = async (parcel) => {
        setActingId(parcel._id);

        const currentStatus = normalizeStatus(parcel.status);
        let nextPayload;
        if (currentStatus === 'accepted') {
            nextPayload = { status: 'shipped', pickedUpAt: new Date().toISOString() };
        } else if (currentStatus === 'shipped') {
            nextPayload = { status: 'out_for_delivery', outForDeliveryAt: new Date().toISOString() };
        } else if (currentStatus === 'out_for_delivery') {
            nextPayload = { status: 'delivered', deliveredAt: new Date().toISOString() };
        } else {
            setActingId('');
            return;
        }

        try {
            await axiosSecure.put(`/parcels/${parcel._id}`, nextPayload);
            refetch();
        } catch (err) {
            console.error('Failed to update rider task status:', err);
        } finally {
            setActingId('');
        }
    };

    const handleCodCollected = async (parcel) => {
        setActingId(parcel._id + '_cod');
        try {
            await axiosSecure.patch(`/parcels/${parcel._id}/cod-collected`);
            refetch();
        } catch (err) {
            console.error('Failed to mark COD collected:', err);
        } finally {
            setActingId('');
        }
    };

    if (loading) {
        return (
            <RiderAccessGate>
                <div className="flex min-h-[42vh] items-center justify-center rounded-2xl border border-gray-100 bg-white">
                    <p className="text-sm font-semibold text-gray-500">Loading ongoing tasks...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Ongoing Tasks</h1>
                        <p className="mt-1 text-sm text-gray-500">Accepted and in-transit parcels that need your next update.</p>
                    </div>
                    <div className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                        {ongoingTasks.length} active
                    </div>
                </div>

                {ongoingTasks.length === 0 ? (
                    <EmptyState
                        title="No active deliveries"
                        description="Accepted parcels and in-transit jobs will appear here with quick action buttons."
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between px-2 pb-3">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Active Route Queue</p>
                            <p className="text-xs font-semibold text-gray-500">Parcel data, progress and next action</p>
                        </div>

                        {ongoingTasks.map(parcel => {
                            const currentStatus = normalizeStatus(parcel.status);

                            // Step label & button color per status
                            const actionConfig = {
                                accepted:         { label: 'Mark as Picked Up',       btn: 'bg-[#03373D] hover:bg-emerald-600' },
                                shipped:          { label: 'Out for Delivery',         btn: 'bg-sky-600 hover:bg-indigo-600' },
                                out_for_delivery: { label: 'Mark as Delivered',        btn: 'bg-emerald-600 hover:bg-[#03373D]' },
                            };
                            const config = actionConfig[currentStatus];

                            // Progress steps
                            const steps = [
                                { key: 'accepted',         label: 'Picked Up' },
                                { key: 'shipped',          label: 'Out for Delivery' },
                                { key: 'out_for_delivery', label: 'Delivered' },
                            ];
                            const stepOrder = ['accepted', 'shipped', 'out_for_delivery', 'delivered'];
                            const currentStepIdx = stepOrder.indexOf(currentStatus);

                            return (
                                <div key={parcel._id} className="mb-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition hover:border-sky-100 hover:bg-sky-50/40 hover:shadow-sm last:mb-0">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 pr-0 sm:flex-nowrap sm:pr-4">
                                            <span className="shrink-0 text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Task #{parcel._id?.slice(-6)}</span>
                                            <span className="hidden text-gray-300 sm:inline">/</span>
                                            <h2 className="min-w-0 truncate text-sm font-black text-gray-900 sm:max-w-64 lg:max-w-80">{parcel.parcelName || 'Delivery Parcel'}</h2>
                                            <span className="hidden text-gray-300 sm:inline">/</span>
                                            <span className="min-w-0 truncate text-xs font-semibold text-gray-500 sm:max-w-48 lg:max-w-64">{parcel.senderName || parcel.name || 'Unknown sender'}</span>
                                        </div>
                                        <span className={`w-fit shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadgeClass(parcel.status)}`}>
                                            {getStatusLabel(parcel.status)}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
                                        <InfoCard label="Receiver" value={parcel.receiverName || 'Unknown receiver'} />
                                        <InfoCard label="Phone" value={parcel.receiverPhone || 'Not available'} />
                                        <InfoCard label="Drop-off" value={parcel.receiverAddress || 'Not available'} />
                                        <InfoCard label="Pickup" value={parcel.senderAddress || parcel.senderDistrict || 'Not provided'} />
                                        <InfoCard label="Parcel Type" value={parcel.parcelTypeName || parcel.parcelType || 'General'} />
                                        <InfoCard label="Reward" value={formatCurrency(parcel.riderReward)} />
                                        <InfoCard label="Scheduled" value={formatDate(parcel.pickupDate || parcel.bookedAt)} />
                                    </div>

                                    <div className="mt-3 flex flex-col gap-3 border-t border-gray-100 pt-3 xl:flex-row xl:items-end xl:justify-between">
                                        {currentStatus !== 'delivered' && (
                                            <div className="grid flex-1 grid-cols-3 gap-2">
                                                {steps.map((step, i) => {
                                                    const done = currentStepIdx > i;
                                                    const active = currentStepIdx === i;
                                                    return (
                                                        <div key={step.key} className="min-w-0">
                                                            <div className={`h-1.5 rounded-full transition-all ${
                                                                done ? 'bg-emerald-400' : active ? 'bg-[#03373D]' : 'bg-gray-200'
                                                            }`} />
                                                            <p className={`mt-1 truncate text-[10px] font-black uppercase tracking-[0.12em] ${
                                                                done ? 'text-emerald-500' : active ? 'text-[#03373D]' : 'text-gray-300'
                                                            }`}>{step.label}</p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 sm:flex-row xl:justify-end">
                                            {parcel.receiverPhone && (
                                                <a
                                                    href={`tel:${parcel.receiverPhone}`}
                                                    className="inline-flex items-center justify-center rounded-xl border border-sky-200 px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-sky-700 transition hover:-translate-y-0.5 hover:border-sky-600 hover:bg-sky-600 hover:text-white"
                                                >
                                                    Call Receiver
                                                </a>
                                            )}

                                            {/* Main status action — hide once delivered for COD parcels needing collection */}
                                            {config && !(currentStatus === 'delivered' && parcel.paymentStatus?.toLowerCase() !== 'paid') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(parcel)}
                                                    disabled={actingId === parcel._id}
                                                    className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${config.btn}`}
                                                >
                                                    {actingId === parcel._id ? 'Updating...' : config.label}
                                                </button>
                                            )}

                                            {/* COD Cash Collection button — only for delivered, unpaid parcels */}
                                            {currentStatus === 'delivered' && parcel.paymentStatus?.toLowerCase() !== 'paid' && (
                                                parcel.riderCodStatus === 'collected' ? (
                                                    <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        Cash Collected
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCodCollected(parcel)}
                                                        disabled={actingId === parcel._id + '_cod'}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                                        {actingId === parcel._id + '_cod' ? 'Marking...' : 'Mark Cash Collected'}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </RiderAccessGate>
    );
};

const InfoCard = ({ label, value }) => (
    <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">{label}</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">{value}</p>
    </div>
);

const EmptyState = ({ title, description }) => (
    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-8 text-center shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
        <p className="mx-auto max-w-xl text-sm text-gray-500">{description}</p>
    </div>
);

export default RiderOngoingTasks;
