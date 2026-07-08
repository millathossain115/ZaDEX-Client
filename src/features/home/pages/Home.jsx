import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeLoader } from '@/shared/ui';
import Banner from '@/features/home/components/Banner';
import BecomeMerchant from '@/features/home/components/BecomeMerchant';
import Benefits from '@/features/home/components/Benefits';
import Brands from '@/features/home/components/Brands';
import FAQ from '@/features/home/components/FAQ';
import Services from '@/features/home/components/Services';
import WorkProcess from '@/features/home/components/WorkProcess';

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
