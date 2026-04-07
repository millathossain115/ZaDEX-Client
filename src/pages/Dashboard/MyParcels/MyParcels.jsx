import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import ParcelStats from './components/ParcelStats';
import ParcelRow from './components/ParcelRow';
import EditParcelModal from './components/EditParcelModal';
import DeleteParcelModal from './components/DeleteParcelModal';

const MyParcels = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    // Edit modal state
    const [editModal, setEditModal] = useState(false);
    const [editParcel, setEditParcel] = useState(null);

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteParcel, setDeleteParcel] = useState(null);

    // Dropdown state
    const [openMenuId, setOpenMenuId] = useState(null);

    // Toast
    const [toast, setToast] = useState({ show: false, type: '', message: '' });

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [openMenuId]);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/parcels?email=${user.email}`)
                .then(res => {
                    console.log(`[MyParcels] Successfully fetched ${res.data.length} parcels for ${user.email}`);
                    // Sort by latest first (fallback to _id extraction if bookedAt missing)
                    const sorted = [...res.data].sort((a, b) => {
                        const timeA = a.bookedAt ? new Date(a.bookedAt).getTime() : (a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                        const timeB = b.bookedAt ? new Date(b.bookedAt).getTime() : (b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                        return timeB - timeA;
                    });
                    setParcels(sorted);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('[MyParcels] Failed to fetch parcels:', err);
                    setLoading(false);
                });
        }
    }, [user, axiosSecure]);

    // Auto-hide toast
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (type, message) => {
        setToast({ show: true, type, message });
    };

    const openEditModal = (parcel) => {
        setEditParcel(parcel);
        setEditModal(true);
        setOpenMenuId(null);
    };

    const openDeleteModal = (parcel) => {
        setDeleteParcel(parcel);
        setDeleteModal(true);
        setOpenMenuId(null);
    };

    const handleUpdateSuccess = (updatedParcel) => {
        setParcels(prev => prev.map(p => p._id === updatedParcel._id ? updatedParcel : p));
    };

    const handleDeleteSuccess = (deletedParcelId) => {
        setParcels(prev => prev.filter(p => p._id !== deletedParcelId));
    };

    const displayedParcels = parcels.filter(parcel => {
        if (filterStatus === 'all') return true;
        return parcel.status?.toLowerCase() === filterStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading your parcels...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border animate-[fadeInUp_0.3s_ease-out] ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {toast.type === 'success' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <p className="text-sm font-semibold">{toast.message}</p>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Parcels</h1>
                    <p className="text-gray-500 mt-1">Track and manage all your parcel bookings</p>
                </div>
                <Link
                    to="/add-parcel"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#03373D] text-white font-semibold text-sm rounded-xl hover:bg-[#025a63] transition shadow-lg shadow-[#03373D]/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Parcel
                </Link>
            </div>

            {/* Stats Cards */}
            <ParcelStats parcels={parcels} activeFilter={filterStatus} onFilterChange={setFilterStatus} />

            {/* Parcels List */}
            {parcels.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Parcels Yet</h3>
                    <p className="text-gray-500 text-sm mb-4">You haven't booked any parcels yet. Start by adding a new parcel!</p>
                    <Link to="/add-parcel" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#03373D] text-white font-semibold text-sm rounded-xl hover:bg-[#025a63] transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Parcel
                    </Link>
                </div>
            ) : displayedParcels.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No matches found</h3>
                    <p className="text-gray-500 text-sm mb-4">You don't have any parcels with the "{filterStatus}" status.</p>
                    <button 
                        onClick={() => setFilterStatus('all')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition"
                    >
                        View All Parcels
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                    {/* Table Header (Desktop) - 8 Columns */}
                    <div className="hidden lg:grid grid-cols-8 gap-6 px-6 py-5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-widest rounded-t-2xl">
                        <div className="col-span-1">Parcel & Type</div>
                        <div>Route</div>
                        <div>Receiver</div>
                        <div>Details</div>
                        <div>Delivery</div>
                        <div>Payment</div>
                        <div>Booking Date</div>
                        <div className="text-right">Manage</div>
                    </div>

                    {/* Table Rows */}
                    {displayedParcels.map((parcel, index) => (
                        <ParcelRow
                            key={parcel._id || index}
                            parcel={parcel}
                            index={index}
                            isOpen={openMenuId === parcel._id}
                            onToggle={() => setOpenMenuId(openMenuId === parcel._id ? null : parcel._id)}
                            openEditModal={openEditModal}
                            openDeleteModal={openDeleteModal}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            {editModal && (
                <EditParcelModal
                    parcel={editParcel}
                    onClose={() => setEditModal(false)}
                    onUpdate={handleUpdateSuccess}
                    showToast={showToast}
                />
            )}

            {deleteModal && (
                <DeleteParcelModal
                    parcel={deleteParcel}
                    onClose={() => setDeleteModal(false)}
                    onDelete={handleDeleteSuccess}
                    showToast={showToast}
                />
            )}
        </div>
    );
};

export default MyParcels;
