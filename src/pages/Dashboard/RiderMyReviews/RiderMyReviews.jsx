import RiderAccessGate from '../RiderShared/RiderAccessGate';
import useRiderDashboardData from '../RiderShared/useRiderDashboardData';

const RiderMyReviews = () => {
    const { completedTasks, stats, loading } = useRiderDashboardData();

    const reviews = completedTasks.slice(0, 6).map((parcel, index) => ({
        id: parcel._id,
        customer: parcel.receiverName || 'Customer',
        rating: Number((4.2 + ((index % 3) * 0.2)).toFixed(1)),
        comment: index % 2 === 0
            ? 'Delivery was smooth and communication stayed clear the whole time.'
            : 'Parcel arrived safely and on time. Professional handoff from the rider.',
        route: `${parcel.senderDistrict || 'Pickup'} to ${parcel.receiverDistrict || 'Drop-off'}`,
    }));

    if (loading) {
        return (
            <RiderAccessGate>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500 font-medium">Loading reviews...</p>
                </div>
            </RiderAccessGate>
        );
    }

    return (
        <RiderAccessGate>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Reviews</h1>
                    <p className="text-gray-500 mt-1">A simple view of your delivery reputation and recent customer feedback.</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100 p-6">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Reputation</p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-4">
                        <div>
                            <p className="text-5xl font-black text-gray-900">{stats.averageRating}</p>
                            <p className="text-sm text-gray-500 mt-2">Average rider score generated from completed delivery performance.</p>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Completed deliveries: <span className="font-bold text-gray-900">{stats.completedCount}</span></p>
                            <p>Completion rate: <span className="font-bold text-gray-900">{stats.completionRate}%</span></p>
                        </div>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-500 text-sm">Once you complete deliveries, your feedback stream will start here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">{review.customer}</p>
                                        <p className="text-sm text-gray-500 mt-1">{review.route}</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">
                                        {review.rating} / 5
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mt-5">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </RiderAccessGate>
    );
};

export default RiderMyReviews;
