import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const roleQueryEnabled = !loading && !!user?.email;

    const { data: userData = {}, isLoading, refetch } = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: roleQueryEnabled,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/role?email=${user.email}`);
            return res.data;
        }
    });

    return [userData, roleQueryEnabled && isLoading, refetch];
};

export default useUserRole;
