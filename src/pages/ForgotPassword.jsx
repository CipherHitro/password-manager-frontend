import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import Navbar from './../components/Navbar';
import { NavLink ,useNavigate} from 'react-router-dom';

// Mock Navbar component for demonstration


const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const response = await fetch('/user/forgot-password', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const result = await response.json();
    if(response.ok){
      navigate('/verify-otp', { state: { email: data.email } })
    }
    else{
      alert(result.message)
      
    }
  };

  return (
    <main className='min-h-screen bg-white bg-[size:6rem_4rem]'>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Navbar/>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Forgot Password Card */}
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8">
              {/* Back Button */}
              <div className="mb-6">
                <button
                  type="button"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </button>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600">Don't worry! Enter your email address and we'll send you an OTP to reset your password.</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.email 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white/50'
                      }`}
                      placeholder="Enter your email address"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Send OTP
                </button>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Remember your password?{' '}
                    <NavLink to="/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                      Back to login
                    </NavLink>
                  </p>
                  <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">💡 Didn't receive the email?</p>
                    <p>Check your spam folder or contact support if you continue to have issues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;