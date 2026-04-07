import Marquee from 'react-fast-marquee';
import useScrollAnimation from '../../../Hooks/useScrollAnimation';

const Brands = () => {
    const [brandsRef, brandsVisible] = useScrollAnimation();
    // load all images from the brands folder dynamically
    const images = Object.values(
        import.meta.glob('/src/assets/brands/*.{png,jpg,jpeg,svg}', { eager: true })
    ).map((mod) => mod.default);

    // debugging - ensure we actually found something
    console.log('Brands.images:', images);

    if (images.length === 0) {
        return (
            <div className="brands-section">
                <h2 className="brands-header">brands we have worked with</h2>
                <p>No brand logos found. Add files to <code>src/assets/brands</code> to see the marquee.</p>
            </div>
        );
    }

    return (
        <div ref={brandsRef} className={`scroll-fade-up ${brandsVisible ? 'visible' : ''} max-w-9/10 mx-auto p-4 text-center`}>
            <h2 className="text-3xl font-extrabold mb-10 mt-10 capitalize">brands we have worked with</h2>
            <Marquee speed={60} gradient={false} pauseOnHover direction="left">
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`brand-${idx}`}
                        className="h-6 mx-[100px] object-contain"
                    />
                ))}
            </Marquee>
        </div>
    );
};

export default Brands;