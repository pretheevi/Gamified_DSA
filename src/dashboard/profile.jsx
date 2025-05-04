import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { FaUser, FaCamera, FaTrophy, FaStar, FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-3">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 sm:p-3 text-white">
            <div className="flex items-center gap-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/dashboard")} 
                className="text-white hover:text-yellow-200 transition"
                title="Back to Dashboard"
              >
                <FaArrowLeft className="text-sm" />
              </motion.button>
              <h1 className="text-sm font-bold">✨ Profile</h1>
            </div>
            <div className="flex flex-wrap items-center mt-1 text-xs">
              <div className="flex items-center mr-2">
                <FaTrophy className="text-yellow-300 mr-1" />
                <span>Lvl {user.level}</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-300 mr-1">🔥</span>
                <span>{user.streak}d</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-2 sm:p-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Left Column - Avatar & XP */}
              <div className="flex flex-col items-center md:w-1/3">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="relative w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-lg shadow-inner border-2 border-indigo-200 hover:border-indigo-300 cursor-pointer transition-all"
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaUser className="text-indigo-400 text-2xl sm:text-3xl" />
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
                    className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-xs border border-indigo-200"
                    onClick={triggerFileInput}
                  >
                    <FaCamera className="text-indigo-500 text-[8px]" />
                  </motion.div>
                </motion.div>

                <div className="w-full bg-indigo-50 rounded-full p-1 mt-2">
                  <div className="flex justify-between text-[9px] text-indigo-700">
                    <span>{user.xp} XP</span>
                    <span>Lvl {user.level}</span>
                  </div>
                  <div className="h-1.5 bg-indigo-200 rounded-full overflow-hidden mt-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (user.xp % 1000) / 10)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Info & Achievements */}
              <div className="flex-1 space-y-2">
                <div className="bg-indigo-50 rounded-lg p-2 space-y-2">
                  <h2 className="text-xs font-semibold text-indigo-800 flex items-center">
                    <FaUser className="mr-1 text-[10px]" />
                    Details
                  </h2>

                  <div>
                    <label className="block text-[9px] text-indigo-600">Username</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="bg-white border border-indigo-200 rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-300 text-xs"
                      />
                      <button className="ml-1 text-indigo-600 hover:text-indigo-800 text-xs">
                        <FaEdit />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-indigo-600">Email</label>
                    <div className="bg-white border border-indigo-200 rounded-md px-2 py-1 text-xs">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-2">
                  <h2 className="text-xs font-semibold text-indigo-800 flex items-center mb-1">
                    <FaStar className="text-yellow-400 mr-1 text-[10px]" />
                    Achievements
                  </h2>
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(user.achievements)].map((_, i) => (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        key={i} 
                        className="bg-yellow-100 border border-yellow-300 rounded-sm p-1 flex flex-col items-center"
                      >
                        <FaStar className="text-yellow-500 text-xs mb-0.5" />
                        <span className="text-[8px] font-medium">Done</span>
                      </motion.div>
                    ))}
                    {[...Array(6 - user.achievements)].map((_, i) => (
                      <div key={i} className="bg-gray-100 border border-gray-200 rounded-sm p-1 flex flex-col items-center opacity-50">
                        <FaStar className="text-gray-400 text-xs mb-0.5" />
                        <span className="text-[8px] font-medium">Locked</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-1.5 rounded-md shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1 text-xs"
                >
                  <FaSave className="text-xs" />
                  Save
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