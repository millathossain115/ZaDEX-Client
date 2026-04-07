import useScrollAnimation from '../../../Hooks/useScrollAnimation';

const Services = () => {
    const [titleRef, titleVisible] = useScrollAnimation();
    const [cardsRef, cardsVisible] = useScrollAnimation();

    const services = [
        {
            id: 1,
            title: 'Fast Delivery',
            description: 'Get your parcels delivered quickly with our express service.',
            icon: '🚚',
        },
        {
            id: 2,
            title: 'Real-Time Tracking',
            description: 'Track your shipment in real-time from pickup to delivery.',
            icon: '📍',
        },
        {
            id: 3,
            title: 'Secure Handling',
            description: 'Your packages are handled with care and security.',
            icon: '🔒',
        },
        {
            id: 4,
            title: 'Affordable Rates',
            description: 'Competitive pricing for all your delivery needs.',
            icon: '💰',
        },
        {
            id: 5,
            title: '24/7 Support',
            description: 'Round-the-clock customer support for your queries.',
            icon: '📞',
        },
        {
            id: 6,
            title: 'Coverage Anywhere',
            description: 'We deliver to all corners of the city seamlessly.',
            icon: '🌍',
        },
    ];

    return (
        <div id="services" className="bg-[#03373D] max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-16 rounded-xl">
            <div className="max-w-9/10 mx-auto px-4 py-10 sm:px-6 lg:px-8">
               
                <div ref={titleRef} className={`scroll-fade-up ${titleVisible ? 'visible' : ''} text-center mb-12`}>
                    <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. 
                        From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </div>

                {/* Cards Grid */}
                <div ref={cardsRef} className={`scroll-zoom-in ${cardsVisible ? 'visible' : ''} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group bg-white rounded-lg p-6 flex flex-col items-center justify-center text-center h-80 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer hover:bg-linear-to-br hover:from-white hover:to-[#E6F7D9]"
                        >
                            <div className="text-5xl mb-4 transition-colors duration-300 group-hover:text-blue-600">{service.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 transition-colors duration-300 group-hover:text-blue-600">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed transition-colors duration-300 group-hover:text-gray-800">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;