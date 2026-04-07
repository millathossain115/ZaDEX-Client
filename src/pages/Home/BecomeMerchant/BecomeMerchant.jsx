import useScrollAnimation from '../../../Hooks/useScrollAnimation';
import merchantImg from '../../../assets/Merchant/merchant.png';

const BecomeMerchant = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation();

    return (
        <section className="max-w-9/10 mx-auto bg-[#03373D] rounded-3xl">
            <div ref={sectionRef} className={`scroll-fade-down ${sectionVisible ? 'visible' : ''} mx-auto px-4 py-8`}>
                <div className="flex flex-col lg:flex-row items-center gap-12 mx-12">
                    {/* Left: title, description, buttons */}
                    <div className="flex-1 text-white">
                        <h2 className="text-3xl font-bold mb-4">Merchant and Customer Satisfaction is Our First Priority</h2>
                        <p className="mb-6 text-gray-200">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className="flex items-center">
                            <button className="bg-white text-[#03373D] px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-lg hover:scale-105">Become a Merchant</button>
                            <button className="ml-4 border border-white text-white px-6 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#03373D] hover:shadow-lg hover:scale-105">Earn with ZaDex Courier</button>
                        </div>
                    </div>

                    {/* Right: image */}
                    <div className="flex-shrink-0">
                        <img src={merchantImg} alt="Become a merchant" className="w-100 h-100 object-cover rounded-md" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BecomeMerchant;