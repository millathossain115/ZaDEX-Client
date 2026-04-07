import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from './Banner/Banner';
import BecomeMerchant from './BecomeMerchant/BecomeMerchant';
import Benefits from './Benefits/Benefits';
import Brands from './Brands/Brands';
import FAQ from './FAQ/FAQ';
import Services from './Services/Services';
import WorkProcess from './WorkProcess/WorkProcess';

const HomeSkeleton = () => (
    <div className="bg-[#F0F0F0] min-h-screen animate-pulse overflow-hidden">
        {/* Banner Skeleton */}
        <div className="h-[75vh] bg-gray-200/60 rounded-b-[3rem] relative">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-4xl w-full px-4 text-center space-y-6 flex flex-col items-center">
                    <div className="h-14 md:h-20 w-3/4 bg-gray-300 rounded-2xl"></div>
                    <div className="h-14 md:h-20 w-2/4 bg-gray-300 rounded-2xl"></div>
                    <div className="h-6 w-full max-w-2xl bg-gray-300/60 rounded-lg mt-6"></div>
                    <div className="h-6 w-full max-w-xl bg-gray-300/60 rounded-lg"></div>
                    <div className="flex gap-4 mt-8 flex-wrap justify-center">
                        <div className="h-14 w-40 bg-gray-300 rounded-xl"></div>
                        <div className="h-14 w-40 bg-gray-300 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Work Process / Services Skeleton Grid */}
        <div className="max-w-7xl mx-auto py-20 px-8 space-y-24">
            {/* Section 1 */}
            <div className="space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-4 w-32 bg-gray-200 rounded-full text-center"></div>
                    <div className="h-12 w-full max-w-md bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm space-y-6">
                            <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto"></div>
                            <div className="h-6 w-3/4 bg-gray-200 rounded-xl mx-auto"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                                <div className="h-4 w-full bg-gray-100 rounded-lg"></div>
                                <div className="h-4 w-2/3 bg-gray-100 rounded-lg mx-auto"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-4 w-32 bg-gray-200 rounded-full text-center"></div>
                    <div className="h-12 w-full max-w-md bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm space-y-5 h-64">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl"></div>
                            <div className="h-6 w-2/3 bg-gray-200 rounded-lg"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-full bg-gray-100 rounded-lg"></div>
                                <div className="h-3 w-full bg-gray-100 rounded-lg"></div>
                                <div className="h-3 w-4/5 bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const Home = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate a smooth loading experience for the heavy landing page assets
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!loading && location.hash) {
            const el = document.querySelector(location.hash);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location, loading]);

    if (loading) {
        return <HomeSkeleton />;
    }

    return (
        <div className="bg-[#F0F0F0] min-h-screen">
            <Banner></Banner>
            <WorkProcess></WorkProcess>
            <Services></Services>
            <Brands></Brands>
            <Benefits></Benefits>
            <BecomeMerchant></BecomeMerchant>
            <FAQ></FAQ>
        </div>
    );
};

export default Home;