import useUserRole from '../../Hooks/useUserRole';
import AdminStatistics from './AdminStatistics/AdminStatistics';
import MyParcels from './MyParcels/MyParcels';
import RiderOverview from './RiderOverview/RiderOverview';

const DashboardIndex = () => {
    const [userData, isRoleLoading] = useUserRole();

    if (isRoleLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (userData?.role === 'admin') return <AdminStatistics />;
    if (userData?.role === 'rider') return <RiderOverview />;

    return <MyParcels />;
};

export default DashboardIndex;
