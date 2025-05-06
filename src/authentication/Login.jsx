import React from 'react'
import { FaCode, FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const InputField = ({ icon, type, name, value, onChange, placeholder, error }) => (
  <div className="mb-3">
    <div className={`bg-indigo-50 rounded-lg p-3 flex items-center border ${error ? 'border-red-500' : 'border-transparent'}`}>
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none text-gray-700 focus:outline-none placeholder-gray-400"
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
  </div>
);

function Login({ formData, handleChange, handleSubmit, errors, apiError, loading }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 flex items-center justify-center gap-2">
            <FaCode className="text-indigo-600 text-3xl md:text-4xl" /> DSA Quest
          </h1>
          <p className="text-base md:text-lg mt-2 text-indigo-600 font-medium">
            Continue your journey, warrior!
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 lg:w-1/3 bg-white p-6 md:p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-6 md:mb-8">Sign in to continue your quest</p>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <InputField
              icon={<FaEnvelope className="text-indigo-500 mr-3 text-lg" />}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              error={errors.email}
            />
            <InputField
              icon={<FaLock className="text-indigo-500 mr-3 text-lg" />}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              error={errors.password}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              )}
              {loading ? "Processing" : "Login"}
            </button>

          </form>
          
          <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account?{' '}
                <span 
                  onClick={() => navigate('/register')}
                  className="text-indigo-600 font-semibold hover:underline hover:text-indigo-800 cursor-pointer"
                >
                  Sign Up
                </span>
          </p>
        </motion.div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <p className="text-sm">{apiError}</p>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default Login;