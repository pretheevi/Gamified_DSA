import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaCamera, FaTrophy, FaStar, FaEdit, FaArrowLeft, FaSave, FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'CodeWarrior',
    email: 'codewarrior@dsaquest.com',
    xp: 1250,
    level: 3,
    achievements: 5,
    streak: 7
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    alert('You sure you want to logout?')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Development Notice */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm"
        >
          <div className="flex items-start">
            <FaInfoCircle className="text-yellow-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">Profile Under Development</h3>
              <p className="text-yellow-700 text-sm mt-1">
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
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-white">
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
              <h1 className="text-2xl font-bold">✨ Profile</h1>
            </div>
            <div className="flex flex-wrap items-center mt-3 text-base">
              <div className="flex items-center mr-4">
                <FaTrophy className="text-yellow-300 mr-2 text-lg" />
                <span>Level {user.level}</span>
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
              <div className="flex flex-col items-center lg:w-1/3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="relative w-28 h-28 bg-indigo-100 rounded-xl shadow-inner border-2 border-indigo-200 hover:border-indigo-300 cursor-pointer transition-all"
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-indigo-400 text-4xl" />
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
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-indigo-200"
                    onClick={triggerFileInput}
                  >
                    <FaCamera className="text-indigo-500 text-sm" />
                  </motion.div>
                </motion.div>

                <div className="w-full bg-indigo-50 rounded-full p-2 mt-4">
                  <div className="flex justify-between text-sm text-indigo-700 font-medium">
                    <span>{user.xp} XP</span>
                    <span>Level {user.level}</span>
                  </div>
                  <div className="h-2.5 bg-indigo-200 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                    />
                  </div>
                </div>

                <div className='w-full'>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-base"
                  >
                    <FaSignOutAlt className="text-base" />
                    Logout
                  </motion.button>
                </div>
              </div>

              {/* Right Column - Info & Achievements */}
              <div className="flex-1 space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-indigo-800 flex items-center">
                    <FaUser className="mr-3 text-base" />
                    Profile Details
                  </h2>

                  <div>
                    <label className="block text-sm text-indigo-600 mb-2 font-medium">Username</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="bg-white border border-indigo-200 rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
                      />
                      <button className="ml-3 text-indigo-600 hover:text-indigo-800 text-lg">
                        <FaEdit />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-indigo-600 mb-2 font-medium">Email</label>
                    <div className="bg-white border border-indigo-200 rounded-xl px-4 py-2.5 text-base">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4">
                  <h2 className="text-lg font-semibold text-indigo-800 flex items-center mb-3">
                    <FaStar className="text-yellow-400 mr-3 text-base" />
                    Your Achievements
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[...Array(user.achievements)].map((_, i) => (
                      <motion.div 
                        whileHover={{ y: -3 }}
                        key={i} 
                        className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex flex-col items-center"
                      >
                        <FaStar className="text-yellow-500 text-lg mb-1.5" />
                        <span className="text-sm font-medium">Completed</span>
                      </motion.div>
                    ))}
                    {[...Array(6 - user.achievements)].map((_, i) => (
                      <div key={i} className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex flex-col items-center opacity-50">
                        <FaStar className="text-gray-400 text-lg mb-1.5" />
                        <span className="text-sm font-medium">Locked</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-base"
                >
                  <FaSave className="text-base" />
                  Save Profile Changes
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;