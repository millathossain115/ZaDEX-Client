import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useAdmin = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const adminQueryEnabled = !loading && !!user?.email;

    const { data: isAdmin = false, isLoading } = useQuery({
        queryKey: ['isAdmin', user?.email],
        enabled: adminQueryEnabled,   // only runs once Firebase is ready
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role?email=${user.email}`);
            console.log(`🔍 Role check for ${user.email}:`, res.data.role);
            return res.data.role === 'admin';
        }
    });

    return [isAdmin, adminQueryEnabled && isLoading];
};

export default useAdmin;
