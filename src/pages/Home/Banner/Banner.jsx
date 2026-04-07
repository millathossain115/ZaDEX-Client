
import { useEffect, useRef, useState } from 'react';
import useScrollAnimation from '../../../Hooks/useScrollAnimation';

// import images from assets folder
import banner1 from '../../../assets/banner/banner1.png';
import banner2 from '../../../assets/banner/banner2.png';
import banner3 from '../../../assets/banner/banner3.png';
import banner4 from '../../../assets/banner/banner4.png';

const slides = [banner1, banner2, banner3, banner4];

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 5000; // 5 seconds
    const [bannerRef, bannerVisible] = useScrollAnimation();

    useEffect(() => {
        const next = () => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        };
        timeoutRef.current = setTimeout(next, delay);
        return () => clearTimeout(timeoutRef.current);
    }, [current]);

    return (
        <div className="bg-[#F0F0F0] py-8">
            <div ref={bannerRef} className={`scroll-fade-up ${bannerVisible ? 'visible' : ''} max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8`}>
                <div className="relative overflow-hidden rounded-lg">
                    <div
                        className="flex transition-transform duration-700"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((src, idx) => (
                            <img
                                key={idx}
                                className="flex-shrink-0 w-full h-full  object-cover"
                                src={src}
                                alt={`slide-${idx}`}
                            />
                        ))}
                    </div>
                </div>

                {/* dots navigation */}
                <div className="flex justify-center mt-4 space-x-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-3 w-3 rounded-full ${idx === current ? 'bg-gray-800' : 'bg-gray-400'}`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banner;