import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useUserRole from '../../Hooks/useUserRole';

const BeARider = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, isRoleLoading] = useUserRole();

    // Check if the user already has a rider application
    const { data: riderApplication, isPending: isAppLoading } = useQuery({
        queryKey: ['riderApplication', user?.email],
        enabled: !authLoading && !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get('/rider-applications/my-status');
            if (res.data?.hasApplication) {
                return res.data.application;
            }
            return null;
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const form = e.target;
        const riderData = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            nid: form.nid.value,
            age: form.age.value,
            region: form.region.value,
            district: form.district.value,
            license: form.license.value,
            bikeSpecs: form.bikeSpecs.value,
            bikeReg: form.bikeReg.value,
            bio: form.bio.value,
            // Track who submitted this based on the logged-in user inside AuthContext
            userId: user?.uid,
        };

        try {
            const response = await axiosSecure.post('/rider-applications', riderData);
            if (response.data.insertedId) {
                setSuccess('Application submitted successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000); // Redirect after success
            }
        } catch (err) {
            console.error(err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to submit application. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading while either query is still fetching
    if (isRoleLoading || isAppLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 animate-spin text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">Checking application status...</p>
                </div>
            </div>
        );
    }

    // ── STATE 1: User is already an approved Rider ──
    if (userData?.role === 'rider' || riderApplication?.status === 'active') {
        const displayData = riderApplication || userData;
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-emerald-100 animate-[fadeInUp_0.3s_ease-out]">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">You&apos;re already a Rider! 🎉</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">You have an active rider account with ZaDex. Ready to hit the road and make some deliveries?</p>

                    {/* Application info card */}
                    {displayData && (
                        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-3 border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Rider Profile</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Region</p>
                                    <p className="text-sm font-semibold text-gray-800">{displayData.region || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">District</p>
                                    <p className="text-sm font-semibold text-gray-800">{displayData.district || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vehicle</p>
                                    <p className="text-sm font-semibold text-gray-800">{displayData.bikeSpecs || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Reg No.</p>
                                    <p className="text-sm font-semibold text-gray-800 font-mono">{displayData.bikeReg || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition duration-300 shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Go to Rider Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // ── STATE 2: Account is blocked ──
    if (userData?.status === 'blocked') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-red-100 animate-[fadeInUp_0.3s_ease-out]">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Account Action Required</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">Your account is currently restricted. Please contact our support team to resolve this issue and restore access.</p>
                    <a href="mailto:support@zadex.com" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Support
                    </a>
                </div>
            </div>
        );
    }

    // ── STATE 3: Has a pending rider application ──
    if (riderApplication && (riderApplication.status === 'pending' || !riderApplication.status)) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 flex items-center justify-center">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl w-full border border-gray-100 animate-[fadeInUp_0.3s_ease-out]">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-orange-50">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Application Under Review 🚚</h2>
                        <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">Our Admin team is currently reviewing your profile. You&apos;ll be notified once a decision is made!</p>
                    </div>

                    {/* Visual Stepper */}
                    <div className="relative max-w-md mx-auto mb-10">
                        <div className="flex flex-col items-center relative z-10 w-full">
                            <div className="flex justify-between w-full relative group">
                                {/* Connecting Line */}
                                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 -z-10 rounded-full overflow-hidden">
                                    <div className="h-full bg-linear-to-r from-emerald-500 to-orange-400 w-1/2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                                </div>
                                {/* Step 1: Form Submitted */}
                                <div className="flex flex-col items-center w-24">
                                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/40 ring-4 ring-white mb-3 transition-transform hover:scale-110">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-widest text-center">Submitted</span>
                                </div>
                                {/* Step 2: Under Review */}
                                <div className="flex flex-col items-center w-24">
                                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-orange-500/40 ring-4 ring-white animate-pulse mb-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] font-bold text-orange-600 uppercase tracking-widest text-center">Reviewing</span>
                                </div>
                                {/* Step 3: Active Status */}
                                <div className="flex flex-col items-center w-24">
                                    <div className="w-10 h-10 bg-gray-50 text-gray-300 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center font-bold ring-4 ring-white mb-3">
                                        3
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest text-center">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submitted Application Summary */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Application Summary</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Name</p>
                                <p className="text-sm font-semibold text-gray-800">{riderApplication.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                                <p className="text-sm font-semibold text-gray-800">{riderApplication.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Region</p>
                                <p className="text-sm font-semibold text-gray-800">{riderApplication.region}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">District</p>
                                <p className="text-sm font-semibold text-gray-800">{riderApplication.district}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vehicle</p>
                                <p className="text-sm font-semibold text-gray-800">{riderApplication.bikeSpecs}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bike Reg.</p>
                                <p className="text-sm font-semibold text-gray-800 font-mono">{riderApplication.bikeReg}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 text-center">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── STATE 4: Application was rejected ──
    if (riderApplication && riderApplication.status === 'rejected') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-amber-100 animate-[fadeInUp_0.3s_ease-out]">
                    <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-amber-50">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Application Not Approved</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">Unfortunately, your previous application was not approved at this time. Please contact our support team for more details or to discuss next steps.</p>
                    <a href="mailto:support@zadex.com" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-amber-50 text-amber-700 font-bold rounded-xl hover:bg-amber-100 transition duration-300 mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Support
                    </a>
                    <Link to="/dashboard" className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition duration-300">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // ── DEFAULT: Show the Registration Form (new applicant) ──
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Become a <span className="text-orange-500">ZaDex</span> Rider
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                        Join our fast-growing delivery network, earn money on your own schedule, and deliver smiles across the city.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-linear-to-r from-orange-500 to-orange-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Rider Application Form
                        </h2>
                        <p className="text-orange-100 mt-1">Please fill in your authentic details. All fields are required.</p>
                    </div>

                    {error && (
                        <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mx-8 mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-600 text-sm">
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 border-gray-200">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" id="name" name="name" required placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" id="email" name="email" required defaultValue={user?.email || ''} readOnly={!!user?.email}
                                        className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${user?.email ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-gray-50'}`} />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" required placeholder="+880 1XXX-XXXXXX"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="nid" className="block text-sm font-medium text-gray-700 mb-1">NID Number</label>
                                    <input type="text" id="nid" name="nid" required placeholder="National ID Number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                                    <select id="age" name="age" required defaultValue=""
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none">
                                        <option value="" disabled>Select your age range</option>
                                        <option value="18-20">18 - 20</option>
                                        <option value="21-25">21 - 25</option>
                                        <option value="26-30">26 - 30</option>
                                        <option value="31-40">31 - 40</option>
                                        <option value="40+">40+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 border-gray-200">Address Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region/Division</label>
                                    <select id="region" name="region" required defaultValue=""
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none">
                                        <option value="" disabled>Select your division</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Chattogram">Chattogram</option>
                                        <option value="Sylhet">Sylhet</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                        <option value="Khulna">Khulna</option>
                                        <option value="Barishal">Barishal</option>
                                        <option value="Rangpur">Rangpur</option>
                                        <option value="Mymensingh">Mymensingh</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District/City</label>
                                    <select id="district" name="district" required defaultValue=""
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all appearance-none">
                                        <option value="" disabled>Select your district</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Faridpur">Faridpur</option>
                                        <option value="Gazipur">Gazipur</option>
                                        <option value="Gopalganj">Gopalganj</option>
                                        <option value="Kishoreganj">Kishoreganj</option>
                                        <option value="Madaripur">Madaripur</option>
                                        <option value="Manikganj">Manikganj</option>
                                        <option value="Munshiganj">Munshiganj</option>
                                        <option value="Narayanganj">Narayanganj</option>
                                        <option value="Narsingdi">Narsingdi</option>
                                        <option value="Rajbari">Rajbari</option>
                                        <option value="Shariatpur">Shariatpur</option>
                                        <option value="Tangail">Tangail</option>
                                        {/* Added a few common districts for context */}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 border-gray-200">Vehicle & License Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
                                    <input type="text" id="license" name="license" required placeholder="Enter License No."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                                <div>
                                    <label htmlFor="bikeSpecs" className="block text-sm font-medium text-gray-700 mb-1">Bike Brand, Model & Year</label>
                                    <input type="text" id="bikeSpecs" name="bikeSpecs" required placeholder="e.g. Yamaha FZ-S 2021"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="bikeReg" className="block text-sm font-medium text-gray-700 mb-1">Bike Registration Number</label>
                                    <input type="text" id="bikeReg" name="bikeReg" required placeholder="e.g. Dhaka Metro-La 12-3456"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 border-gray-200">About You</h3>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
                                <textarea id="bio" name="bio" rows="4" required placeholder="Tell us a little about yourself, your experience, and why you want to ride with ZaDex..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"></textarea>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full md:w-auto md:px-12 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isSubmitting
                                        ? 'bg-orange-400 cursor-not-allowed shadow-none'
                                        : 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting Application...
                                    </>
                                ) : (
                                    'Submit Application'
                                )}
                            </button>
                            <p className="text-sm text-gray-500 mt-4 text-center md:text-left">
                                By submitting this form, you agree to our Terms of Service and Privacy Policy. Our team will review your application and contact you shortly.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BeARider;