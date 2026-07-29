
import { useEffect, useRef, useState } from 'react';

import banner1 from '@/assets/banner/banner1.png';
import banner2 from '@/assets/banner/banner2.png';
import banner3 from '@/assets/banner/banner3.png';
import banner4 from '@/assets/banner/banner4.png';

const slides = [banner1, banner2, banner3, banner4];
const SLIDE_DELAY = 3000;

const Banner = () => {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, SLIDE_DELAY);

        return () => clearTimeout(timeoutRef.current);
    }, [current]);

    return (
        <section className="relative w-full overflow-hidden bg-[#F0F0F0]">
            <div className="relative h-[42vh] min-h-[240px] w-full sm:h-[52vh] lg:h-[620px]">
                {slides.map((src, idx) => (
                    <img
                        key={src}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                            idx === current ? 'opacity-100' : 'opacity-0'
                        }`}
                        src={src}
                        alt={`Zadex delivery banner ${idx + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrent(idx)}
                        aria-label={`Show banner ${idx + 1}`}
                        className={`h-2.5 w-2.5 rounded-full border border-white/90 transition-all duration-300 ${
                            idx === current ? 'bg-[#03373D] shadow-lg shadow-black/20' : 'bg-[#03373D]/35 hover:bg-[#03373D]/65'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Banner;
