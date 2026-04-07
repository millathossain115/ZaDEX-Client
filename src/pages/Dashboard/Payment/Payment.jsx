import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form states
    const [bkashPhone, setBkashPhone] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    useEffect(() => {
        // Fetch parcel details to get the cost
        const fetchParcel = async () => {
            if (!user?.email) return;
            try {
                // Fetch user's parcels to find the one matching the ID
                const res = await axiosSecure.get(`/parcels?email=${user.email}`);
                const found = res.data.find(p => p._id === id);
                if (found) {
                    setParcel(found);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        if (user?.email) {
            fetchParcel();
        }
    }, [id, axiosSecure, user]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                // Optional: You could actually hit an endpoint like /parcels/pay/:id or handle SSLCommerz logic here
                // For now, we update the parcel's payment status to 'paid' via existing PUT endpoint if we can,
                // or just redirect back gracefully simulating success.
                // Simulate a realistic transaction ID
                const mockTxnId = 'ZDX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                const paymentDate = new Date().toISOString();

                // 1. Save the payment transaction in the new /payments collection
                const paymentPayload = {
                    email: user?.email,
                    paymentDate: paymentDate,
                    paymentMethod: selectedMethod,
                    paymentStatus: 'paid',
                    transactionId: mockTxnId,
                    parcelId: id // Storing the associated parcel ID here as well
                };
                console.log("Saving new payment data:", paymentPayload);
                const paymentResponse = await axiosSecure.post('/payments', paymentPayload);
                console.log("Payment response:", paymentResponse.data);

                // 2. Update the parcel's status via existing PUT endpoint
                console.log(`Updating parcel status for ID ${id}...`);
                await axiosSecure.put(`/parcels/${id}`, {
                    paymentStatus: 'paid',
                    paymentMethod: selectedMethod,
                    transactionId: mockTxnId,
                    paymentDate: paymentDate
                });
                console.log(`Parcel updated successfully.`);
                
                alert(`Payment successful via ${selectedMethod === 'card' ? 'Card' : selectedMethod === 'bkash' ? 'bKash' : 'Nagad'}!`);
                navigate('/dashboard/payment-history');
            } catch (err) {
                console.error("Payment processing error:", err);
                alert('Success, but backend update failed. Back to history.');
                navigate('/dashboard/payment-history');
            } finally {
                setIsProcessing(false);
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-[#03373D]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!parcel) {
        return <div className="p-8 text-center text-red-500">Parcel not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Complete Payment</h1>
                <p className="text-gray-500">Choose your preferred payment method below to complete the booking for <span className="font-semibold text-gray-800">{parcel.parcelName || 'your parcel'}</span>.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Payment Summary */}
                <div className="w-full md:w-5/12 bg-linear-to-br from-[#03373D] to-[#025a63] p-8 text-white flex flex-col justify-between">
                    <div>
                        <p className="text-white/70 text-sm font-semibold mb-1 uppercase tracking-wider">Amount Due</p>
                        <h2 className="text-5xl font-extrabold mb-8">৳{parcel.totalCost || parcel.price || 0}</h2>
                        
                        <div className="space-y-4">
                            <div className="border-b border-white/10 pb-4">
                                <p className="text-white/60 text-xs mb-1">Parcel ID / Ref</p>
                                <p className="font-mono text-sm break-all">{parcel._id}</p>
                            </div>
                            <div className="border-b border-white/10 pb-4">
                                <p className="text-white/60 text-xs mb-1">Route</p>
                                <p className="text-sm font-semibold">{parcel.senderDistrict} → {parcel.receiverDistrict}</p>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs mb-1">Date Requested</p>
                                <p className="text-sm font-semibold">{parcel.pickupDate || parcel.requestedDate || 'Pending'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Methods */}
                <div className="w-full md:w-7/12 p-8 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Select Payment Method</h3>
                    
                    {/* Method Selector */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {/* Option: Card */}
                        <div 
                            onClick={() => setSelectedMethod('card')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'card' ? 'border-[#03373D] bg-white shadow-md' : 'border-transparent bg-white shadow-sm hover:border-gray-300'}`}
                        >
                            <svg className={`w-8 h-8 mb-2 ${selectedMethod === 'card' ? 'text-[#03373D]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <span className={`text-xs font-bold ${selectedMethod === 'card' ? 'text-gray-900' : 'text-gray-500'}`}>Credit/Debit</span>
                        </div>

                        {/* Option: bKash */}
                        <div 
                            onClick={() => setSelectedMethod('bkash')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'bkash' ? 'border-[#e2136e] bg-white shadow-md' : 'border-transparent bg-white shadow-sm hover:border-gray-300'}`}
                        >
                            <div className={`w-8 h-8 mb-2 flex items-center justify-center rounded-full ${selectedMethod === 'bkash' ? 'bg-[#e2136e] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="font-extrabold italic text-sm">b</span>
                            </div>
                            <span className={`text-xs font-bold ${selectedMethod === 'bkash' ? 'text-gray-900' : 'text-gray-500'}`}>bKash</span>
                        </div>

                        {/* Option: Nagad */}
                        <div 
                            onClick={() => setSelectedMethod('nagad')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'nagad' ? 'border-[#f37021] bg-white shadow-md' : 'border-transparent bg-white shadow-sm hover:border-gray-300'}`}
                        >
                            <div className={`w-8 h-8 mb-2 flex items-center justify-center rounded-full ${selectedMethod === 'nagad' ? 'bg-[#f37021] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="font-extrabold text-sm">N</span>
                            </div>
                            <span className={`text-xs font-bold ${selectedMethod === 'nagad' ? 'text-gray-900' : 'text-gray-500'}`}>Nagad</span>
                        </div>
                    </div>

                    {/* Forms */}
                    {!selectedMethod && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                            Please select a payment method to continue.
                        </div>
                    )}

                    {selectedMethod && (
                        <form onSubmit={handlePayment} className="space-y-5 animate-[fadeInUp_0.3s_ease-out]">
                            {selectedMethod === 'card' && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name on Card</label>
                                        <input required type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="JOHN DOE" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                                        <input required type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all font-mono tracking-widest" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                                            <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">CVC</label>
                                            <input required type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {(selectedMethod === 'bkash' || selectedMethod === 'nagad') && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        {selectedMethod === 'bkash' ? 'bKash Account Number' : 'Nagad Account Number'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-semibold">+880</span>
                                        </div>
                                        <input 
                                            required 
                                            type="tel" 
                                            value={bkashPhone} 
                                            onChange={e => setBkashPhone(e.target.value)} 
                                            placeholder="17XXXXXXXX" 
                                            className={`w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all ${selectedMethod === 'bkash' ? 'focus:ring-[#e2136e]/30 focus:border-[#e2136e]' : 'focus:ring-[#f37021]/30 focus:border-[#f37021]'}`} 
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`w-full mt-6 py-4 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                                    isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                                } ${
                                    selectedMethod === 'card' ? 'bg-[#03373D] hover:bg-[#025a63] shadow-[#03373D]/30' : 
                                    selectedMethod === 'bkash' ? 'bg-[#e2136e] hover:bg-[#c90f60] shadow-[#e2136e]/30' : 
                                    'bg-[#f37021] hover:bg-[#da621a] shadow-[#f37021]/30'
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay ৳{parcel.totalCost || parcel.price || 0} via {selectedMethod === 'card' ? 'Card' : selectedMethod === 'bkash' ? 'bKash' : 'Nagad'}</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;