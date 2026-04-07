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
        const nextPayload = currentStatus === 'accepted'
            ? { status: 'shipped', pickedUpAt: new Date().toISOString() }
            : { status: 'delivered', deliveredAt: new Date().toISOString() };

        try {
            await axiosSecure.put(`/parcels/${parcel._id}`, nextPayload);
            refetch();
        } catch (err) {
            console.error('Failed to update rider task status:', err);
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
                            const actionLabel = currentStatus === 'accepted' ? 'Mark as Picked Up' : 'Mark as Delivered';

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

                                        <div className="lg:w-64">
                                            <button
                                                onClick={() => handleStatusUpdate(parcel)}
                                                disabled={actingId === parcel._id}
                                                className="w-full py-4 rounded-2xl bg-[#03373D] text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#025a63] transition disabled:opacity-50 cursor-pointer"
                                            >
                                                {actingId === parcel._id ? 'Updating...' : actionLabel}
                                            </button>
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
