import { useState } from 'react';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';

const EditParcelModal = ({ parcel, onClose, onUpdate, showToast }) => {
    const axiosSecure = useAxiosSecure();
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: parcel.senderName || parcel.name || '',
        phone: parcel.senderPhone || parcel.phone || '',
        parcelType: parcel.parcelType || '',
        weight: parcel.parcelWeight || parcel.weight || '',
        receiverName: parcel.receiverName || '',
        receiverPhone: parcel.receiverPhone || '',
        deliveryAddress: parcel.receiverAddress || parcel.deliveryAddress || '',
        requestedDate: parcel.pickupDate || parcel.requestedDate || '',
    });

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleEditSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name: editForm.name,
                phone: editForm.phone,
                parcelType: editForm.parcelType,
                weight: parseFloat(editForm.weight) || 0,
                receiverName: editForm.receiverName,
                receiverPhone: editForm.receiverPhone,
                deliveryAddress: editForm.deliveryAddress,
                requestedDate: editForm.requestedDate,
            };

            await axiosSecure.put(`/parcels/${parcel._id}`, payload);
            
            const updatedParcel = {
                ...parcel,
                senderName: payload.name,
                name: payload.name,
                senderPhone: payload.phone,
                phone: payload.phone,
                parcelType: payload.parcelType,
                parcelWeight: payload.weight,
                weight: payload.weight,
                receiverName: payload.receiverName,
                receiverPhone: payload.receiverPhone,
                receiverAddress: payload.deliveryAddress,
                deliveryAddress: payload.deliveryAddress,
                pickupDate: payload.requestedDate,
                requestedDate: payload.requestedDate,
            };

            onUpdate(updatedParcel);
            showToast('success', 'Parcel updated successfully!');
            onClose();
        } catch (err) {
            console.error('[EditParcelModal] Failed to update parcel:', err);
            showToast('error', 'Failed to update parcel. Try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !isSaving && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.3s_ease-out]" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Edit Parcel</h3>
                            <p className="text-xs text-gray-400">Update your parcel details</p>
                        </div>
                    </div>
                    <button onClick={() => !isSaving && onClose()} className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Sender Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#03373D] rounded-full"></div>
                            Sender Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Sender Name</label>
                                <input type="text" value={editForm.name} onChange={e => handleEditChange('name', e.target.value)} className={inputClass} placeholder="Sender name" />
                            </div>
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                <input type="tel" value={editForm.phone} onChange={e => handleEditChange('phone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                            </div>
                        </div>
                    </div>

                    {/* Parcel Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            Parcel Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Parcel Type</label>
                                <select value={editForm.parcelType} onChange={e => handleEditChange('parcelType', e.target.value)} className={`${inputClass} cursor-pointer`}>
                                    <option value="">Select type</option>
                                    <option value="document">Document</option>
                                    <option value="small">Small Parcel</option>
                                    <option value="medium">Medium Parcel</option>
                                    <option value="large">Large Parcel</option>
                                    <option value="fragile">Fragile Item</option>
                                    <option value="liquid">Liquid Item</option>
                                    <option value="electronics">Electronics</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Weight (kg)</label>
                                <input type="number" step="0.1" min="0" value={editForm.weight} onChange={e => handleEditChange('weight', e.target.value)} className={inputClass} placeholder="0.0" />
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Receiver Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Receiver Name</label>
                                <input type="text" value={editForm.receiverName} onChange={e => handleEditChange('receiverName', e.target.value)} className={inputClass} placeholder="Receiver name" />
                            </div>
                            <div>
                                <label className={labelClass}>Receiver Phone</label>
                                <input type="tel" value={editForm.receiverPhone} onChange={e => handleEditChange('receiverPhone', e.target.value)} className={inputClass} placeholder="01XXXXXXXXX" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Delivery Address</label>
                                <input type="text" value={editForm.deliveryAddress} onChange={e => handleEditChange('deliveryAddress', e.target.value)} className={inputClass} placeholder="Full delivery address" />
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            Schedule
                        </h4>
                        <div>
                            <label className={labelClass}>Requested Date</label>
                            <input type="date" value={editForm.requestedDate} onChange={e => handleEditChange('requestedDate', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                    <button onClick={() => !isSaving && onClose()} className="px-5 py-2.5 text-gray-600 font-semibold text-sm border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={handleEditSave}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-5 py-2.5 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer ${
                            isSaving ? 'bg-[#03373D]/60 cursor-not-allowed' : 'bg-[#03373D] hover:bg-[#025a63] shadow-lg shadow-[#03373D]/20'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditParcelModal;
