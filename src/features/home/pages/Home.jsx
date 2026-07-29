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

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);

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
        return <HomeLoader />;
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
