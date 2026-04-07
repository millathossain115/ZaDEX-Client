import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthContext/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center animate-pulse">
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden">
                        <svg className="w-10 h-10 text-emerald-500 animate-[spin_2s_linear_infinite]" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <div className="w-48 h-5 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="w-64 h-3 bg-gray-100 rounded-full mb-8"></div>
                    <div className="w-full space-y-3">
                         <div className="h-12 w-full bg-gray-50 rounded-xl border border-gray-100"></div>
                         <div className="h-12 w-full bg-gray-50 rounded-xl border border-gray-100"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;

};

export default PrivateRoute;