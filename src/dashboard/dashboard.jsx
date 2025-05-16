import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaUser, FaCode, FaCheck, FaSpinner, FaClipboardList, FaFilter } from 'react-icons/fa';
import api from '../api/axios'; 
import { StatCard, ProblemRow, DSATimer } from '../components/dashboardUtility';
import { toast } from 'sonner';

/**
 * Main Dashboard component for DSA Quest application
 * Displays user statistics, problem list, and timer functionality
 */
function Dashboard() {
  const navigate = useNavigate();
  
  // State management
  const [problems, setProblems] = useState([]);
  const [originalProblems, setOriginalProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerError, setTimerError] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentProblemClicked, setCurrentProblemClicked] = useState({
    problemId: null,
    seconds: null,
    status: null 
  });
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    status: 'all', // Add this
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [statusSolved, setStatusSolved] = useState(null);

  // Derived stats using useMemo for performance optimization
  const { totalXP, solvedCount, inProgressCount, todoCount } = useMemo(() => ({
    totalXP: problems.reduce((sum, problem) => problem.status === 'Solved' ? sum + (problem.xp_value || 0) : sum, 0),
    solvedCount: problems.filter(p => p.status === 'Solved').length,
    inProgressCount: problems.filter(p => p.status === 'In Progress').length,
    todoCount: problems.filter(p => p.status === 'Not Started').length
  }), [problems]);

  /**
   * Fetches problems data from API
   */
  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/home/problems/');
      setProblems(response.data);
      setOriginalProblems(response.data);
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to load problems. Please try again later.');
      toast.error('Failed to load problems');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        clearInterval(interval);
        fetchProblems();
      }
    }, 200); // Check every 200ms

    return () => clearInterval(interval); // cleanup
  }, []);


  /**
   * Handles filter changes
   * @param {Object} event - The change event
   */
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  useEffect(() => {
    if (!originalProblems.length) return;

    let filtered = [...originalProblems];

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    // Filter by topic
    if (filters.topic !== 'all') {
      filtered = filtered.filter(p => p.topic === filters.topic);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    setProblems(filtered);
  }, [filters, originalProblems]);


  /**
   * Handles problem click - opens problem in new tab if timer is running
   * @param {string} url - Problem URL
   * @param {string} problemId - Problem ID
   * @param {string} status - Problem status
   */
  const handleProblemClick = (url, problemId, status) => {
    if (!running) {
      const errorMsg = '⏱️ Timer is not running. Please start the timer first.';
      setTimerError(true);
      toast.error(errorMsg);
      return;
    }
  
    // If a different problem is already clicked, block switching
    if (currentProblemClicked.problemId && problemId !== currentProblemClicked.problemId) {
      toast.error("⛔ Reset the timer before starting a new problem.");
      setTimerError(true);
      return;
    }
  
    // If this is the first problem being clicked
    if (!currentProblemClicked.problemId && !currentProblemClicked.status) {
      setTimerError(false);
      setCurrentProblemClicked({
        problemId,
        seconds: Date.now(),
        status,
      });
  
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * Sends time spent on problem to the server
   */
  const sendTimeData = async () => {
    if (!currentProblemClicked.problemId) return;

    const { problemId, seconds, status } = currentProblemClicked;
    const timeSpent = Math.floor((Date.now() - seconds) / 1000);
    console.log(problemId, seconds, status);
    try {
      const response = await api.post(`/home/updateTime/${problemId}`, { 
        time: timeSpent,
        status: status
      });
      toast.success('Time recorded successfully!');
      console.log(response)
      fetchProblems(); // Refresh problem data
    } catch (error) {
      console.error("Error recording time:", error);
      toast.error('Failed to record time');
    } finally {
      setCurrentProblemClicked({
        problemId: null,
        seconds: null,
        status: null,
      });
    }
  };

  // Handle beforeunload event to save time data
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (running && currentProblemClicked.problemId) {
        e.preventDefault();
        await sendTimeData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [running, currentProblemClicked]);


  const handleMarkAsSolved = async (problem) => {
    try {
      const response = await api.post(`/home/updateStatus/${problem.id}`, {
        status: "Solved"
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
      if (statusSolved === null) return;

      if (statusSolved.status === "Not Started") {
        toast.error("Can't mark it as solved without starting.");
      } else if (statusSolved.status === "In Progress") {
        toast(
          <div>
            Are you sure you want to mark it as solved?
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={async () => {
                  const ok = await handleMarkAsSolved(statusSolved);
                  if (ok) {
                      toast.success("Marked as solved");
                      fetchProblems();
                  } 
                  else toast.error("Something went wrong");
                }}
                className="text-green-600 hover:underline text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => toast.dismiss()}
                className="text-gray-600 hover:underline text-sm"
              >
                Cancel
              </button>
            </div>
          </div>,
          {
            duration: 6000,
          }
        );
      } else if (statusSolved.status === "Solved") {
        toast("Already Solved.");
      } else {
        console.warn(`Unexpected statusSolved value: ${statusSolved.status}`);
      }

      setStatusSolved(null);
    }, [statusSolved]);




  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <div className="text-2xl text-indigo-800 animate-pulse">
            Loading your DSA quest...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-red-500 text-xl p-6 bg-white rounded-lg shadow-md max-w-md text-center">
          <p><strong>Error:</strong> {error}</p>
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Login again
            </button>
            <button 
              onClick={fetchProblems}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Timer Section */}
        <div className="mb-8">
          <DSATimer 
            running={running}
            setRunning={setRunning}
            sendTimeData={sendTimeData}
            currentProblemClicked={currentProblemClicked}
          />
        </div>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">DSA Quest</h1>
            <p className="text-indigo-600">Your journey to mastering Data Structures & Algorithms</p>
          </div>
          <div 
            onClick={() => navigate('/Profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="text-indigo-700 font-medium group-hover:text-indigo-900 transition">
              View Profile
            </span>
            <div className="relative w-12 h-12 bg-indigo-100 rounded-lg shadow-md overflow-hidden border-2 border-indigo-300 hover:border-indigo-400 transition">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-indigo-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary Card */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg mb-8 border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center justify-center sm:justify-start">
                <FaCode className="mr-2 text-indigo-600" />
                Total Problems: {problems.length}
              </h2>
              <p className="text-indigo-600 font-medium">
                {solvedCount > 10 ? "You're crushing it! 🚀" : "Keep up the great work! 💪"}
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center bg-white px-6 py-3 rounded-full shadow-md border-2 border-yellow-300">
                <FaTrophy className="text-yellow-500 text-xl mr-3" />
                <span className="font-bold text-lg text-gray-800">{totalXP} XP</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                LEVEL {Math.floor(totalXP/1000) + 1}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            value={solvedCount}
            label="Solved"
            icon={<FaCheck className="text-green-500" />}
            bgColor="bg-green-50"
            borderColor="border-green-300"
            hoverEffect="hover:shadow-green-100"
            valueColor="text-green-600"
          />
          <StatCard 
            value={inProgressCount}
            label="In Progress"
            icon={<FaSpinner className="text-yellow-500 animate-spin" />}
            bgColor="bg-yellow-50"
            borderColor="border-yellow-200"
            hoverEffect="hover:shadow-yellow-100"
            valueColor="text-yellow-600"
          />
          <StatCard 
            value={todoCount}
            label="To Do"
            icon={<FaClipboardList className="text-indigo-500" />}
            bgColor="bg-indigo-50"
            borderColor="border-indigo-200"
            hoverEffect="hover:shadow-indigo-100"
            valueColor="text-indigo-600"
          />
        </section>

        {/* Sorting Section */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <FaFilter className="text-indigo-600" />
            Filter Problems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                value={filters.topic}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Topics</option>
                <option value="Array">Array</option>
                <option value="String">String</option>
                <option value="Linked List">Linked List</option>
                <option value="Tree">Tree</option>
                <option value="Graph">Graph</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Solved">Solved</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
              </select>
            </div>
          </div>
        </section>


        {/* Problems Table */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-indigo-600 text-white p-4 font-medium">
            <div className="col-span-6 md:col-span-5">Problem</div>
            <div className="col-span-4 hidden md:block">Topic</div>
            <div className="col-span-3 md:col-span-2">Difficulty</div>
            <div className="col-span-3 md:col-span-1 text-center">Status</div>
          </div>

          {/* Problems List */}
          <div className="divide-y divide-gray-200">
            {problems.length > 0 ? (
              problems.map((problem, index) => (
                <ProblemRow 
                  key={problem.id}
                  problem={problem}
                  onClick={handleProblemClick}
                  index={index}
                  setStatusSolved={setStatusSolved}
                  isActive={currentProblemClicked.problemId === problem.id}
                  timerRunning={running}
                />
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No problems match your filters. Try adjusting your criteria.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;