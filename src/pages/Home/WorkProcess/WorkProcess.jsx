import useScrollAnimation from '../../../Hooks/useScrollAnimation';

const steps = [
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ),
        title: 'Place Your Order',
        description: 'Create a parcel order through our app or website. Enter pickup and delivery details with parcel information.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
        ),
        title: 'We Pick It Up',
        description: 'Our rider arrives at your location to collect the parcel. Safe handling and proper packaging ensured.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
        ),
        title: 'Track In Real-Time',
        description: 'Monitor your parcel live on the map. Get instant notifications at every step of the delivery process.',
    },
    {
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        title: 'Delivered Safely',
        description: 'Your parcel reaches its destination on time and in perfect condition. Confirm delivery with a single tap.',
    },
];

const WorkProcess = () => {
    const [titleRef, titleVisible] = useScrollAnimation();
    const [cardsRef, cardsVisible] = useScrollAnimation();

    return (
        <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Title */}
            <div ref={titleRef} className={`scroll-fade-up ${titleVisible ? 'visible' : ''} text-center mb-12`}>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    How It <span className="text-[#03373D]">Works</span>
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                    Sending a parcel with Zadex is simple. Just four easy steps and your delivery is on its way.
                </p>
            </div>

            {/* Cards Grid */}
            <div
                ref={cardsRef}
                className={`scroll-fade-up ${cardsVisible ? 'visible' : ''} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}
            >
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 aspect-square flex flex-col items-start justify-start transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Step Number */}
                        <span className="text-xs font-bold text-[#03373D] bg-[#E6F7F8] px-3 py-1 rounded-full mb-5">
                            Step {idx + 1}
                        </span>

                        {/* Icon */}
                        <div className="w-14 h-14 bg-[#03373D] rounded-xl flex items-center justify-center text-white mb-5">
                            {step.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkProcess;