import { useState } from 'react';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const DeleteParcelModal = ({ parcel, onClose, onDelete, showToast }) => {
    const axiosSecure = useAxiosSecure();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axiosSecure.delete(`/parcels/${parcel._id}`);
            onDelete(parcel._id);
            showToast('success', 'Parcel deleted successfully!');
        } catch (err) {
            console.error('[DeleteParcelModal] Failed to delete parcel:', err);
            showToast('error', 'Failed to delete parcel. Try again.');
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !isDeleting && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-[fadeInUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                <div className="p-8 text-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Parcel?</h3>
                    <p className="text-gray-500 text-sm mb-1">
                        Are you sure you want to delete this parcel?
                    </p>
                    <p className="text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg px-3 py-2 inline-block mb-4">
                        {parcel?.parcelName || parcel?.name || 'Unnamed Parcel'} → {parcel?.receiverName}
                    </p>
                    <p className="text-xs text-red-400">This action cannot be undone.</p>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                    <button onClick={() => !isDeleting && onClose()} className="flex-1 px-5 py-2.5 text-gray-600 font-semibold text-sm border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer ${
                            isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                        }`}
                    >
                        {isDeleting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteParcelModal;
