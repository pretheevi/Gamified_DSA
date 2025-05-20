import React from 'react'
import { FaCode, FaEnvelope, FaLock, FaTrophy, FaMedal } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const InputField = ({ icon, type, name, value, onChange, placeholder, error }) => (
  <div className="mb-4">
    <div className={`bg-gray-800 rounded-lg p-3 flex items-center border-2 ${error ? 'border-red-500' : 'border-purple-500'}`}>
      {icon}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-400"
      />
    </div>
    {error && <p className="text-red-400 text-xs mt-1 ml-1">{error}</p>}
  </div>
)

function Login({ formData, handleChange, handleSubmit, errors, apiError, loading }) {
  const navigate = useNavigate()
  
  return (
    <div className="bg-[url('/bg2.jpg')] bg-cover bg-center min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          GAMIFIED DSA
        </h1>
        <p className="text-gray-300">Level up your coding skills</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-2/3 lg:w-1/3 p-6 md:p-8 rounded-2xl bg-gray-800/90 backdrop-blur-sm border-2 border-purple-500 shadow-lg shadow-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
            <FaMedal className="text-yellow-400 mr-2" />
            <span className="text-white font-medium">XP: 0</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <InputField
            icon={<FaEnvelope className="text-purple-400 mr-3 text-lg" />}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Coder Email"
            error={errors.email}
          />
          <InputField
            icon={<FaLock className="text-purple-400 mr-3 text-lg" />}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Secret Code"
            error={errors.password}
          />
          
          <div className="w-full flex flex-row justify-center">
            <button
              type="submit"
              className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group"
              disabled={loading}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              {loading ? (
                <>
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
                  <span className="relative">Compiling...</span>
                </>
              ) : (
                <>
                  <FaCode className="relative" />
                  <span className="relative">Start Coding</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400">
            New challenger?{' '}
            <span 
              onClick={() => navigate('/register')}
              className="text-purple-400 font-semibold hover:underline hover:text-purple-300 cursor-pointer"
            >
              Join the Arena
            </span>
          </p>
        </div>
      </motion.div>

      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900/80 border border-red-700 text-red-100 px-4 py-3 rounded backdrop-blur-sm"
          role="alert"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm">{apiError}</p>
          </div>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center text-gray-400 text-sm">
        <FaTrophy className="mr-2 text-yellow-400" />
        <span>Top Coders: 1,024</span>
      </div>
    </div>
  )
}

export default Login