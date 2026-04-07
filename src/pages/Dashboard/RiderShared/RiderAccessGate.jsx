import useUserRole from '../../../Hooks/useUserRole';

const RiderAccessGate = ({ children }) => {
    const [userData, isRoleLoading] = useUserRole();

    if (isRoleLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Checking rider access...</p>
                </div>
            </div>
        );
    }

    if (userData?.role !== 'rider') {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Rider access required</h2>
                <p className="text-gray-500">This workspace is reserved for active delivery partners.</p>
            </div>
        );
    }

    return children;
};

export default RiderAccessGate;
