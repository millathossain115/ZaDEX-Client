import axios from 'axios';
import { useMemo } from 'react';

const useAxiosSecure = () => {
    const axiosSecure = useMemo(() => {
        return axios.create({
            baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
            withCredentials: true,
        });
    }, []);

    return axiosSecure;
};

export default useAxiosSecure;