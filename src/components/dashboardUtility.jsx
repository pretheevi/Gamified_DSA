import { FaLock, FaFire, FaCheckCircle } from 'react-icons/fa';

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy': return 'bg-green-100 text-green-800';
    case 'Medium': return 'bg-yellow-100 text-yellow-800';
    case 'Hard': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};




export const getStatusIcon = (status) => {
  switch (status) {
    case 'Solved': return <FaCheckCircle className="text-green-500" />;
    case 'In Progress': return <FaFire className="text-orange-500" />;
    default: return <FaLock className="text-gray-400" />;
  }
};




import { motion } from 'framer-motion';

// Enhanced StatCard component
export const StatCard = ({ 
  value = 0, // Default value to prevent undefined errors
  label, 
  icon, 
  bgColor = 'bg-white', 
  borderColor = '', 
  hoverEffect = '', 
  valueColor = 'text-gray-800'
}) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className={`p-5 rounded-xl border-2 ${borderColor} ${bgColor} shadow-sm flex flex-col items-center transition-all duration-300 ${hoverEffect} hover:border-opacity-80`}
  >
    {icon && <div className="text-3xl mb-3">{icon}</div>}
    <div className={`text-4xl font-bold mb-2 ${valueColor}`}>{value}</div>
    <div className="text-lg font-medium text-gray-600">{label}</div>
    <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (Number(value) / 20) * 100)}%` }}
        transition={{ duration: 1, delay: 0.3 }}
        className={`h-full ${borderColor.replace('border', 'bg')}`}
      />
    </div>
  </motion.div>
);




/**
 * ProblemRow component for displaying a single problem in the table
 * @param {object} props - Component props
 * @param {object} props.problem - The problem object
 * @param {number} props.index - The index of the problem in the list
 * @param {function} props.onClick - Click handler for the problem
 */
export const ProblemRow = ({ problem, index, onClick, setStatusSolved }) => (
  <div
    className={`grid grid-cols-12 items-center p-4 border-b border-gray-100 hover:bg-indigo-50 transition-colors ${
      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
    }`}
  >
    <div 
      className="col-span-6 md:col-span-5 font-medium text-indigo-700 hover:underline truncate cursor-pointer select-none"
      onClick={() => onClick(problem.url, problem.id, problem.status)}
      title={problem.title}
    >
      {problem.title}
    </div>
    <div className="col-span-4 hidden md:block text-gray-600 truncate select-none" title={problem.topic}>
      {problem.topic}
    </div>
    <div className="col-span-3 md:col-span-2">
      <span className={`px-3 py-1 rounded-full text-xs font-semibold select-none ${
        getDifficultyColor(problem.difficulty)
      }`}>
        {problem.difficulty}
      </span>
    </div>
    <div
        onClick={(e) => {
          e.stopPropagation();
          setStatusSolved(problem);
        }} 
      className="col-span-3 md:col-span-1 flex justify-center cursor-pointer select-none">
      {getStatusIcon(problem.status)}
    </div>
  </div>
);






import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
export const DSATimer = ({ 
  running, 
  setRunning, 
  sendTimeData,
  currentProblemClicked
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = () => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleReset = () => {
    if (currentProblemClicked["problemId"] && currentProblemClicked["seconds"]) {
      console.log("timer Reset")
      setRunning(false);
      setSeconds(0);
      sendTimeData();
      return
    }
    setRunning(false);
    setSeconds(0);
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-indigo-600 text-white rounded-full px-4 py-2 shadow-lg z-50 flex items-center space-x-3 transition-all duration-200 ${isHovering ? 'scale-[1.03] shadow-xl' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className='font-mono text-lg font-medium'>{formatTime()}</span>
      <div className='flex space-x-2'>
        <button
          onClick={() => setRunning(prev => !prev)}
          className={`p-2 rounded-full transition-all duration-300 ${!running ? 'bg-yellow-400/20' : 'hover:bg-yellow-400/30'} hover:scale-110 cursor-pointer`}
          aria-label="Pause"
        >
          {running ? <FaPause className="text-yellow-300 hover:text-yellow-200" /> : <FaPlay className="text-yellow-300 hover:text-yellow-200" />}
        </button>
        
        <button
          onClick={handleReset}
          className="p-2 rounded-full transition-all duration-300 hover:bg-red-400/30 hover:scale-110 cursor-pointer"
          aria-label="Reset"
        >
          <FaRedo className="text-red-300 hover:text-red-200" />
        </button>
      </div>
    </div>
  );
};