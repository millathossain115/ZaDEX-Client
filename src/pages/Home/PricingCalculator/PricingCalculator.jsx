import { useState } from 'react';

const parcelTypes = [
    { value: '', label: 'Select parcel type' },
    { value: 'document', label: '📄 Document' },
    { value: 'small', label: '📦 Small Parcel (up to 1kg)' },
    { value: 'medium', label: '📦 Medium Parcel (1-5kg)' },
    { value: 'large', label: '📦 Large Parcel (5-15kg)' },
    { value: 'fragile', label: '🔶 Fragile Item' },
    { value: 'liquid', label: '💧 Liquid Item' },
    { value: 'electronics', label: '💻 Electronics' },
];

const districts = [
    'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh',
    'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura', "Cox's Bazar", 'Jashore', 'Dinajpur',
    'Tangail', 'Brahmanbaria', 'Narsingdi', 'Faridpur', 'Pabna', 'Noakhali', 'Kushtia',
    'Chandpur', 'Habiganj', 'Netrokona', 'Moulvibazar', 'Sirajganj', 'Kishoreganj',
    'Manikganj', 'Jhenaidah', 'Magura', 'Shariatpur', 'Munshiganj', 'Pirojpur',
    'Jhalokati', 'Patuakhali', 'Barguna', 'Satkhira', 'Narail', 'Gopalganj',
    'Madaripur', 'Rajbari', 'Meherpur', 'Chuadanga', 'Nilphamari', 'Kurigram',
    'Lalmonirhat', 'Gaibandha', 'Panchagarh', 'Thakurgaon', 'Naogaon', 'Natore',
    'Chapai Nawabganj', 'Joypurhat', 'Sunamganj', 'Sherpur', 'Jamalpur', 'Bagerhat',
    'Lakshmipur', 'Feni', 'Khagrachhari', 'Rangamati', 'Bandarban', 'Bhola',
].sort();

// Pricing logic
const basePrices = {
    document: 50,
    small: 80,
    medium: 120,
    large: 180,
    fragile: 150,
    liquid: 160,
    electronics: 200,
};

const weightMultiplier = (weight) => {
    if (weight <= 0.5) return 1;
    if (weight <= 1) return 1.2;
    if (weight <= 3) return 1.5;
    if (weight <= 5) return 1.8;
    if (weight <= 10) return 2.2;
    return 2.8;
};

const calculateDeliveryCost = (parcelType, pickup, destination, weight) => {
    const base = basePrices[parcelType] || 80;
    const wMultiplier = weightMultiplier(weight);
    const isSameCity = pickup === destination;
    const distanceMultiplier = isSameCity ? 1 : 1.6;
    const total = Math.ceil(base * wMultiplier * distanceMultiplier);
    return total;
};

