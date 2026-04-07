import { useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../RiderShared/riderUtils';

const RiderDeliveryList = () => {
    const axiosSecure = useAxiosSecure();
    const { deliveryList, loading, refetch } = useRiderDashboardData();
    const [actingId, setActingId] = useState('');

    const updateDecision = async (parcel, type) => {
        setActingId(parcel._id);

        try {
            if (type === 'accept') {
                await axiosSecure.put(`/parcels/${parcel._id}`, {
                    riderDecision: 'accepted',
                    status: 'accepted',
                    acceptedAt: new Date().toISOString(),
                });
            } else {
                await axiosSecure.put(`/parcels/${parcel._id}`, {
                    assignedRider: '',
                    assignedRiderName: '',
                    riderDecision: 'rejected',
                    status: 'pending',
                    rejectedAt: new Date().toISOString(),
                });
            }

            refetch();
        } catch (err) {
            console.error(`Failed to ${type} parcel:`, err);
        } finally {
            setActingId('');
        }
    };

    if (loading) {
        return (
            <RiderAccessGate>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500 font-medium">Loading delivery list...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Delivery List</h1>
                    <p className="text-gray-500 mt-1">Review the parcels assigned by admin and decide what you want to take on.</p>
                </div>

                {deliveryList.length === 0 ? (
                    <EmptyState
                        title="No fresh jobs right now"
                        description="When admin assigns a parcel to you, it will show up here with the reward and pickup route."
                    />
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {deliveryList.map(parcel => (
                            <div key={parcel._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">Parcel #{parcel._id?.slice(-6)}</p>
                                        <h2 className="text-2xl font-black text-gray-900 mt-2">{parcel.parcelName || 'Assigned Parcel'}</h2>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getStatusBadgeClass(parcel.status)}`}>
                                        {getStatusLabel(parcel.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                    <InfoCard label="Pickup" value={parcel.senderAddress || parcel.senderDistrict || 'Not provided'} />
                                    <InfoCard label="Drop-off" value={parcel.receiverAddress || parcel.receiverDistrict || 'Not provided'} />
                                    <InfoCard label="Reward" value={formatCurrency(parcel.riderReward)} />
                                    <InfoCard label="Pickup Date" value={formatDate(parcel.pickupDate || parcel.bookedAt)} />
                                </div>

                                <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Receiver</p>
                                    <p className="text-base font-bold text-gray-900 mt-2">{parcel.receiverName || 'Unknown receiver'}</p>
                                    <p className="text-sm text-gray-500">{parcel.receiverPhone || 'Phone not available'}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <button
                                        onClick={() => updateDecision(parcel, 'accept')}
                                        disabled={actingId === parcel._id}
                                        className="py-3 rounded-2xl bg-[#03373D] text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#025a63] transition disabled:opacity-50 cursor-pointer"
                                    >
                                        {actingId === parcel._id ? 'Working...' : 'Accept'}
                                    </button>
                                    <button
                                        onClick={() => updateDecision(parcel, 'reject')}
                                        disabled={actingId === parcel._id}
                                        className="py-3 rounded-2xl border border-rose-200 text-rose-600 text-sm font-bold uppercase tracking-[0.2em] hover:bg-rose-50 transition disabled:opacity-50 cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
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

export default RiderDeliveryList;
