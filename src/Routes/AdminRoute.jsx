import { Navigate } from 'react-router-dom';
import { RouteGateLoader } from '../components/loaders';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';

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