const PricingCalculator = () => {
    const [parcelType, setParcelType] = useState('');
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleCalculate = (e) => {
        e.preventDefault();

        // Validation
        if (!parcelType || !pickup || !destination || !weight) {
            setError('Please fill in all fields to calculate the cost.');
            setResult(null);
            return;
        }

        const w = parseFloat(weight);
        if (isNaN(w) || w <= 0) {
            setError('Please enter a valid weight greater than 0.');
            setResult(null);
            return;
        }

        if (w > 30) {
            setError('Maximum weight allowed is 30 kg. For heavier parcels, please contact us.');
            setResult(null);
            return;
        }

        setError('');
        const cost = calculateDeliveryCost(parcelType, pickup, destination, w);
        setResult({
            cost,
            parcelType: parcelTypes.find(p => p.value === parcelType)?.label || parcelType,
            pickup,
            destination,
            weight: w,
            isSameCity: pickup === destination,
        });
    };

    const handleReset = () => {
        setParcelType('');
        setPickup('');
        setDestination('');
        setWeight('');
        setResult(null);
        setError('');
    };

    return (
        <div className="bg-[#F0F0F0] min-h-screen">
            {/* Hero Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Pricing <span className="text-[#03373D]">Calculator</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Get an instant estimate for your delivery cost. Enter your parcel details below
                        and we'll calculate the best price for your shipment across Bangladesh.
                    </p>
                </div>
            </div>

            {/* Calculator Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Form Card */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            {/* Form Title */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-[#03373D] rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">ZaDex Calculator</h2>
                                    <p className="text-sm text-gray-500">Fill in the details to get an estimate</p>
                                </div>
                            </div>

                            <form onSubmit={handleCalculate} className="space-y-5">
                                {/* Parcel Type */}
                                <div>
                                    <label htmlFor="parcelType" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Parcel Type
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                        <select
                                            id="parcelType"
                                            value={parcelType}
                                            onChange={(e) => setParcelType(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 appearance-none cursor-pointer"
                                        >
                                            {parcelTypes.map((type) => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup & Destination - Two Columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Pickup Address */}
                                    <div>
                                        <label htmlFor="pickup" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Pickup Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="pickup"
                                                value={pickup}
                                                onChange={(e) => setPickup(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 appearance-none cursor-pointer"
                                            >
                                                <option value="">Select pickup district</option>
                                                {districts.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Destination */}
                                    <div>
                                        <label htmlFor="destination" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                            Delivery Destination
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="destination"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 appearance-none cursor-pointer"
                                            >
                                                <option value="">Select delivery district</option>
                                                {districts.map((d) => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Weight */}
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Parcel Weight (kg)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                            </svg>
                                        </div>
                                        <input
                                            id="weight"
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            max="30"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="Enter weight in kg (e.g. 2.5)"
                                            className="w-full pl-11 pr-16 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-sm font-semibold text-gray-400">KG</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer text-sm"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3.5 bg-[#03373D] text-white font-bold rounded-xl hover:bg-[#025a63] shadow-lg shadow-[#03373D]/20 hover:shadow-[#03373D]/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm"
                                    >
                                        Calculate Cost
                                    </button>
                                </div>
                            </form>

                            {/* Result Card */}
                            {result && (
                                <div className="mt-8 bg-gradient-to-br from-[#03373D] to-[#025a63] rounded-2xl p-6 text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">Estimated Delivery Cost</h3>
                                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                                            {result.isSameCity ? 'Same City' : 'Inter-City'}
                                        </span>
                                    </div>

                                    <div className="text-center py-4">
                                        <p className="text-5xl font-extrabold mb-1">৳{result.cost}</p>
                                        <p className="text-white/70 text-sm">Estimated delivery charge</p>
                                    </div>

                                    <div className="border-t border-white/20 pt-4 mt-2 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">Parcel Type</span>
                                            <span className="font-semibold">{result.parcelType}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">From</span>
                                            <span className="font-semibold">{result.pickup}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">To</span>
                                            <span className="font-semibold">{result.destination}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/70">Weight</span>
                                            <span className="font-semibold">{result.weight} kg</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notes Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Pricing Notes</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">1</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Base Price by Parcel Type</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Documents start at ৳50, small parcels at ৳80, medium at ৳120, and large parcels at ৳180. Electronics and fragile items are priced higher.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">2</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Weight-Based Pricing</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Parcels up to 0.5kg have no extra charge. 0.5-1kg adds 20%, 1-3kg adds 50%, 3-5kg adds 80%, 5-10kg adds 120%, and above 10kg adds 180%.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">3</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Same City vs Inter-City</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Deliveries within the same city enjoy standard pricing. Inter-city deliveries have a 60% distance surcharge applied.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">4</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Fragile & Special Handling</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Fragile items, liquids, and electronics require special packaging and handling, which is included in the base price.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">5</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Maximum Weight Limit</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Standard delivery supports parcels up to 30 kg. For heavier shipments, please contact our support team for a custom quote.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-6 h-6 bg-[#E6F7F8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-[#03373D]">6</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Price is an Estimate</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            The calculated price is an estimate. Final charges may vary slightly based on exact pickup location, route conditions, and any additional services.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Reference Table */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Quick Reference</h4>
                                <div className="overflow-hidden rounded-xl border border-gray-200">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-[#03373D] text-white">
                                                <th className="px-3 py-2 text-left font-semibold">Parcel Type</th>
                                                <th className="px-3 py-2 text-right font-semibold">Base Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3 py-2 text-gray-700">📄 Document</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳50</td>
                                            </tr>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <td className="px-3 py-2 text-gray-700">📦 Small (≤1kg)</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳80</td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3 py-2 text-gray-700">📦 Medium (1-5kg)</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳120</td>
                                            </tr>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <td className="px-3 py-2 text-gray-700">📦 Large (5-15kg)</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳180</td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="px-3 py-2 text-gray-700">🔶 Fragile</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳150</td>
                                            </tr>
                                            <tr className="border-b border-gray-100 bg-gray-50">
                                                <td className="px-3 py-2 text-gray-700">💧 Liquid</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳160</td>
                                            </tr>
                                            <tr>
                                                <td className="px-3 py-2 text-gray-700">💻 Electronics</td>
                                                <td className="px-3 py-2 text-right font-semibold text-gray-800">৳200</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingCalculator;