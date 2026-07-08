import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/LOGOS/Zadex-fav.svg';
import Banner from './Banner/Banner';
import BecomeMerchant from './BecomeMerchant/BecomeMerchant';
import Benefits from './Benefits/Benefits';
import Brands from './Brands/Brands';
import FAQ from './FAQ/FAQ';
import Services from './Services/Services';
import WorkProcess from './WorkProcess/WorkProcess';

const HomeLoader = ({ progress }) => (
    <div className="min-h-screen bg-[#F0F0F0] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
            <div className="flex items-center justify-center gap-3">
                <img src={logo} alt="Zadex" className="h-10 w-auto" />
                <span className="text-4xl font-black italic tracking-tight">
                    <span className="text-gray-800">Za</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9051] to-emerald-400">DEX</span>
                </span>
            </div>

            <div className="mt-10">
                <div className="mb-3 flex items-end justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#03373D]">
                        Loading
                    </p>
                    <p className="text-3xl font-black tabular-nums text-gray-900">
                        {progress}%
                    </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white border border-gray-200 shadow-inner">
                    <div
                        className="h-full rounded-full bg-[#03373D] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="mt-4 flex justify-between text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                    <span>Start</span>
                    <span>Ready</span>
                </div>

                <div className="mt-8 flex justify-center gap-2">
                    {[0, 1, 2].map(dot => (
                        <span
                            key={dot}
                            className="h-2 w-2 rounded-full bg-[#03373D] animate-pulse"
                            style={{ animationDelay: `${dot * 160}ms` }}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const Home = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const stepTime = 30;
        const increment = 100 / (duration / stepTime);

        const interval = setInterval(() => {
            setProgress(current => {
                const next = Math.min(100, Math.round(current + increment));
                if (next === 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 180);
                }
                return next;
            });
        }, stepTime);

        return () => clearInterval(interval);
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
        return <HomeLoader progress={progress} />;
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
