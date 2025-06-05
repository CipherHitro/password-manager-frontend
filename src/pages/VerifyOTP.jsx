import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Handle OTP input change
    const handleChange = (index, value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits are entered
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
            handleVerify(newOtp.join(''));
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Focus on the next empty input or last input
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();

        // Auto-submit if 6 digits pasted
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    // Verify OTP
    const handleVerify = async (otpCode = otp.join('')) => {
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch('/api/user/verify-otp', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otpCode, email })
            })
            const data = await response.json()

            if (response.ok) {
                alert('OTP verified successfully!');
                navigate('/reset-password', { state: { resetToken: data.resetToken, email } })
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
                // Clear OTP inputs
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP
    const handleResend = async () => {
        setIsLoading(true);
        setError('');

        try {

            const response = await fetch('/api/user/forgot-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
            const data = await response.json()
            console.log(data)

            if (response.ok) {
                alert('New OTP sent to your email!');
            } else {
                setError(data.message || 'Failed to send OTP');
                // Clear OTP inputs
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }

            // Reset timer
            setTimer(60);
            setCanResend(false);

            // Clear current OTP
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className='min-h-screen bg-white bg-[size:6rem_4rem]'>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
                <Navbar />

                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                        {/* Verify OTP Card */}
                        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
                            {/* Back Button */}
                            <div className="mb-6">
                                <button
                                    type="button"
                                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                    onClick={() => window.history.back()}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Back
                                </button>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                                <p className="text-gray-600 mb-2">
                                    We've sent a 6-digit verification code to
                                </p>
                                <p className="text-blue-600 font-medium">{email}</p>
                            </div>

                            {/* OTP Input Fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                        Enter verification code
                                    </label>
                                    <div className="flex justify-center space-x-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => inputRefs.current[index] = el}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error
                                                    ? 'border-red-300 bg-red-50'
                                                    : digit
                                                        ? 'border-blue-300 bg-blue-50'
                                                        : 'border-gray-300 bg-white/50'
                                                    }`}
                                                disabled={isLoading}
                                            />
                                        ))}
                                    </div>
                                    {error && (
                                        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                                    )}
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="button"
                                    onClick={() => handleVerify()}
                                    disabled={isLoading || otp.join('').length !== 6}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify Code'
                                    )}
                                </button>

                                {/* Resend Section */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 mb-3">
                                        Didn't receive the code?
                                    </p>
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={isLoading}
                                            className="text-blue-600 hover:text-blue-500 font-medium text-sm transition-colors disabled:opacity-50"
                                        >
                                            Resend Code
                                        </button>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Resend code in{' '}
                                            <span className="font-medium text-blue-600">
                                                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                            </span>
                                        </p>
                                    )}
                                </div>

                                {/* Help Text */}
                                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                                    <p className="font-medium mb-1">💡 Tips:</p>
                                    <ul className="space-y-1">
                                        <li>• Check your spam/junk folder</li>
                                        <li>• Make sure you entered the correct email</li>
                                        <li>• The code expires in 10 minutes</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VerifyOTP;