import { useState } from 'react'
import { FaEnvelope, FaLock, FaUser, FaCheck, FaArrowLeft, FaShieldAlt, FaChevronRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const RegistrationFlow = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Complete
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    username: '',
    password: '',
    confirm_password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateEmailStep = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOTPStep = () => {
    const newErrors = {}
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required"
    } else if (formData.otp.length !== 5) {
      newErrors.otp = "OTP must be 5 digits"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCompleteStep = () => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }
    else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords don't match"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStartRegistration = async () => {
    if (!validateEmailStep()) return
    setLoading(true)
    try {
      const response = await api.post("auth/register/start", { email: formData.email })
      setStep(2)
    } catch (error) {
      setErrors({email: error.response?.data?.message || "Failed to send OTP"})
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!validateOTPStep()) return
    setLoading(true)
    try {
      const response = await api.post("auth/register/verify", {
        email: formData.email,
        otp: formData.otp
      })
      setStep(3)
    } catch (error) {
      setErrors({ otp: error.response?.data?.detail || "Invalid OTP" })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteRegistration = async () => {
    if (!validateCompleteStep()) return
    setLoading(true)
    try {
      const response = await api.post("auth/register/complete", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirm_password
      })
      setSuccessMessage("Registration successful! Redirecting to your DSA journey...")
      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      setErrors({ api: error.response?.data?.detail || "Registration failed" })
    } finally {
      setLoading(false)
    }
  }

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
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
                Join the DSA Quest
              </h2>
              <p className="text-gray-400">Begin your coding adventure</p>
            </div>
            
            <div className="space-y-4">
              <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${errors.email ? 'border-red-500' : 'border-purple-500'}`}>
                <FaEnvelope className="text-purple-400 mr-3 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Coder Email"
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              
              <button
                onClick={handleStartRegistration}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Get Verification Code <FaChevronRight className="ml-2" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-400">
                Already a challenger?{' '}
                <span 
                  onClick={() => navigate('/login')}
                  className="text-purple-400 font-semibold hover:underline hover:text-purple-300 cursor-pointer"
                >
                  Log in here
                </span>
              </p>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep(1)}
                className="text-purple-400 hover:text-purple-300 mr-2 transition"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  Verify Your Email
                </h2>
                <p className="text-gray-400">Enter the 6-digit code sent to {formData.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${errors.otp ? 'border-red-500' : 'border-purple-500'}`}>
                <FaShieldAlt className="text-purple-400 mr-3 text-lg" />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Verification Code"
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                  maxLength={6}
                />
              </div>
              {errors.otp && <p className="text-red-400 text-sm">{errors.otp}</p>}
              
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Code <FaChevronRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setStep(2)}
                className="text-purple-400 hover:text-purple-300 mr-2 transition"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              <div className="text-center flex-1">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  Complete Your Profile
                </h2>
                <p className="text-gray-400">Finalize your coder identity</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${errors.username ? 'border-red-500' : 'border-purple-500'}`}>
                <FaUser className="text-purple-400 mr-3 text-lg" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Coder Name"
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                />
              </div>
              {errors.username && <p className="text-red-400 text-sm">{errors.username}</p>}
              
              <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${errors.password ? 'border-red-500' : 'border-purple-500'}`}>
                <FaLock className="text-purple-400 mr-3 text-lg" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Secret Code"
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              
              <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${errors.confirm_password ? 'border-red-500' : 'border-purple-500'}`}>
                <FaLock className="text-purple-400 mr-3 text-lg" />
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm Secret Code"
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500"
                />
              </div>
              {errors.confirm_password && <p className="text-red-400 text-sm">{errors.confirm_password}</p>}
              
              <button
                onClick={handleCompleteRegistration}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  <>
                    Begin Your Quest <FaChevronRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-[url('/bg3.jpg')] bg-cover bg-center min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-500/30">
        {successMessage ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500/30">
              <FaCheck className="text-green-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Quest Begins!
            </h2>
            <p className="text-gray-300">{successMessage}</p>
            <div className="pt-4">
              <div className="inline-flex h-1 w-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        )}
        
        {/* Progress indicators */}
        {!successMessage && (
          <div className="flex justify-center mt-8 space-x-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${step >= i ? 'bg-gradient-to-r from-purple-400 to-blue-400 scale-125' : 'bg-gray-600'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RegistrationFlow