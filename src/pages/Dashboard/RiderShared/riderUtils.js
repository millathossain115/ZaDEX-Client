export const formatCurrency = (amount) =>
    `৳${Number(amount || 0).toLocaleString('en-BD', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;

export const formatDate = (value) => {
    if (!value) return 'Not available';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const normalizeStatus = (status) => (status || 'pending').toString().trim().toLowerCase();

export const calculateRiderReward = (parcel = {}) => {
    if (parcel.riderReward) return Math.round(parseFloat(parcel.riderReward) || 0);

    const total = parseFloat(parcel.totalCost || parcel.price || 0);
    if (!total) return 50;

    return Math.max(50, Math.round(total * 0.25));
};

export const isAssignedJob = (parcel) => {
    const status = normalizeStatus(parcel.status);
    const decision = normalizeStatus(parcel.riderDecision);

    return status === 'assigned' || (decision !== 'accepted' && status !== 'accepted' && status !== 'shipped' && status !== 'delivered' && status !== 'cancelled');
};

export const isOngoingTask = (parcel) => {
    const status = normalizeStatus(parcel.status);
    return status === 'accepted' || status === 'shipped' || status === 'out for delivery';
};

export const isDeliveredTask = (parcel) => normalizeStatus(parcel.status) === 'delivered';

export const getStatusBadgeClass = (status) => {
    switch (normalizeStatus(status)) {
        case 'assigned':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'accepted':
            return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'shipped':
            return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        case 'delivered':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'cancelled':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

export const getStatusLabel = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === 'assigned') return 'Waiting for Acceptance';
    if (normalized === 'accepted') return 'Accepted';
    if (normalized === 'shipped') return 'Picked Up';
    if (normalized === 'out for delivery') return 'Out for Delivery';
    if (normalized === 'delivered') return 'Delivered';
    if (normalized === 'cancelled') return 'Cancelled';

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};
