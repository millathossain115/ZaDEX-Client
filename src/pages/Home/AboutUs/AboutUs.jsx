import { useState } from 'react';

const tabs = [
    {
        id: 'story',
        label: 'Story',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        content: [
            "Zadex was born out of a simple yet powerful idea — to make parcel delivery across Bangladesh faster, safer, and more accessible for everyone. Founded in 2022 by a group of young entrepreneurs in Dhaka, the company started with just five riders and a shared vision to reshape the logistics landscape of the country.",
            "In the early days, Zadex operated from a small office in Mirpur, handling a handful of deliveries per day. But word spread quickly. Customers loved the real-time tracking, the careful handling, and the friendly service. Within months, demand grew beyond expectations, and Zadex expanded its operations to Chattogram, Rajshahi, and Sylhet.",
            "Today, Zadex operates across all 64 districts of Bangladesh with over 200 service centers and thousands of dedicated riders. What started as a local courier service has grown into one of the most trusted delivery networks in the country — and the journey is just getting started."
        ]
    },
    {
        id: 'mission',
        label: 'Mission',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        content: [
            "Our mission at Zadex is to empower businesses and individuals across Bangladesh by providing reliable, affordable, and technology-driven delivery solutions. We believe that seamless logistics is the backbone of economic growth, and we are committed to making it available to everyone — from small shop owners to large enterprises.",
            "We strive to bridge the gap between urban convenience and rural accessibility. Every district, every town, and every village deserves access to efficient delivery services. That's why we invest heavily in expanding our coverage, training our riders, and improving our technology to ensure no corner of Bangladesh is left behind.",
            "Beyond just moving parcels, our mission is to build trust. Every package carries someone's expectations, and we treat each delivery as a promise. With transparent pricing, real-time updates, and dedicated customer support, we aim to set a new standard for what delivery services in Bangladesh can be."
        ]
    },
    {
        id: 'success',
        label: 'Success',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
        content: [
            "In just three years, Zadex has achieved milestones that many logistics companies take decades to reach. We've successfully delivered over 5 million parcels, maintained a 98.7% on-time delivery rate, and earned the trust of more than 50,000 merchants and businesses across Bangladesh.",
            "Our growth story speaks for itself — from 5 riders to 3,000+, from 1 city to all 64 districts, and from 20 daily deliveries to over 15,000. We've partnered with leading e-commerce platforms, local businesses, and government agencies, becoming a preferred logistics partner across industries.",
            "But our greatest success isn't in numbers — it's in the stories of the small business owner in Rangpur who can now sell nationally, the mother in Sylhet who receives care packages on time, and the startup in Dhaka that scaled because of reliable logistics. These stories drive us forward every day."
        ]
    },
    {
        id: 'team',
        label: 'Team & Others',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        content: [
            "Behind Zadex is a passionate team of over 500 full-time employees and 3,000+ dedicated delivery riders spread across Bangladesh. From our tech engineers who build the tracking systems to our operations managers who coordinate thousands of daily deliveries, every team member plays a vital role in keeping Zadex running smoothly.",
            "Our leadership team brings together experience from top logistics companies, tech startups, and multinational firms. We believe in a culture of innovation, accountability, and genuine care for both our customers and our people. Every rider is trained, insured, and supported — because they are the heart of Zadex.",
            "We also work closely with community partners, local businesses, and NGOs to give back. From sponsoring digital literacy programs in rural areas to offering discounted delivery for social enterprises, Zadex is committed to being more than just a courier company — we're a partner for a better Bangladesh.",
            "Interested in joining us? We're always looking for passionate individuals who want to make a difference. Check out our careers page or reach out to us directly."
        ]
    }
];

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('story');
    const activeContent = tabs.find(t => t.id === activeTab);

    return (
        <div className="bg-[#F0F0F0] min-h-screen">
            {/* Hero Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="text-center mb-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        About <span className="text-[#03373D]">Us</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        We are Zadex — Bangladesh's fastest-growing parcel delivery network.
                        Built on trust, powered by technology, and driven by a mission to connect
                        every corner of the country.
                    </p>
                </div>

                {/* Horizontal Line */}
                <div className="max-w-3xl mx-auto">
                    <div className="border-t-2 border-gray-300"></div>
                </div>
            </div>

            {/* Tab Content Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="max-w-4xl mx-auto">

                    {/* Tab Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10 mt-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'bg-[#03373D] text-white shadow-lg shadow-[#03373D]/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-[#03373D] border border-gray-200'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content */}
                    {activeContent && (
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
                            {/* Tab Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-[#E6F7F8] rounded-xl flex items-center justify-center text-[#03373D]">
                                    {activeContent.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeContent.label === 'Team & Others' ? 'Our Team & Beyond' : `Our ${activeContent.label}`}
                                </h2>
                            </div>

                            {/* Paragraphs */}
                            <div className="space-y-5">
                                {activeContent.content.map((paragraph, idx) => (
                                    <p
                                        key={idx}
                                        className="text-gray-600 leading-relaxed text-base"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;