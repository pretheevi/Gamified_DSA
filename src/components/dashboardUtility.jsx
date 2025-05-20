import { FaLock, FaFire, FaCheckCircle, FaPlay, FaPause, FaRedo } from 'react-icons/fa'
import { motion } from 'framer-motion'

// Difficulty and Status Utilities
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-900/30 text-green-400 border-green-500/30'
    case 'Medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30'
    case 'Hard': return 'bg-red-900/30 text-red-400 border-red-500/30'
    default: return 'bg-gray-800 text-gray-400 border-gray-700'
  }
}

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Solved': return <FaCheckCircle className="text-green-400 text-lg" />
    case 'In Progress': return <FaFire className="text-yellow-400 text-lg animate-pulse" />
    default: return <FaLock className="text-gray-500 text-lg" />
  }
}

// Enhanced StatCard component with gamified elements
export const StatCard = ({ 
  value = 0,
  label, 
  icon, 
  bgColor = 'bg-gray-800', 
  borderColor = 'border-gray-700', 
  hoverEffect = 'hover:border-purple-500/50', 
  valueColor = 'text-white'
}) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className={`p-5 rounded-xl border-2 ${borderColor} ${bgColor} shadow-lg flex flex-col items-center transition-all duration-300 ${hoverEffect} relative overflow-hidden`}
  >
    {/* Glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {icon && <div className="text-3xl mb-3">{icon}</div>}
    <div className={`text-4xl font-bold mb-2 ${valueColor}`}>{value}</div>
    <div className="text-lg font-medium text-gray-400">{label}</div>
    <div className="w-full bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (Number(value) / 20) * 100)}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className={`h-full ${borderColor.replace('border', 'bg').replace('-500/30', '-400')}`}
      />
    </div>
  </motion.div>
)

// ProblemRow component with gamified styling
export const ProblemRow = ({ problem, index, onClick, setStatusSolved, isActive, timerRunning }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className={`grid grid-cols-12 items-center p-4 border-b border-gray-700 transition-colors ${
      isActive ? 'bg-purple-900/20' : index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'
    } ${timerRunning ? 'hover:bg-purple-900/30' : 'hover:bg-gray-700'}`}
    whileHover={{ scale: 1.005 }}
  >
    <div 
      className="col-span-6 md:col-span-5 font-medium text-purple-300 hover:text-white truncate cursor-pointer select-none flex items-center gap-2"
      onClick={() => onClick(problem.url, problem.id, problem.status)}
      title={problem.title}
    >
      {problem.xp_value && (
        <span className="bg-yellow-900/30 text-yellow-400 text-xs px-2 py-1 rounded-full">
          +{problem.xp_value}XP
        </span>
      )}
      <span className="truncate">{problem.title}</span>
    </div>
    <div className="col-span-4 hidden md:block text-gray-400 truncate select-none" title={problem.topic}>
      {problem.topic}
    </div>
    <div className="col-span-3 md:col-span-2">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border select-none ${
        getDifficultyColor(problem.difficulty)
      }`}>
        {problem.difficulty}
      </span>
    </div>
    <div
      onClick={(e) => {
        e.stopPropagation()
        setStatusSolved(problem)
      }} 
      className="col-span-3 md:col-span-1 flex justify-center cursor-pointer select-none hover:scale-110 transition-transform"
    >
      {getStatusIcon(problem.status)}
    </div>
  </motion.div>
)

import { useState, useEffect } from "react";
// Gamified Timer Component
export const DSATimer = ({ 
  running, 
  setRunning, 
  sendTimeData,
  currentProblemClicked
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    let interval
    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [running])

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0")
    const secs = String(seconds % 60).padStart(2, "0")
    return `${mins}:${secs}`
  }

  const handleReset = () => {
    if (currentProblemClicked["problemId"] && currentProblemClicked["seconds"]) {
      setRunning(false)
      setSeconds(0)
      sendTimeData()
      return
    }
    setRunning(false)
    setSeconds(0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 bg-gradient-to-r from-purple-600/90 to-blue-600/90 text-white rounded-full px-5 py-3 shadow-lg z-50 flex items-center space-x-4 backdrop-blur-sm border border-purple-400/30 ${running ? 'glow-effect' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
    >
      <span className='font-mono text-lg font-medium tracking-wider'>
        {formatTime()}
      </span>
      <div className='flex space-x-3'>
        <motion.button
          onClick={() => setRunning(prev => !prev)}
          className={`p-2 rounded-full transition-all ${running ? 'bg-yellow-400/20 hover:bg-yellow-400/30' : 'bg-green-400/20 hover:bg-green-400/30'} flex items-center justify-center`}
          whileTap={{ scale: 0.9 }}
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? (
            <FaPause className="text-yellow-300 text-sm" />
          ) : (
            <FaPlay className="text-green-300 text-sm pl-0.5" />
          )}
        </motion.button>
        
        <motion.button
          onClick={handleReset}
          className="p-2 rounded-full bg-red-400/20 hover:bg-red-400/30 flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
          aria-label="Reset"
        >
          <FaRedo className="text-red-300 text-sm" />
        </motion.button>
      </div>

      {/* XP indicator when active */}
      {currentProblemClicked.problemId && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-full shadow"
        >
          +XP
        </motion.div>
      )}
    </motion.div>
  )
}

// CSS for glow effect (add to your global CSS)
// .glow-effect {
//   box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
//   animation: pulse 2s infinite;
// }
// @keyframes pulse {
//   0% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.5); }
//   50% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.8); }
//   100% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.5); }
// }