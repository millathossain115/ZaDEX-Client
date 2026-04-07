import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

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
    document: 50, small: 80, medium: 120, large: 180,
    fragile: 150, liquid: 160, electronics: 200,
};

const weightMultiplier = (weight) => {
    if (weight <= 0.5) return 1;
    if (weight <= 1) return 1.2;
    if (weight <= 3) return 1.5;
    if (weight <= 5) return 1.8;
    if (weight <= 10) return 2.2;
    return 2.8;
};

const calculateDeliveryCost = (parcelType, senderDistrict, receiverDistrict, weight) => {
    const base = basePrices[parcelType] || 80;
    const wMultiplier = weightMultiplier(weight);
    const isSameCity = senderDistrict === receiverDistrict;
    const distanceMultiplier = isSameCity ? 1 : 1.6;
    const total = Math.ceil(base * wMultiplier * distanceMultiplier);
    return { total, base, wMultiplier, distanceMultiplier, isSameCity };
};

const AddParcel = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Parcel info
    const [parcelType, setParcelType] = useState('');
    const [parcelName, setParcelName] = useState('');
    const [parcelWeight, setParcelWeight] = useState('');

    // Sender info
    const [senderName, setSenderName] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [senderPhone, setSenderPhone] = useState('');
    const [senderDistrict, setSenderDistrict] = useState('');
    const [pickupInstruction, setPickupInstruction] = useState('');

    // Receiver info
    const [receiverName, setReceiverName] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [receiverDistrict, setReceiverDistrict] = useState('');
    const [deliveryInstruction, setDeliveryInstruction] = useState('');

    // Pickup time
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTimeSlot, setPickupTimeSlot] = useState('');

    // UI state
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [costBreakdown, setCostBreakdown] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBookingClick = (e) => {
        e.preventDefault();

        // Validation
        if (!parcelType || !parcelName || !parcelWeight) {
            setError('Please fill in all parcel details.');
            return;
        }
        if (!senderName || !senderAddress || !senderPhone || !senderDistrict) {
            setError('Please fill in all sender details.');
            return;
        }
        if (!receiverName || !receiverAddress || !receiverPhone || !receiverDistrict) {
            setError('Please fill in all receiver details.');
            return;
        }
        if (!pickupDate || !pickupTimeSlot) {
            setError('Please select a pickup date and time slot.');
            return;
        }

        const w = parseFloat(parcelWeight);
        if (isNaN(w) || w <= 0) {
            setError('Please enter a valid weight greater than 0.');
            return;
        }
        if (w > 30) {
            setError('Maximum weight allowed is 30 kg. For heavier parcels, please contact us.');
            return;
        }

        setError('');

        const breakdown = calculateDeliveryCost(parcelType, senderDistrict, receiverDistrict, w);
        setCostBreakdown({
            ...breakdown,
            parcelTypeName: parcelTypes.find(p => p.value === parcelType)?.label || parcelType,
            parcelName,
            weight: w,
            senderName,
            senderAddress,
            senderPhone,
            senderDistrict,
            pickupInstruction,
            receiverName,
            receiverAddress,
            receiverPhone,
            receiverDistrict,
            deliveryInstruction,
            pickupDate,
            pickupTimeSlot,
        });
        setShowModal(true);
    };

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            const parcelData = {
                // Parcel info
                parcelType,
                parcelTypeName: costBreakdown.parcelTypeName,
                parcelName,
                parcelWeight: costBreakdown.weight,
                // Sender info
                senderName,
                senderAddress,
                senderPhone,
                senderDistrict,
                pickupInstruction,
                // Receiver info
                receiverName,
                receiverAddress,
                receiverPhone,
                receiverDistrict,
                deliveryInstruction,
                // Schedule
                pickupDate,
                pickupTimeSlot,
                // Cost breakdown
                basePrice: costBreakdown.base,
                weightMultiplier: costBreakdown.wMultiplier,
                distanceMultiplier: costBreakdown.distanceMultiplier,
                totalCost: costBreakdown.total,
                isSameCity: costBreakdown.isSameCity,
                // Meta
                status: 'Pending',
                bookedAt: new Date().toISOString(),
                email: user?.email,
            };

            await axiosSecure.post('/parcels', parcelData);

            setConfirmed(true);
            setIsSubmitting(false);
            setTimeout(() => {
                setShowModal(false);
                setConfirmed(false);
                // Reset form
                setParcelType(''); setParcelName(''); setParcelWeight('');
                setSenderName(''); setSenderAddress(''); setSenderPhone(''); setSenderDistrict(''); setPickupInstruction('');
                setReceiverName(''); setReceiverAddress(''); setReceiverPhone(''); setReceiverDistrict(''); setDeliveryInstruction('');
                setPickupDate(''); setPickupTimeSlot('');
                setCostBreakdown(null);
                // Redirect back to My Parcels dashboard
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setIsSubmitting(false);
            console.error('Failed to book parcel:', err);
            alert('Failed to book parcel. Please try again.');
        }
    };

    // Shared input styling
    const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200";
    const selectClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 appearance-none cursor-pointer";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="bg-[#F0F0F0] min-h-screen">
            {/* Hero Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-[#03373D]/10 px-4 py-1.5 rounded-full mb-4">
                        <svg className="w-4 h-4 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="text-xs font-bold text-[#03373D] tracking-wide uppercase">New Booking</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Enter your <span className="text-[#03373D]">Parcel Details</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Fill in the form below with your sender and receiver information to book a parcel delivery across Bangladesh.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-9/10 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <form onSubmit={handleBookingClick}>
                    {/* ========== PARCEL INFO CARD ========== */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-[#03373D] rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Parcel Information</h2>
                                <p className="text-sm text-gray-500">What are you sending?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Parcel Type */}
                            <div>
                                <label htmlFor="parcelType" className={labelClass}>Parcel Type</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <select id="parcelType" value={parcelType} onChange={(e) => setParcelType(e.target.value)} className={selectClass}>
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

                            {/* Parcel Name */}
                            <div>
                                <label htmlFor="parcelName" className={labelClass}>Parcel Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <input id="parcelName" type="text" value={parcelName} onChange={(e) => setParcelName(e.target.value)} placeholder="e.g. Birthday Gift, Laptop, Books" className={inputClass} />
                                </div>
                            </div>

                            {/* Parcel Weight */}
                            <div>
                                <label htmlFor="parcelWeight" className={labelClass}>Parcel Weight (kg)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                        </svg>
                                    </div>
                                    <input id="parcelWeight" type="number" step="0.1" min="0.1" max="30" value={parcelWeight} onChange={(e) => setParcelWeight(e.target.value)} placeholder="Enter weight in kg" className={`${inputClass} pr-16`} />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <span className="text-sm font-semibold text-gray-400">KG</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========== HORIZONTAL DIVIDER ========== */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-xs font-bold tracking-widest uppercase">Sender & Receiver</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* ========== SENDER & RECEIVER SIDE BY SIDE ========== */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* --- SENDER CARD --- */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Sender Details</h2>
                                    <p className="text-sm text-gray-500">Who is sending the parcel?</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Sender Name */}
                                <div>
                                    <label htmlFor="senderName" className={labelClass}>Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input id="senderName" type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Enter sender's full name" className={inputClass} />
                                    </div>
                                </div>

                                {/* Sender Address */}
                                <div>
                                    <label htmlFor="senderAddress" className={labelClass}>Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <input id="senderAddress" type="text" value={senderAddress} onChange={(e) => setSenderAddress(e.target.value)} placeholder="Enter full pickup address" className={inputClass} />
                                    </div>
                                </div>

                                {/* Sender Phone */}
                                <div>
                                    <label htmlFor="senderPhone" className={labelClass}>Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input id="senderPhone" type="tel" value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} placeholder="e.g. 01712345678" className={inputClass} />
                                    </div>
                                </div>

                                {/* Sender District */}
                                <div>
                                    <label htmlFor="senderDistrict" className={labelClass}>District</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <select id="senderDistrict" value={senderDistrict} onChange={(e) => setSenderDistrict(e.target.value)} className={selectClass}>
                                            <option value="">Select pickup district</option>
                                            {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Instruction */}
                                <div>
                                    <label htmlFor="pickupInstruction" className={labelClass}>Pickup Instruction <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <textarea id="pickupInstruction" value={pickupInstruction} onChange={(e) => setPickupInstruction(e.target.value)} placeholder="e.g. Ring doorbell, call before arrival..." rows={3} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 resize-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RECEIVER CARD --- */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Receiver Details</h2>
                                    <p className="text-sm text-gray-500">Who is receiving the parcel?</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Receiver Name */}
                                <div>
                                    <label htmlFor="receiverName" className={labelClass}>Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input id="receiverName" type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} placeholder="Enter receiver's full name" className={inputClass} />
                                    </div>
                                </div>

                                {/* Receiver Address */}
                                <div>
                                    <label htmlFor="receiverAddress" className={labelClass}>Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                        </div>
                                        <input id="receiverAddress" type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} placeholder="Enter full delivery address" className={inputClass} />
                                    </div>
                                </div>

                                {/* Receiver Phone */}
                                <div>
                                    <label htmlFor="receiverPhone" className={labelClass}>Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input id="receiverPhone" type="tel" value={receiverPhone} onChange={(e) => setReceiverPhone(e.target.value)} placeholder="e.g. 01812345678" className={inputClass} />
                                    </div>
                                </div>

                                {/* Receiver District */}
                                <div>
                                    <label htmlFor="receiverDistrict" className={labelClass}>District</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <select id="receiverDistrict" value={receiverDistrict} onChange={(e) => setReceiverDistrict(e.target.value)} className={selectClass}>
                                            <option value="">Select delivery district</option>
                                            {districts.map((d) => (<option key={d} value={d}>{d}</option>))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Instruction */}
                                <div>
                                    <label htmlFor="deliveryInstruction" className={labelClass}>Delivery Instruction <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3.5 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </div>
                                        <textarea id="deliveryInstruction" value={deliveryInstruction} onChange={(e) => setDeliveryInstruction(e.target.value)} placeholder="e.g. Leave at the door, call upon arrival..." rows={3} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200 resize-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========== PICKUP TIME CARD ========== */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Pickup Time Info <span className="text-sm font-normal text-gray-400">(Approx)</span></h2>
                                <p className="text-sm text-gray-500">When should we pick up your parcel?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Pickup Date */}
                            <div>
                                <label htmlFor="pickupDate" className={labelClass}>Preferred Pickup Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input id="pickupDate" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className={inputClass} />
                                </div>
                            </div>

                            {/* Pickup Time Slot */}
                            <div>
                                <label htmlFor="pickupTimeSlot" className={labelClass}>Preferred Time Slot</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <select id="pickupTimeSlot" value={pickupTimeSlot} onChange={(e) => setPickupTimeSlot(e.target.value)} className={selectClass}>
                                        <option value="">Select a time slot</option>
                                        <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                                        <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
                                        <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
                                        <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
                                        <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========== ERROR & SUBMIT ========== */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        id="confirmBookingBtn"
                        className="w-full py-4 bg-[#03373D] text-white font-bold text-lg rounded-2xl hover:bg-[#025a63] shadow-lg shadow-[#03373D]/20 hover:shadow-[#03373D]/30 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirm Booking
                    </button>
                </form>
            </div>

            {/* ========== CONFIRMATION MODAL (Center of screen) ========== */}
            {showModal && costBreakdown && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !confirmed && setShowModal(false)}></div>

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[modalSlideUp_0.3s_ease-out]">
                        {/* Confirmed Success State */}
                        {confirmed ? (
                            <div className="p-10 text-center">
                                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[scaleIn_0.4s_ease-out]">
                                    <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h3>
                                <p className="text-gray-500">Your parcel has been booked successfully. We'll notify you with tracking details shortly.</p>
                            </div>
                        ) : (
                            <>
                                {/* Modal Header */}
                                <div className="bg-linear-to-br from-[#03373D] to-[#025a63] rounded-t-3xl p-6 text-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-extrabold">Booking Summary</h3>
                                        <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-center py-3">
                                        <p className="text-white/70 text-sm mb-1">Estimated Total Cost</p>
                                        <p className="text-5xl font-extrabold">৳{costBreakdown.total}</p>
                                    </div>
                                    <div className="flex justify-center mt-2">
                                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                                            {costBreakdown.isSameCity ? '🏙️ Same City Delivery' : '🚚 Inter-City Delivery'}
                                        </span>
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-5">
                                    {/* Cost Breakdown */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Cost Breakdown
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Base Price ({costBreakdown.parcelTypeName})</span>
                                                <span className="font-semibold text-gray-800">৳{costBreakdown.base}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Weight Multiplier ({costBreakdown.weight} kg)</span>
                                                <span className="font-semibold text-gray-800">×{costBreakdown.wMultiplier}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Distance Charge</span>
                                                <span className="font-semibold text-gray-800">×{costBreakdown.distanceMultiplier}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-2.5 flex justify-between text-sm">
                                                <span className="font-bold text-gray-900">Total</span>
                                                <span className="font-extrabold text-[#03373D] text-lg">৳{costBreakdown.total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parcel Info */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Parcel Details
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Name</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.parcelName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Type</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.parcelTypeName}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Weight</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.weight} kg</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Route Info */}
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            Route & Schedule
                                        </h4>
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">From</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.senderDistrict}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">To</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.receiverDistrict}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Pickup Date</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.pickupDate}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Time Slot</span>
                                                <span className="font-semibold text-gray-800">{costBreakdown.pickupTimeSlot}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sender / Receiver Summary */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-emerald-50 rounded-xl p-3">
                                            <p className="text-xs font-bold text-emerald-700 mb-1.5">SENDER</p>
                                            <p className="text-sm font-semibold text-gray-900">{costBreakdown.senderName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{costBreakdown.senderPhone}</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-3">
                                            <p className="text-xs font-bold text-blue-700 mb-1.5">RECEIVER</p>
                                            <p className="text-sm font-semibold text-gray-900">{costBreakdown.receiverName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{costBreakdown.receiverPhone}</p>
                                        </div>
                                    </div>

                                    {/* Confirm Button */}
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isSubmitting}
                                        id="finalConfirmBtn"
                                        className={`w-full py-4 text-white font-bold text-base rounded-2xl shadow-lg shadow-[#03373D]/20 transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'bg-[#03373D]/60 cursor-not-allowed' : 'bg-[#03373D] hover:bg-[#025a63] hover:shadow-[#03373D]/30 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Booking...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Confirm & Book Parcel
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal animations */}
            <style>{`
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes scaleIn {
                    from { transform: scale(0); }
                    to { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AddParcel;