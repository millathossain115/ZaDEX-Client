import React from 'react';

const ParcelStats = ({ parcels }) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#03373D]/10 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-gray-900">{parcels.length}</p>
                        <p className="text-xs text-gray-500 font-medium">Total</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-gray-900">{parcels.filter(p => p.status?.toLowerCase() === 'pending').length}</p>
                        <p className="text-xs text-gray-500 font-medium">Pending</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-gray-900">{parcels.filter(p => p.status?.toLowerCase() === 'shipped').length}</p>
                        <p className="text-xs text-gray-500 font-medium">Shipped</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-gray-900">{parcels.filter(p => p.status?.toLowerCase() === 'delivered').length}</p>
                        <p className="text-xs text-gray-500 font-medium">Delivered</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelStats;
