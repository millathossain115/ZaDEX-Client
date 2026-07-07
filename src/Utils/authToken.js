import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
const TOKEN_STORAGE_KEY = 'zadex_token';

export const createAuthToken = async (email) => {
    const res = await axios.post(
        `${API_BASE_URL}/jwt`,
        { email },
        { withCredentials: true }
    );

    if (res.data?.token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
    }

    return res.data;
};

export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};
