import axios from 'axios';
import { useMemo } from 'react';

const useAxiosSecure = () => {
    const axiosSecure = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:5000',
            withCredentials: true,
        });

        // Attach JWT token from localStorage to every request
        instance.interceptors.request.use((config) => {
            const token = localStorage.getItem('zadex_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return instance;
    }, []);

    return axiosSecure;
};

export default useAxiosSecure;