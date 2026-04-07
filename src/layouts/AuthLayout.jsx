import { Link, Outlet } from 'react-router-dom';
import authImage from '../assets/Authentication.png';
import logo from '../assets/LOGOS/Logo2.png';

const AuthLayout = () => {
    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-50 via-orange-100/50 to-amber-50">
                {/* Decorative blobs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-orange-300/20 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
                    {/* Logo */}
                    <Link to="/" className="absolute top-8 left-8 flex items-center gap-2">
                        <img src={logo} alt="Zadex" className="h-8" />
                        <span className="text-3xl font-black tracking-tight italic"><span className="text-gray-800">Za</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9051] to-emerald-400">DEX</span></span>
                    </Link>

                    {/* Auth Image */}
                    <img
                        src={authImage}
                        alt="Authentication illustration"
                        className="w-full max-w-md object-contain drop-shadow-2xl"
                    />

                    {/* Tagline */}
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Fast & Reliable Delivery
                        </h2>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Track your parcels in real-time and enjoy seamless delivery experience with Zadex.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-6 left-6">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Zadex" className="h-7" />
                        <span className="text-2xl font-black tracking-tight italic"><span className="text-gray-800">Za</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9051] to-emerald-400">DEX</span></span>
                    </Link>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;