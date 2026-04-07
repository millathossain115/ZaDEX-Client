import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin = false, isPending: isAdminLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: !loading && !!user?.email,   // only runs once Firebase is ready
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role?email=${user.email}`);
            console.log(`🔍 Role check for ${user.email}:`, res.data.role);
            return res.data.role === 'admin';
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;
