import React, { use } from 'react';
import { AuthContext } from '@/app/providers/AuthContext';

const useAuth = () => {
    const authInfo = use(AuthContext);
    return authInfo;
};

export default useAuth;