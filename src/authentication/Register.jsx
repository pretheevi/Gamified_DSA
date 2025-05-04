import { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RegistrationFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Complete
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateEmailStep = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPStep = () => {
    const newErrors = {};
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 5) {
      newErrors.otp = "OTP must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCompleteStep = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartRegistration = async () => {
    if (!validateEmailStep()) return;
    setLoading(true);
    try {
      const response = await api.post("auth/register/start", { email: formData.email });
      console.log(response)
      setStep(2);
    } catch (error) {
      console.error(error);
      setErrors({email: error.response.data.message || "Failed to send OTP"});
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTPStep()) return;
    setLoading(true);
    try {
      const response = await api.post("auth/register/verify", {
        email: formData.email,
        otp: formData.otp
      });
      setStep(3);
    } catch (error) {
      setErrors({ otp: error.response?.data?.detail || "Invalid OTP" });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!validateCompleteStep()) return;
    setLoading(true);
    try {
      const response = await api.post("auth/register/complete", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirm_password
      });
      setSuccessMessage("Registration successful! Redirecting...");
      // Redirect after delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setErrors({ api: error.response?.data?.detail || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-indigo-700">Create Your Account</h2>
            <p className="text-center text-gray-500">We'll send a verification code to your email</p>
            
            <div className="space-y-4">
              <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${errors.email ? 'border-red-500' : 'border-transparent'}`}>
                <FaEnvelope className="text-indigo-500 mr-3 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              
              <button
                onClick={handleStartRegistration}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <span 
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 font-semibold hover:underline hover:text-indigo-800 cursor-pointer"
                >
                  Log in here
                </span>
              </p>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center">
              <button 
                onClick={() => setStep(1)}
                className="text-indigo-600 hover:text-indigo-800 mr-2"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <h2 className="text-2xl font-bold text-center flex-1 text-indigo-700">Verify Your Email</h2>
            </div>
            <p className="text-center text-gray-500">Enter the 6-digit code sent to {formData.email}</p>
            
            <div className="space-y-4">
              <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${errors.otp ? 'border-red-500' : 'border-transparent'}`}>
                <FaCheck className="text-indigo-500 mr-3 text-lg" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Verification Code"
                  className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
                  maxLength={6}
                />
              </div>
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
              
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center">
              <button 
                onClick={() => setStep(2)}
                className="text-indigo-600 hover:text-indigo-800 mr-2"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <h2 className="text-2xl font-bold text-center flex-1 text-indigo-700">Complete Your Profile</h2>
            </div>
            <p className="text-center text-gray-500">Just a few more details to finish</p>
            
            <div className="space-y-4">
              <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${errors.username ? 'border-red-500' : 'border-transparent'}`}>
                <FaUser className="text-indigo-500 mr-3 text-lg" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              
              <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
                <FaLock className="text-indigo-500 mr-3 text-lg" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              
              <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${errors.confirm_password ? 'border-red-500' : 'border-transparent'}`}>
                <FaLock className="text-indigo-500 mr-3 text-lg" />
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
                />
              </div>
              {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password}</p>}
              
              <button
                onClick={handleCompleteRegistration}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {loading ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {successMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-green-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Success!</h2>
            <p className="text-gray-600">{successMessage}</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        )}
        
        {/* Progress indicators */}
        {!successMessage && (
          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationFlow;