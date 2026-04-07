import Lottie from 'lottie-react';
import { Link } from 'react-router-dom';
import animationData from '../../assets/Animation/404 Error Lottie animation.json';

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-[#F0F0F0] flex flex-col items-center justify-center px-4">
            {/* Lottie Animation */}
            <div className="w-full max-w-md">
                <Lottie
                    animationData={animationData}
                    loop={true}
                    autoplay={true}
                />
            </div>

            {/* Text Content */}
            <div className="text-center mt-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                    Page <span className="text-[#03373D]">Not Found</span>
                </h1>
                <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                    Oops! The page you're looking for doesn't exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="bg-[#03373D] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#025a63] shadow-lg shadow-[#03373D]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Go to Homepage
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="text-[#03373D] border border-[#03373D] px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#03373D]/5 transition-all duration-300 cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
