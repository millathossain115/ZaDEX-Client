import { Navigate } from 'react-router-dom';
import useAdmin from '../Hooks/useAdmin';
import useAuth from '../Hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();

    // Show spinner while Firebase or the role check is still loading
    if (loading || isAdminLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#03373D]/20 border-t-[#03373D] rounded-full animate-spin"></div>
            </div>
        );
    }

    // Logged-in admin → grant access
    if (user && isAdmin) {
        return children;
    }

    // Everyone else → back to login
    return <Navigate to="/login" replace />;
};

export default AdminRoute;
