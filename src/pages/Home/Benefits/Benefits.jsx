
import useScrollAnimation from '../../../Hooks/useScrollAnimation';
import deliveryImg from '../../../assets/Benefits/Benefits1.png';
import trackingImg from '../../../assets/Benefits/Benefits2.png';
import safetyImg from '../../../assets/Benefits/Benefits3.png';

const benefitData = [
    {
        image: deliveryImg,
        title: 'Fast Delivery',
        description: 'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipments journey and get instant status updates for complete peace of mind.'
    },
    {
        image: trackingImg,
        title: 'Live Tracking',
        description: 'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipments journey and get instant status updates for complete peace of mind.'
    },
    {
        image: safetyImg,
        title: 'Safe Delivery',
        description: 'Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipments journey and get instant status updates for complete peace of mind.'
    }
];

const BenefitCard = ({ item, idx }) => {
    const [cardRef, cardVisible] = useScrollAnimation();

    return (
        <div
            ref={cardRef}
            className={`scroll-fade-right ${cardVisible ? 'visible' : ''} flex flex-col md:flex-row bg-amber-50 items-center justify-between w-full mb-8 rounded-lg p-6 py-10 md:p-6`}
            style={{ transitionDelay: `${idx * 150}ms` }}
        >
            {/* image */}
            <div className="flex-shrink-0 flex justify-center items-center">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 md:w-50 md:h-50 object-cover p-2 md:p-5"
                />
            </div>
            {/* dotted divider - hidden on mobile, vertical on md */}
            <div className="hidden md:block border-l-2 border-dotted border-gray-300 h-40 mx-4"></div>
            {/* text portion */}
            <div className="w-full text-center md:text-left md:px-8 mt-4 md:mt-0">
                <h3 className="text-xl font-semibold mb-2 capitalize">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
            </div>
        </div>
    );
};

const Benefits = () => {
    return (
        <>
            <section className="max-w-9/10 mx-auto px-4 py-10">
                {benefitData.map((item, idx) => (
                    <BenefitCard key={idx} item={item} idx={idx} />
                ))}
            </section>
            {/* horizontal dotted separator matching section width */}
            <div className="max-w-9/10 mx-auto mt-10 mb-10">
                <div className="border-t-2 border-dotted border-gray-300"></div>
            </div>
        </>
    );
};

export default Benefits;