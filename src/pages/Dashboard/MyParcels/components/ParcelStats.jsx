import React from 'react';

const ParcelStats = ({ parcels, activeFilter = 'all', onFilterChange }) => {
    const stats = [
        {
            id: 'all',
            label: 'Total',
            count: parcels.length,
            icon: (
                <svg className="w-5 h-5 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            bg: 'bg-[#03373D]/10'
        },
        {
            id: 'pending',
            label: 'Pending',
            count: parcels.filter(p => p.status?.toLowerCase() === 'pending').length,
            icon: (
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-amber-100'
        },
        {
            id: 'shipped',
            label: 'Shipped',
            count: parcels.filter(p => p.status?.toLowerCase() === 'shipped').length,
            icon: (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            ),
            bg: 'bg-blue-100'
        },
        {
            id: 'delivered',
            label: 'Delivered',
            count: parcels.filter(p => p.status?.toLowerCase() === 'delivered').length,
            icon: (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            bg: 'bg-emerald-100'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
                <div
                    key={stat.id}
                    onClick={() => onFilterChange && onFilterChange(stat.id)}
                    className={`rounded-2xl border shadow-sm p-5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
                        activeFilter === stat.id 
                            ? 'bg-[#03373D]/5 border-[#03373D] ring-1 ring-[#03373D]' 
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-gray-900">{stat.count}</p>
                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ParcelStats;
