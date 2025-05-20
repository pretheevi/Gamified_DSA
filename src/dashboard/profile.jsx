import { useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { FaUser, FaCamera, FaTrophy, FaStar, FaEdit, FaArrowLeft, FaSave, FaSignOutAlt, FaInfoCircle, FaShieldAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: 'CodeWarrior',
    email: 'codewarrior@dsaquest.com',
    xp: 1250,
    level: 3,
    achievements: 5,
    streak: 7,
    rank: 'Silver'
  })
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleLogout = () => {
    toast(
      <div className="bg-gray-800 text-white p-4 rounded-lg border border-purple-500">
        <h3 className="font-medium text-lg mb-2">Logout Confirmation</h3>
        <p className="text-gray-300 mb-4">Are you sure you want to end your coding session?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss()
              navigate('/login')
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Development Notice */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg"
        >
          <div className="flex items-start">
            <FaInfoCircle className="text-yellow-400 text-xl mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-300">Profile Under Development</h3>
              <p className="text-yellow-200 text-sm mt-1">
                This profile page is still in development. The data shown is static and for demonstration purposes only. 
                We'll be adding real user data and functionality soon!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-purple-500/30"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/90 to-blue-600/90 p-5 text-white">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/dashboard")} 
                className="text-white hover:text-yellow-200 transition"
                title="Back to Dashboard"
              >
                <FaArrowLeft className="text-xl" />
              </motion.button>
              <h1 className="text-2xl font-bold">✨ Coder Profile</h1>
            </div>
            <div className="flex flex-wrap items-center mt-3 text-base gap-4">
              <div className="flex items-center">
                <FaTrophy className="text-yellow-300 mr-2 text-lg" />
                <span>Level {user.level} {user.rank}</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-300 mr-2 text-lg">🔥</span>
                <span>{user.streak} day streak</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Avatar & XP */}
              <div className="flex flex-col items-center lg:w-1/3 space-y-6">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="relative w-32 h-32 bg-gray-700 rounded-xl shadow-inner border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer transition-all"
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-purple-400 text-5xl" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-2 shadow-sm border border-purple-500/50"
                    onClick={triggerFileInput}
                  >
                    <FaCamera className="text-purple-400 text-sm" />
                  </motion.div>
                </motion.div>

                <div className="w-full bg-gray-700 rounded-xl p-4 border border-purple-500/30">
                  <div className="flex justify-between text-sm text-purple-300 font-medium">
                    <span>{user.xp} XP</span>
                    <span>Level {user.level}</span>
                  </div>
                  <div className="h-2.5 bg-gray-600 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-blue-400"
                    />
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    {1000 - (user.xp % 1000)} XP needed for next level
                  </div>
                </div>

                <div className='w-full space-y-4'>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-purple-600/90 to-blue-600/90 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-3 text-base border border-purple-500/30"
                  >
                    <FaSignOutAlt className="text-base" />
                    End Coding Session
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-gray-500/30 transition-all flex items-center justify-center gap-3 text-base border border-gray-600"
                  >
                    <FaSave className="text-base" />
                    Save Profile
                  </motion.button>
                </div>
              </div>

              {/* Right Column - Info & Achievements */}
              <div className="flex-1 space-y-6">
                <div className="bg-gray-700/50 rounded-xl p-5 space-y-5 border border-purple-500/30">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <FaUser className="mr-3 text-base text-purple-400" />
                    Coder Details
                  </h2>

                  <div>
                    <label className="block text-sm text-purple-300 mb-2 font-medium">Coder Name</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500"
                      />
                      <button className="ml-3 text-purple-400 hover:text-purple-300 text-lg">
                        <FaEdit />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-purple-300 mb-2 font-medium">Email</label>
                    <div className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-5 border border-purple-500/30">
                  <h2 className="text-lg font-semibold text-white flex items-center mb-4">
                    <FaStar className="text-yellow-400 mr-3 text-base" />
                    Coder Achievements
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[...Array(user.achievements)].map((_, i) => (
                      <motion.div 
                        whileHover={{ y: -3 }}
                        key={i} 
                        className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 flex flex-col items-center"
                      >
                        <FaStar className="text-yellow-400 text-lg mb-1.5" />
                        <span className="text-sm font-medium text-yellow-200">Unlocked</span>
                      </motion.div>
                    ))}
                    {[...Array(6 - user.achievements)].map((_, i) => (
                      <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex flex-col items-center opacity-60">
                        <FaShieldAlt className="text-gray-500 text-lg mb-1.5" />
                        <span className="text-sm font-medium text-gray-400">Locked</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-5 border border-purple-500/30">
                  <h2 className="text-lg font-semibold text-white flex items-center mb-4">
                    <FaTrophy className="text-yellow-400 mr-3 text-base" />
                    Current Rank: {user.rank}
                  </h2>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Complete more challenges to reach Gold rank
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage