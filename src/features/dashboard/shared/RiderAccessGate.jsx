import useUserRole from '@/shared/hooks/useUserRole';
import { RiderDashboardLoader } from '@/shared/ui';

const RiderAccessGate = ({ children, fallback = <RiderDashboardLoader /> }) => {
    const [userData, isRoleLoading] = useUserRole();

    if (isRoleLoading) {
        return fallback;
    }

    if (userData?.role !== 'rider') {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Rider access required</h2>
                <p className="text-gray-500">This workspace is reserved for active delivery partners.</p>
            </div>
        );
    }

    return children;
};

export default RiderAccessGate;
