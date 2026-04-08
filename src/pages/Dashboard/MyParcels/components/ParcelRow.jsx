import { Link } from 'react-router-dom';

const ParcelRow = ({ parcel, index, isOpen, onToggle, openEditModal, openDeleteModal }) => {
    // ---- Helpers ----
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'shipped':
                return (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                );
            case 'delivered':
                return (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className={`relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-4 gap-x-4 lg:gap-6 p-5 lg:px-6 lg:py-6 items-center border-b border-gray-50 hover:bg-gray-100 transition-colors last:border-b-0 last:rounded-b-2xl ${index % 2 === 0 ? '' : 'bg-gray-50/30'} ${isOpen ? 'z-50' : 'z-0'}`}>
            {/* 1. Parcel & Type */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
                <p className="font-bold text-gray-900 text-sm mb-0.5">{parcel.parcelName || parcel.name || 'Unnamed'}</p>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    {parcel.parcelTypeName || parcel.parcelType}
                </span>
            </div>

            {/* 2. Route */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 group cursor-help">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-600">{parcel.senderDistrict || '—'}</span>
                        <span className="text-[10px] text-gray-400">Pickup</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600">{parcel.receiverDistrict || '—'}</span>
                        <span className="text-[10px] text-gray-400">Dropoff</span>
                    </div>
                </div>
            </div>

            {/* 3. Receiver */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <p className="text-sm font-bold text-gray-800 leading-tight">{parcel.receiverName}</p>
                <p className="text-[11px] text-gray-400 font-medium">{parcel.receiverPhone}</p>
            </div>

            {/* 4. Details (Weight + Cost) */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-gray-800">৳{parcel.totalCost || parcel.price}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">/ {parcel.parcelWeight || parcel.weight} kg</span>
                </div>
            </div>

            {/* 5. Delivery Status */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 lowercase">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border w-fit ${getStatusColor(parcel.status)}`}>
                    {getStatusIcon(parcel.status)}
                    {parcel.status}
                </span>
            </div>

            {/* 6. Payment Status */}
            <div className="col-span-1 md:col-span-1 lg:col-span-1 lowercase">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border w-fit ${parcel.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                    <div className={`w-1 h-1 rounded-full ${parcel.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    {parcel.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
            </div>

            {/* 7. Date */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1">
                <p className="text-xs font-bold text-gray-700">{parcel.pickupDate || parcel.requestedDate}</p>
                <p className="text-[10px] text-gray-400 font-medium tracking-tight">Slot: {parcel.pickupTimeSlot || 'Anytime'}</p>
            </div>

            {/* 8. Actions (Management) */}
            <div className="col-span-2 md:col-span-2 lg:col-span-1 flex items-center gap-3 justify-end pt-2 border-t border-gray-100 lg:pt-0 lg:border-t-0 mt-2 lg:mt-0">
                {/* Primary Action: Pay if Unpaid, View if Paid */}
                {parcel.paymentStatus !== 'paid' ? (
                    <Link
                        to={`/dashboard/payment/${parcel._id}`}
                        className="flex items-center justify-center px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 hover:text-emerald-800 transition shadow-sm group"
                    >
                        Pay Now
                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                ) : (
                    <Link
                        to={`/dashboard/view/${parcel._id}`}
                        className="flex items-center justify-center px-3 py-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition"
                    >
                        Track Parcel
                    </Link>
                )}

                {/* Dropdown Menu Trigger */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                            isOpen
                                ? 'bg-gray-100 text-[#03373D] shadow-inner'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5h.01M12 12h.01M12 19h.01" />
                        </svg>
                    </button>

                    {/* Dropdown Box */}
                    {isOpen && (
                        <div 
                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 z-50 animate-[fadeIn_0.2s_ease-out]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="px-4 py-2 mb-1 text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50">Quick Actions</p>
                            
                            <Link
                                to={`/dashboard/view/${parcel._id}`}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#03373D] transition group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                View Parcel
                            </Link>

                            <button
                                onClick={() => {
                                    openEditModal(parcel);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-100 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                Edit Parcel
                            </button>

                            <div className="mx-2 my-2 border-t border-gray-50"></div>

                            <button
                                onClick={() => {
                                    openDeleteModal(parcel);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                Cancel Order
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParcelRow;
