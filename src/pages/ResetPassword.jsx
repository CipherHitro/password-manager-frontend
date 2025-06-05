import React from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;
  const email = location.state?.email;
  const password = watch('password');

  const onSubmit = async (data) => {
    
    try {
      const response = await fetch('/api/user/reset-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: data.password,
          resetToken,
          email
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Show success message and redirect to login
        alert('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        alert(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <main className='min-h-screen bg-white bg-[size:6rem_4rem]'>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <Navbar/>
        
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Reset Password Card */}
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
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">Create a new password for your account. Make sure it's strong and secure.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white/50'
                      }`}
                      placeholder="Enter your new password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters long'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.confirmPassword 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 bg-white/50'
                      }`}
                      placeholder="Confirm your new password"
                      {...register('confirmPassword', { 
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Reset Password
                </button>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{' '}
                    <NavLink to="/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                      Back to login
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;