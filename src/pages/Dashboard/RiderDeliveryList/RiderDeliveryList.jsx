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
                <div className="flex min-h-[42vh] items-center justify-center rounded-2xl border border-gray-100 bg-white">
                    <p className="text-sm font-semibold text-gray-500">Loading delivery list...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Delivery List</h1>
                        <p className="mt-1 text-sm text-gray-500">Review assigned parcels and accept the routes you can take.</p>
                    </div>
                    <div className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                        {deliveryList.length} pending
                    </div>
                </div>

                {deliveryList.length === 0 ? (
                    <EmptyState
                        title="No fresh jobs right now"
                        description="When admin assigns a parcel to you, it will show up here with the reward and pickup route."
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between px-2 pb-3">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Assigned Queue</p>
                            <p className="text-xs font-semibold text-gray-500">Reward, route, receiver and decision</p>
                        </div>

                        {deliveryList.map(parcel => (
                            <div key={parcel._id} className="mb-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition hover:border-emerald-100 hover:bg-emerald-50/30 hover:shadow-sm last:mb-0">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0 pr-0 sm:pr-4">
                                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">Sender</p>
                                        <h2 className="mt-1 truncate text-lg font-black text-gray-900">{parcel.senderName || parcel.name || 'Unknown sender'}</h2>
                                        <p className="mt-0.5 text-xs font-semibold text-gray-500">
                                            Parcel #{parcel._id?.slice(-6)} <span className="text-gray-300">/</span> {parcel.parcelName || 'Assigned Parcel'}
                                        </p>
                                    </div>
                                    <span className={`w-fit shrink-0 rounded-full border px-3 py-1 text-[11px] font-black ${getStatusBadgeClass(parcel.status)}`}>
                                        {getStatusLabel(parcel.status)}
                                    </span>
                                </div>

                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                                    <InfoCard label="Pickup" value={parcel.senderAddress || parcel.senderDistrict || 'Not provided'} />
                                    <InfoCard label="Drop-off" value={parcel.receiverAddress || parcel.receiverDistrict || 'Not provided'} />
                                    <InfoCard label="Receiver" value={`${parcel.receiverName || 'Unknown receiver'}${parcel.receiverPhone ? ` / ${parcel.receiverPhone}` : ''}`} />
                                    <InfoCard label="Reward" value={formatCurrency(parcel.riderReward)} />
                                    <InfoCard label="Pickup Date" value={formatDate(parcel.pickupDate || parcel.bookedAt)} />
                                </div>

                                <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:justify-end">
                                    <button
                                        onClick={() => updateDecision(parcel, 'accept')}
                                        disabled={actingId === parcel._id}
                                        className="rounded-xl bg-[#03373D] px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                    >
                                        {actingId === parcel._id ? 'Working...' : 'Accept'}
                                    </button>
                                    <button
                                        onClick={() => updateDecision(parcel, 'reject')}
                                        disabled={actingId === parcel._id}
                                        className="rounded-xl border border-rose-200 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-rose-600 transition hover:-translate-y-0.5 hover:border-rose-500 hover:bg-rose-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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

export default RiderDeliveryList;
