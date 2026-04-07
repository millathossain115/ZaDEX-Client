import { useState } from 'react';
import useScrollAnimation from '../../../Hooks/useScrollAnimation';

const faqData = [
    {
        id: 1,
        question: 'How do I track my parcel in real time?',
        answer:
            "Once your parcel is picked up, you will receive a unique tracking ID. Simply enter this ID on our website or app to see live updates on your shipment's current location, estimated delivery time, and full journey history.",
    },
    {
        id: 2,
        question: 'What areas does Zadex currently cover for delivery?',
        answer:
            'Zadex currently operates across all major cities and surrounding suburban areas. We are continuously expanding our coverage network. You can check if your area is serviceable by entering your postal code on our coverage page.',
    },
    {
        id: 3,
        question: 'How can I become a delivery merchant with Zadex?',
        answer:
            'Becoming a merchant is simple! Click on the "Become a Merchant" button, fill out the registration form with your business details, and our team will review your application within 24-48 hours. Once approved, you can start shipping right away.',
    },
    {
        id: 4,
        question: 'What happens if my parcel is damaged or lost?',
        answer:
            'We take the safety of your parcels very seriously. In the rare event of damage or loss, please contact our 24/7 support team immediately. We offer full insurance coverage and will initiate a claim process to ensure you are compensated promptly.',
    },
];

const AccordionItem = ({ item, isOpen, onToggle }) => {
    return (
        <div className={`rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${isOpen ? 'bg-[#E6F7F8] shadow-md' : 'bg-white'}`}>
            <button
                id={`faq-toggle-${item.id}`}
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer focus:outline-none group"
                aria-expanded={isOpen}
                aria-controls={`faq-content-${item.id}`}
            >
                <span className={`text-base md:text-lg font-semibold pr-4 transition-colors duration-200 ${isOpen ? 'text-[#03373D]' : 'text-gray-800 group-hover:text-[#03373D]'}`}>
                    {item.question}
                </span>
                {/* Arrow Icon */}
                <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#03373D] transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Accordion Content */}
            <div
                id={`faq-content-${item.id}`}
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
                role="region"
                aria-labelledby={`faq-toggle-${item.id}`}
            >
                <div className="px-6 pb-5 pt-0">
                    <div className="border-t-2 border-dotted border-gray-300 pt-4">
                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                            {item.answer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FAQ = () => {
    const [openId, setOpenId] = useState(null);
    const [titleRef, titleVisible] = useScrollAnimation();
    const [listRef, listVisible] = useScrollAnimation();

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section id="faq-section" className="max-w-9/10 mx-auto px-4 py-16">
            {/* Section Title and Description */}
            <div ref={titleRef} className={`scroll-fade-up ${titleVisible ? 'visible' : ''} text-center mb-12`}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                    Got questions? We have got answers. Browse through our most commonly asked
                    questions to find the information you need quickly and easily.
                </p>
            </div>

            {/* Accordion List */}
            <div ref={listRef} className={`scroll-fade-up ${listVisible ? 'visible' : ''} max-w-full mx-auto flex flex-col gap-4`}>
                {faqData.map((item) => (
                    <AccordionItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => handleToggle(item.id)}
                    />
                ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center mt-10">
                <button
                    id="see-more-faqs-btn"
                    className="flex items-center gap-2 bg-[#03373D] text-white px-8 py-3 rounded-full font-semibold text-base hover:bg-[#025a63] transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                >
                    See more FAQs
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default FAQ;