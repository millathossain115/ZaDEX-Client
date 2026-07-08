import { useEffect } from 'react';
import useUserRole from '../../Hooks/useUserRole';
import AdminStatistics from './AdminStatistics/AdminStatistics';
import MyParcels from './MyParcels/MyParcels';
import MyParcelsLoader from './MyParcels/components/MyParcelsLoader';
import RiderOverview from './RiderOverview/RiderOverview';

const DashboardIndex = () => {
    const [userData, isRoleLoading] = useUserRole();

    useEffect(() => {
        if (isRoleLoading) return;

        if (userData?.role === 'admin') {
            document.title = 'Admin Statistics | Zadex';
            return;
        }

        if (userData?.role === 'rider') {
            document.title = 'Rider Overview | Zadex';
            return;
        }

        document.title = 'My Parcels | Zadex';
    }, [isRoleLoading, userData?.role]);

    if (isRoleLoading) {
        return <MyParcelsLoader />;
    }

    if (userData?.role === 'admin') return <AdminStatistics />;
    if (userData?.role === 'rider') return <RiderOverview />;

    return <MyParcels />;
};

export default DashboardIndex;
