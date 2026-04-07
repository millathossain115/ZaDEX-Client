
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
            className={`scroll-fade-right ${cardVisible ? 'visible' : ''} flex bg-amber-50 items-center w-full mb-8 rounded-lg p-6`}
            style={{ transitionDelay: `${idx * 150}ms` }}
        >
            {/* image on left side */}
            <img
                src={item.image}
                alt={item.title}
                className="w-50 h-50 object-cover p-5"
            />
            {/* dotted divider */}
            <div className="border-l-2 border-dotted border-gray-300 h-40 mx-4"></div>
            {/* text portion fixed width 922px */}
            <div className="w-full px-8">
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