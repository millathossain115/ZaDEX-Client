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
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500 font-medium">Loading ongoing tasks...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Ongoing Tasks</h1>
                    <p className="text-gray-500 mt-1">Everything you have accepted and are currently responsible for on the road.</p>
                </div>

                {ongoingTasks.length === 0 ? (
                    <EmptyState
                        title="No active deliveries"
                        description="Accepted parcels and in-transit jobs will appear here with quick action buttons."
                    />
                ) : (
                    <div className="space-y-5">
                        {ongoingTasks.map(parcel => {
                            const currentStatus = normalizeStatus(parcel.status);

                            // Step label & button color per status
                            const actionConfig = {
                                accepted:         { label: 'Mark as Picked Up',       btn: 'bg-[#03373D] hover:bg-[#025a63]' },
                                shipped:          { label: 'Out for Delivery',         btn: 'bg-sky-600 hover:bg-sky-700' },
                                out_for_delivery: { label: 'Mark as Delivered',        btn: 'bg-emerald-600 hover:bg-emerald-700' },
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
                                <div key={parcel._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                                        <div className="space-y-5 flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Task #{parcel._id?.slice(-6)}</p>
                                                    <h2 className="text-2xl font-black text-gray-900 mt-2">{parcel.parcelName || 'Delivery Parcel'}</h2>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadgeClass(parcel.status)}`}>
                                                    {getStatusLabel(parcel.status)}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                                <InfoCard label="Receiver Phone" value={parcel.receiverPhone || 'Not available'} />
                                                <InfoCard label="Address" value={parcel.receiverAddress || 'Not available'} />
                                                <InfoCard label="Parcel Type" value={parcel.parcelTypeName || parcel.parcelType || 'General'} />
                                                <InfoCard label="Reward" value={formatCurrency(parcel.riderReward)} />
                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Pickup</p>
                                                        <p className="font-semibold text-gray-900 mt-2">{parcel.senderAddress || parcel.senderDistrict || 'Not provided'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Scheduled</p>
                                                        <p className="font-semibold text-gray-900 mt-2">{formatDate(parcel.pickupDate || parcel.bookedAt)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Call Receiver</p>
                                                        <a href={`tel:${parcel.receiverPhone || ''}`} className="inline-flex items-center gap-2 font-semibold text-[#03373D] mt-2">
                                                            <span>Open dialer</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:w-64 flex flex-col gap-3">
                                            {/* Progress steps */}
                                            {currentStatus !== 'delivered' && (
                                                <div className="flex items-center gap-1 mb-1">
                                                    {steps.map((step, i) => {
                                                        const done = currentStepIdx > i;
                                                        const active = currentStepIdx === i;
                                                        return (
                                                            <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                                                                <div className={`w-full h-1.5 rounded-full transition-all ${
                                                                    done ? 'bg-emerald-400' : active ? 'bg-[#03373D]' : 'bg-gray-200'
                                                                }`} />
                                                                <p className={`text-[8px] font-black uppercase tracking-wider text-center leading-tight ${
                                                                    done ? 'text-emerald-500' : active ? 'text-[#03373D]' : 'text-gray-300'
                                                                }`}>{step.label}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Main status action — hide once delivered for COD parcels needing collection */}
                                            {config && !(currentStatus === 'delivered' && parcel.paymentStatus?.toLowerCase() !== 'paid') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(parcel)}
                                                    disabled={actingId === parcel._id}
                                                    className={`w-full py-4 rounded-2xl text-white text-sm font-bold uppercase tracking-[0.2em] transition disabled:opacity-50 cursor-pointer ${config.btn}`}
                                                >
                                                    {actingId === parcel._id ? 'Updating...' : config.label}
                                                </button>
                                            )}

                                            {/* COD Cash Collection button — only for delivered, unpaid parcels */}
                                            {currentStatus === 'delivered' && parcel.paymentStatus?.toLowerCase() !== 'paid' && (
                                                parcel.riderCodStatus === 'collected' ? (
                                                    <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        Cash Collected
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCodCollected(parcel)}
                                                        disabled={actingId === parcel._id + '_cod'}
                                                        className="w-full py-4 rounded-2xl bg-amber-500 text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-amber-600 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
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
    <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-900 mt-2 leading-relaxed">{value}</p>
    </div>
);

const EmptyState = ({ title, description }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
    </div>
);

export default RiderOngoingTasks;
