import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from './Banner/Banner';
import BecomeMerchant from './BecomeMerchant/BecomeMerchant';
import Benefits from './Benefits/Benefits';
import Brands from './Brands/Brands';
import FAQ from './FAQ/FAQ';
import Services from './Services/Services';
import WorkProcess from './WorkProcess/WorkProcess';
import logo from '../../assets/LOGOS/Zadex-fav.svg';
import banner1 from '../../assets/banner/banner1.png';

const HomeSkeleton = () => (
    <div className="bg-[#F0F0F0] min-h-screen overflow-hidden">
        <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative min-h-[62vh] overflow-hidden rounded-lg bg-[#03373D] shadow-xl">
                <img
                    src={banner1}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#03373D] via-[#03373D]/80 to-[#03373D]/20"></div>
                <div className="relative z-10 flex min-h-[62vh] flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
                    <div className="mb-8 flex items-center gap-3">
                        <img src={logo} alt="Zadex" className="h-9 w-auto" />
                        <span className="text-3xl font-black italic tracking-tight text-white">
                            Za<span className="text-emerald-300">DEX</span>
                        </span>
                    </div>

                    <div className="max-w-2xl">
                        <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-emerald-200">
                            Preparing your delivery experience
                        </p>
                        <div className="space-y-4">
                            <div className="h-12 w-full max-w-xl rounded-2xl bg-white/90 animate-pulse"></div>
                            <div className="h-12 w-4/5 max-w-lg rounded-2xl bg-white/70 animate-pulse"></div>
                            <div className="mt-6 h-4 w-full max-w-md rounded-full bg-white/35 animate-pulse"></div>
                            <div className="h-4 w-2/3 max-w-sm rounded-full bg-white/25 animate-pulse"></div>
                        </div>
                    </div>

                    <div className="mt-10 max-w-sm">
                        <div className="h-2 overflow-hidden rounded-full bg-white/20">
                            <div className="h-full w-2/3 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.65)] animate-pulse"></div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {[1, 2, 3].map((dot) => (
                                <span
                                    key={dot}
                                    className="h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping"
                                    style={{ animationDelay: `${dot * 160}ms` }}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
            <div className="space-y-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-4 w-28 rounded-full bg-[#03373D]/20 animate-pulse"></div>
                    <div className="h-10 w-full max-w-sm rounded-2xl bg-gray-200 animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
                            <div className="mb-5 h-6 w-20 rounded-full bg-[#E6F7F8] animate-pulse"></div>
                            <div className="mb-5 h-14 w-14 rounded-xl bg-[#03373D] animate-pulse"></div>
                            <div className="mb-3 h-5 w-2/3 rounded-lg bg-gray-200 animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-3 w-full rounded-lg bg-gray-100 animate-pulse"></div>
                                <div className="h-3 w-5/6 rounded-lg bg-gray-100 animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl bg-[#03373D] px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-9/10">
                    <div className="mb-12 flex flex-col items-center gap-4">
                        <div className="h-9 w-48 rounded-2xl bg-white/80 animate-pulse"></div>
                        <div className="h-4 w-full max-w-lg rounded-full bg-white/25 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-lg bg-white p-6">
                                <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[#E6F7D9] animate-pulse"></div>
                                <div className="mx-auto mb-4 h-6 w-36 rounded-lg bg-gray-200 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded-lg bg-gray-100 animate-pulse"></div>
                                    <div className="mx-auto h-3 w-4/5 rounded-lg bg-gray-100 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
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
