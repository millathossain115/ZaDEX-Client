import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';
import { formatCurrency, formatDate } from '../RiderShared/riderUtils';

const RiderCompleted = () => {
    const { completedTasks, loading } = useRiderDashboardData();

    if (loading) {
        return (
            <RiderAccessGate>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500 font-medium">Loading completed deliveries...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Completed</h1>
                    <p className="text-gray-500 mt-1">Your proof of work: every parcel you delivered successfully.</p>
                </div>

                {completedTasks.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No completed deliveries yet</h3>
                        <p className="text-gray-500 text-sm">Delivered parcels will start building your history here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                            <div>Parcel</div>
                            <div>Receiver</div>
                            <div>Delivered</div>
                            <div className="text-right">Earned</div>
                        </div>

                        {completedTasks.map(parcel => (
                            <div key={parcel._id} className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-5 border-b border-gray-100 last:border-b-0">
                                <div>
                                    <p className="font-bold text-gray-900">{parcel.parcelName || 'Parcel Delivery'}</p>
                                    <p className="text-sm text-gray-500">{parcel.senderDistrict || 'Pickup'} to {parcel.receiverDistrict || 'Drop-off'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{parcel.receiverName || 'Unknown receiver'}</p>
                                    <p className="text-sm text-gray-500">{parcel.receiverPhone || 'No phone'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{formatDate(parcel.deliveredAt || parcel.updatedAt || parcel.pickupDate)}</p>
                                    <p className="text-sm text-gray-500">Parcel ID: {parcel._id?.slice(-6)}</p>
                                </div>
                                <div className="md:text-right">
                                    <p className="text-xl font-black text-emerald-600">{formatCurrency(parcel.riderReward)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RiderAccessGate>
    );
};

export default RiderCompleted;
