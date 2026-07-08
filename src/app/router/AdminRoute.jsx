import { Navigate } from 'react-router-dom';
import { RouteGateLoader } from '@/shared/ui';
import useAdmin from '@/shared/hooks/useAdmin';
import useAuth from '@/shared/hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();

    // Keep route checks visually aligned with dashboard page loaders.
    if (loading || isAdminLoading) {
        return <RouteGateLoader />;
    }

    // Logged-in admin → grant access
    if (user && isAdmin) {
        return children;
    }

    // Everyone else → back to login
    return <Navigate to="/login" replace />;
};

export default AdminRoute;
