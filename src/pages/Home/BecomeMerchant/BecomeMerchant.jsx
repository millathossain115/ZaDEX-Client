import useScrollAnimation from '../../../Hooks/useScrollAnimation';
import merchantImg from '../../../assets/Merchant/Merchant.png';

const BecomeMerchant = () => {
    const [sectionRef, sectionVisible] = useScrollAnimation();

    return (
        <section className="max-w-9/10 mx-auto bg-[#03373D] rounded-3xl">
            <div ref={sectionRef} className={`scroll-fade-down ${sectionVisible ? 'visible' : ''} mx-auto px-4 py-8 lg:py-12`}>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mx-2 sm:mx-8 lg:mx-12">
                    {/* Left: title, description, buttons */}
                    <div className="flex-1 text-white text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Merchant and Customer Satisfaction is Our First Priority</h2>
                        <p className="mb-6 text-sm md:text-base text-gray-200">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button className="w-full sm:w-auto bg-white text-[#03373D] px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-lg hover:scale-105">Become a Merchant</button>
                            <button className="w-full sm:w-auto border border-white text-white px-6 py-2 rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#03373D] hover:shadow-lg hover:scale-105">Earn with ZaDex Courier</button>
                        </div>
                    </div>

                    {/* Right: image */}
                    <div className="shrink-0 w-full lg:w-auto flex justify-center">
                        <img src={merchantImg} alt="Become a merchant" className="w-full max-w-sm md:max-w-md lg:w-100 lg:h-100 object-cover rounded-md" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BecomeMerchant;