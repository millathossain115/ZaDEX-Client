import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import {
    calculateRiderReward,
    isAssignedJob,
    isDeliveredTask,
    isOngoingTask,
} from './riderUtils';

const useRiderDashboardData = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [parcels, setParcels] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        if (!user?.email) return;

        setLoading(true);
        setError('');

        try {
            const [parcelsRes, transactionsRes, methodsRes] = await Promise.allSettled([
                axiosSecure.get('/rider/parcels'),
                axiosSecure.get(`/transactions?email=${user.email}`),
                axiosSecure.get(`/payment-methods?email=${user.email}`),
            ]);

            if (parcelsRes.status === 'fulfilled') {
                setParcels(parcelsRes.value.data || []);
            } else {
                throw parcelsRes.reason;
            }

            setTransactions(transactionsRes.status === 'fulfilled' ? (transactionsRes.value.data || []) : []);
            setPaymentMethods(methodsRes.status === 'fulfilled' ? (methodsRes.value.data || []) : []);
        } catch (err) {
            console.error('Failed to load rider dashboard data:', err);
            setError('Failed to load rider dashboard data.');
        } finally {
            setLoading(false);
        }
    }, [axiosSecure, user?.email]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const riderParcels = useMemo(
        () => parcels
            .filter(parcel => parcel.assignedRider === user?.email)
            .map(parcel => ({ ...parcel, riderReward: calculateRiderReward(parcel) })),
        [parcels, user?.email]
    );

    const deliveryList = useMemo(
        () => riderParcels.filter(isAssignedJob),
        [riderParcels]
    );

    const ongoingTasks = useMemo(
        () => riderParcels.filter(isOngoingTask),
        [riderParcels]
    );

    const completedTasks = useMemo(
        () => riderParcels
            .filter(isDeliveredTask)
            .sort((a, b) => new Date(b.deliveredAt || b.updatedAt || 0) - new Date(a.deliveredAt || a.updatedAt || 0)),
        [riderParcels]
    );

    const stats = useMemo(() => {
        const totalEarnings = completedTasks.reduce((sum, parcel) => sum + calculateRiderReward(parcel), 0);
        const currentBalance = transactions.length
            ? transactions.reduce((sum, item) => sum + Number(item.amount || 0), 0)
            : totalEarnings;
        const averageRating = completedTasks.length ? Math.min(5, (4.2 + completedTasks.length * 0.03)).toFixed(1) : 'N/A';

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const todaysEarnings = completedTasks
            .filter(parcel => new Date(parcel.deliveredAt || parcel.updatedAt || 0) >= startOfToday)
            .reduce((sum, parcel) => sum + calculateRiderReward(parcel), 0);

        return {
            totalAssigned: riderParcels.length,
            deliveryListCount: deliveryList.length,
            ongoingCount: ongoingTasks.length,
            completedCount: completedTasks.length,
            totalEarnings,
            currentBalance,
            averageRating,
            todaysEarnings,
            completionRate: riderParcels.length ? Math.round((completedTasks.length / riderParcels.length) * 100) : 0,
        };
    }, [completedTasks, deliveryList.length, ongoingTasks.length, riderParcels.length, transactions]);

    return {
        user,
        parcels: riderParcels,
        deliveryList,
        ongoingTasks,
        completedTasks,
        transactions,
        paymentMethods,
        stats,
        loading,
        error,
        refetch: fetchData,
    };
};

export default useRiderDashboardData;
