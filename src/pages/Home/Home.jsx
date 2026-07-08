import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeLoader } from '../../components/ui';
import Banner from '../../components/sections/home/Banner/Banner';
import BecomeMerchant from '../../components/sections/home/BecomeMerchant/BecomeMerchant';
import Benefits from '../../components/sections/home/Benefits/Benefits';
import Brands from '../../components/sections/home/Brands/Brands';
import FAQ from '../../components/sections/home/FAQ/FAQ';
import Services from '../../components/sections/home/Services/Services';
import WorkProcess from '../../components/sections/home/WorkProcess/WorkProcess';

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
