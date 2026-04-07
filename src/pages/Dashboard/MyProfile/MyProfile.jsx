import { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Edit mode toggle
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });

    // Form fields
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');

    // Extra profile data from server
    const [serverProfile, setServerProfile] = useState(null);

    // Photo preview
    const [photoPreview, setPhotoPreview] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const districts = [
        'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Sylhet', 'Rangpur', 'Barishal', 'Mymensingh',
        'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura', "Cox's Bazar", 'Jashore', 'Dinajpur',
        'Tangail', 'Brahmanbaria', 'Narsingdi', 'Faridpur', 'Pabna', 'Noakhali', 'Kushtia',
    ].sort();

    // Load profile data
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            setPhotoURL(user.photoURL || '');
            setPhotoPreview(user.photoURL || '');

            // Fetch extra profile data from server
            axiosSecure.get(`/users/profile?email=${user.email}`)
                .then(res => {
                    if (res.data) {
                        setServerProfile(res.data);
                        setPhone(res.data.phone || '');
                        setAddress(res.data.address || '');
                        setCity(res.data.city || '');
                        setDistrict(res.data.district || '');
                    }
                })
                .catch(() => {
                    // Profile doesn't exist on server yet, that's fine
                });
        }
    }, [user, axiosSecure]);



    const handleCancel = () => {
        // Reset to original values
        setDisplayName(user?.displayName || '');
        setPhotoURL(user?.photoURL || '');
        setPhotoPreview(user?.photoURL || '');
        setImageFile(null);
        setPhone(serverProfile?.phone || '');
        setAddress(serverProfile?.address || '');
        setCity(serverProfile?.city || '');
        setDistrict(serverProfile?.district || '');
        setIsEditing(false);
        setSaveMessage({ type: '', text: '' });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage({ type: '', text: '' });

        try {
            let currentPhotoURL = photoURL;
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: 'POST', body: formData }
                );
                const data = await response.json();
                
                if (data.secure_url) {
                    currentPhotoURL = data.secure_url;
                    setPhotoURL(currentPhotoURL);
                }
            }

            // Update Firebase profile (name & photo)
            await updateUserProfile({
                displayName: displayName,
                photoURL: currentPhotoURL,
            });

            // Save extra data to server (phone, address, etc.)
            await axiosSecure.put('/users/profile', {
                email: user.email,
                displayName,
                photoURL: currentPhotoURL,
                phone,
                address,
                city,
                district,
                updatedAt: new Date().toISOString(),
            });

            setServerProfile(prev => ({
                ...prev,
                phone,
                address,
                city,
                district,
            }));

            setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
            setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#03373D]/30 focus:border-[#03373D] transition-all duration-200";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your account information</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#03373D] text-white font-semibold text-sm rounded-xl hover:bg-[#025a63] transition-all duration-200 shadow-lg shadow-[#03373D]/20 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-5 py-2.5 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-5 py-2.5 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg cursor-pointer ${
                                isSaving
                                    ? 'bg-[#03373D]/60 cursor-not-allowed shadow-none'
                                    : 'bg-[#03373D] hover:bg-[#025a63] shadow-[#03373D]/20'
                            }`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Success/Error Message */}
            {saveMessage.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    saveMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {saveMessage.type === 'success' ? (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <p className="text-sm font-medium">{saveMessage.text}</p>
                    <button onClick={() => setSaveMessage({ type: '', text: '' })} className="ml-auto cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Photo */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Profile Photo</h3>

                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-2xl bg-[#03373D] flex items-center justify-center text-white font-bold text-5xl overflow-hidden shadow-xl shadow-[#03373D]/20 mb-4">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                        onError={() => setPhotoPreview('')}
                                    />
                                ) : (
                                    displayName?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>

                            {isEditing ? (
                                <div className="w-full mt-2">
                                    <label className={labelClass}>Upload New Photo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                setPhotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className={`${inputClass} py-2.5! bg-white cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all`}
                                    />
                                    <p className="text-xs text-gray-400 mt-2 text-center">Choose an image file to update your avatar</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-bold text-gray-900">{user?.displayName || 'User'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                                </div>
                            )}
                        </div>

                        {/* Account Info (always visible) */}
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Status</p>
                                    <p className="text-sm font-semibold text-emerald-600">Verified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Member Since</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {user?.metadata?.creationTime
                                            ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#03373D]/10 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#03373D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Personal Information</h3>
                                <p className="text-xs text-gray-400">Your basic account details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div>
                                <label className={labelClass}>Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className={inputClass}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-800">{user?.displayName || 'Not set'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Email (always read-only) */}
                            <div>
                                <label className={labelClass}>Email</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
                                    <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Read only</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className={labelClass}>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. 01712345678"
                                        className={inputClass}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-800">{phone || 'Not set'}</p>
                                    </div>
                                )}
                            </div>

                            {/* District */}
                            <div>
                                <label className={labelClass}>District</label>
                                {isEditing ? (
                                    <div className="relative">
                                        <select
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            className={`${inputClass} appearance-none cursor-pointer`}
                                        >
                                            <option value="">Select your district</option>
                                            {districts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-800">{district || 'Not set'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Address</h3>
                                <p className="text-xs text-gray-400">Your delivery and pickup address</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Address */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>Full Address</label>
                                {isEditing ? (
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your full address (House, Road, Area)"
                                        rows={3}
                                        className={`${inputClass} resize-none`}
                                    />
                                ) : (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                        <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-800">{address || 'Not set'}</p>
                                    </div>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className={labelClass}>City / Area</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Enter your city or area name"
                                        className={inputClass}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p className="text-sm font-semibold text-gray-800">{city || 'Not set'}</p>
                                    </div>
                                )}
                            </div>

                            {/* District (display only in address section when not editing) */}
                            <div>
                                <label className={labelClass}>District</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-800">{district || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
