import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const ViewParcel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchParcel = async () => {
            if (!user?.email) return;
            try {
                const res = await axiosSecure.get(`/parcels?email=${user.email}`);
                const found = res.data.find(p => p._id === id);
                if (found) {
                    setParcel(found);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching parcel:", err);
                setLoading(false);
            }
        };
        if (user?.email) {
            fetchParcel();
        }
    }, [id, axiosSecure, user]);

    const handleCopy = () => {
        // Generating a realistic mock tracking link/ID string.
        const trackingID = parcel?.transactionId || parcel?._id;
        const trackingLink = `${window.location.origin}/dashboard/track?id=${trackingID}`;
        
        navigator.clipboard.writeText(trackingLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error("Failed to copy:", err);
                alert("Failed to copy tracing link.");
            });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading parcel details...</p>
                </div>
            </div>
        );
    }

    if (!parcel) {
        return <div className="p-8 text-center text-red-500">Parcel not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Parcel Details</h1>
                    <p className="text-gray-500">View information and tracing ID for <span className="font-semibold text-gray-800">{parcel.parcelName || 'your parcel'}</span>.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header Information Segment */}
                <div className="bg-linear-to-r from-purple-800 to-indigo-900 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <p className="text-purple-200 text-sm font-semibold mb-1 uppercase tracking-wider">Tracing ID (Parcel _ID)</p>
                        <h2 className="text-2xl md:text-4xl font-mono font-extrabold break-all">{parcel.transactionId || parcel._id}</h2>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                            copied 
                            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white' 
                            : 'bg-white text-indigo-900 hover:bg-gray-50 shadow-white/20'
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied Link!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Copy Tracing Link
                            </>
                        )}
                    </button>
                </div>

                {/* Body Details */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sender Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Sender Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.senderName || parcel.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.senderPhone || parcel.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sender District</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.senderDistrict || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receiver Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Delivery Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Receiver Name</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.receiverName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Receiver Phone</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.receiverPhone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Delivery District</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.receiverDistrict || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Address</p>
                                <p className="text-sm font-semibold text-gray-900">{parcel.receiverAddress || parcel.deliveryAddress || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Parcel Specifications */}
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            Parcel & Booking Details
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Parcel Type</p>
                                <p className="text-sm font-bold text-gray-900">{parcel.parcelTypeName || parcel.parcelType || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Weight</p>
                                <p className="text-sm font-bold text-gray-900">{parcel.parcelWeight || parcel.weight || 0} kg</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Requested Date</p>
                                <p className="text-sm font-bold text-gray-900">{parcel.pickupDate || parcel.requestedDate || 'N/A'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-[#03373D]/20">
                                <p className="text-xs font-bold text-[#03373D] uppercase tracking-wider mb-1">Total Cost</p>
                                <p className="text-sm font-extrabold text-[#03373D]">৳{parcel.totalCost || parcel.price || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewParcel;