import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import SocialLogin from '../SocialLogin/SocialLogin';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const { createUser, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!email.includes('@')) return 'Email must include @';
        if (!email.endsWith('.com')) return 'Email must end with .com';
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    const validateName = (name) => {
        if (!name.trim()) return 'Name is required';
        return '';
    };

    const validateImage = () => {
        // file is optional now
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const imageError = validateImage(imageFile);

        setErrors({
            name: nameError,
            email: emailError,
            password: passwordError,
            image: imageError,
        });

        if (nameError || emailError || passwordError || imageError) return;

        setIsSubmitting(true);

        try {
            let photoURL = "";
            
            if (imageFile) {
                // 1. Upload to Cloudinary
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: 'POST', body: formData }
                );
                const data = await response.json();
                
                if (!data.secure_url) {
                    throw new Error('Failed to upload image to Cloudinary.');
                }
                
                console.log("Photo uploaded to Cloudinary successfully:", data.secure_url);
                photoURL = data.secure_url;
            }

            // 2. Create user in Firebase
            await createUser(email, password);

            // 3. Update Firebase profile with display name and photoURL
            await updateUserProfile({ displayName: name, photoURL });

            // 4. Save user to server database
            const newUser = {
                name,
                email,
                photoURL,
                role: 'user',
                status: 'verified',
                registrationDate: new Date()
            };

            await axiosSecure.post('/users', newUser);

            // 5. Show success popup
            setShowSuccess(true);

            // 6. Redirect to intended page after 2 seconds
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error.message);
            let msg = error.message;
            if (msg.includes('email-already-in-use')) {
                msg = 'This email is already registered. Please login instead.';
            }
            setErrors((prev) => ({ ...prev, general: msg }));
            setIsSubmitting(false);
        }
    };

    return (
        <>
        {/* Success Popup Overlay */}
        {showSuccess && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-4 animate-[fadeInUp_0.4s_ease-out] max-w-sm mx-4">
                    {/* Animated Checkmark */}
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Welcome aboard! 🎉</h2>
                    <p className="text-gray-500 text-sm text-center">Your account has been created successfully. Redirecting you to the dashboard...</p>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full animate-[progressBar_2s_linear]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        )}
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Create an account ✨
                </h1>
                <p className="text-gray-500 text-sm">
                    Sign up to get started with Zadex
                </p>
            </div>

            {/* General Error */}
            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {errors.general}
                </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Picture Upload (Circle) */}
                <div className="flex flex-col items-center mb-6">
                    <label htmlFor="image" className="relative cursor-pointer group">
                        <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                            errors.image ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 group-hover:border-orange-500 group-hover:bg-orange-50'
                        }`}>
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                            ) : (
                                <svg className={`w-8 h-8 ${errors.image ? 'text-red-400' : 'text-gray-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    console.log("Photo selected:", file.name);
                                    setImageFile(file);
                                    setImagePreview(URL.createObjectURL(file));
                                    if (errors.image) setErrors((prev) => ({ ...prev, image: '' }));
                                }
                            }}
                        />
                    </label>
                    {errors.image && (
                        <p className="text-xs text-red-500 mt-2 text-center">{errors.image}</p>
                    )}
                </div>

                {/* Name Field */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                />
                            </svg>
                        </div>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                            }}
                            placeholder="John Doe"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                errors.name ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' : 'border-gray-200 focus:ring-orange-500/30 focus:border-orange-500'
                            } bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.name}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="register-email"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            </svg>
                        </div>
                        <input
                            id="register-email"
                            type="text"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            placeholder="you@example.com"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                errors.email ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' : 'border-gray-200 focus:ring-orange-500/30 focus:border-orange-500'
                            } bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="register-password"
                        className="block text-sm font-semibold text-gray-700 mb-1.5"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        </div>
                        <input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                            }}
                            placeholder="Minimum 6 characters"
                            className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                                errors.password ? 'border-red-400 focus:ring-red-500/30 focus:border-red-500' : 'border-gray-200 focus:ring-orange-500/30 focus:border-orange-500'
                            } bg-gray-50/50 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-all duration-200`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.password}</p>
                    )}
                    {/* Password strength indicator */}
                    {password && !errors.password && (
                        <div className="mt-2 flex gap-1">
                            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                password.length >= 2 ? (password.length >= 8 ? 'bg-green-400' : password.length >= 6 ? 'bg-orange-400' : 'bg-red-400') : 'bg-gray-200'
                            }`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                password.length >= 6 ? (password.length >= 8 ? 'bg-green-400' : 'bg-orange-400') : 'bg-gray-200'
                            }`}></div>
                            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                                password.length >= 8 ? 'bg-green-400' : 'bg-gray-200'
                            }`}></div>
                        </div>
                    )}
                </div>



                {/* Register Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 text-white font-bold rounded-xl shadow-lg transition-all duration-300 cursor-pointer text-sm flex items-center justify-center gap-2 ${
                        isSubmitting
                            ? 'bg-orange-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                    {isSubmitting ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 font-medium">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Register Button */}
                <SocialLogin />
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-8">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                    Login
                </Link>
            </p>
        </div>
        </>
    );
};

export default Register;