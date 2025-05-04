import { useEffect, useState, useMemo, useRef, } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaUser, FaCode, FaCheckCircle, FaSpinner, FaClipboardList, FaCheck } from 'react-icons/fa';
import api from '../api/axios'; 
import { StatCard, ProblemRow, DSATimer } from '../components/dashboardUtility';


/**
 * Main App component for DSA Quest dashboard
 * Displays a list of coding problems with stats and progress tracking
 */
function Dashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Calculate derived stats using useMemo
  const { totalXP, solvedCount, inProgressCount, todoCount } = useMemo(() => ({
    totalXP: problems.reduce((sum, problem) => problem.status === 'Completed' ? sum + (problem.xp_value || 0) : sum, 0),
    solvedCount: problems.filter(p => p.status === 'Completed').length,
    inProgressCount: problems.filter(p => p.status === 'In Progress').length,
    todoCount: problems.filter(p => p.status === 'Not Started').length
  }), [problems]);

  /**
   * Fetches problems data from the API
   */
  const fetchProblems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/home/problems');
      console.log('Fetched problems:', response.data);
      const data = response.data
      setProblems(data);
      setOriginalProblems(data);
    } catch (err) {
      console.log('Error fetching problems:', err);
      setError('Failed to load problems. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch problems on component mount
  useEffect(() => {
    fetchProblems();
  }, []);


  const sortedProblems = () => {
    let sorted_object = { 'Easy': [], 'Medium': [], 'Hard': [] };
    problems.forEach((problem) => {
      const difficulty = problem.difficulty;
      if (sorted_object[difficulty]) {
        sorted_object[difficulty].push(problem);
      }
    });
    return sorted_object;
  };
  

  const [difficultySort, setDifficultySort] = useState("all");
  const [originalProblems , setOriginalProblems] = useState([]);

  const handleDifficultyChange = (event) => {
    const value = event.target.value;
    if (value === difficultySort) return; // No change in selection
    setDifficultySort(value);
  }
  
  useEffect(() => {
    if (!difficultySort || difficultySort === "all") {
      setProblems(originalProblems); // Reset to default if needed
      return;
    }
  
    const sorted_object = sortedProblems(); // should return an object with keys: easy, medium, hard
    console.log("Sorted object:", sorted_object);
    let new_sorted_array = [];
  
    if (difficultySort === "Easy") {
      new_sorted_array = [...sorted_object['Easy'], ...sorted_object['Medium'], ...sorted_object['Hard']];
    } else if (difficultySort === "Medium") {
      new_sorted_array = [...sorted_object['Medium'], ...sorted_object['Easy'], ...sorted_object['Hard']];
    } else if (difficultySort === "Hard") {
      new_sorted_array = [...sorted_object['Hard'], ...sorted_object['Easy'], ...sorted_object['Medium']];
    }
    setProblems(new_sorted_array);
  }, [difficultySort]);
  

  /**
   * Handles clicking on a problem to open it in a new tab
   * @param {string} url - The URL of the problem to open
   */
  const handleProblemClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const [previewImage, setPreviewImage] = useState(null);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse text-2xl text-indigo-800">Loading your DSA quest...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-red-500 text-xl p-6 bg-white rounded-lg shadow-md max-w-md text-center">
          <p><strong>Error:</strong> {error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Login again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      {/* Timer */}
      <div>
        <DSATimer />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-indigo-800">DSA Quest</h1>
          <div className="profile">
            <div 
              onClick={() => navigate('/Profile')}
              className="relative w-16 h-16 bg-indigo-100 rounded-lg shadow-md overflow-hidden border-4 border-indigo-300 hover:bg-indigo-200 cursor-pointer"
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-indigo-400 text-4xl" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary Card - Enhanced */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-lg mb-8 border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center justify-center sm:justify-start">
                <FaCode className="mr-2 text-indigo-600" />
                Total Problems: {problems.length}
              </h2>
              <p className="text-indigo-600 font-medium">
                {problems.length > 10 ? "You're crushing it!" : "Keep up the great work!"}
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

        {/* Stats Grid - Enhanced */}
        
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard 
          value={solvedCount}
          label="Solved"
          icon={<FaCheck className="text-green-500" />}
          bgColor="bg-green-50"
          borderColor="border-green-300"
          hoverEffect="hover:shadow-green-300"
          valueColor="text-green-600"
        />
        <StatCard 
          value={inProgressCount}
          label="In Progress"
          icon={<FaSpinner className="text-yellow-500 animate-spin" />}
          bgColor="bg-yellow-50"
          borderColor="border-yellow-200"
          hoverEffect="hover:shadow-yellow-100"
        />
        <StatCard 
          value={todoCount}
          label="To Do"
          icon={<FaClipboardList className="text-indigo-500" />}
          bgColor="bg-indigo-50"
          borderColor="border-indigo-200"
          hoverEffect="hover:shadow-indigo-100"
        />
      </section>

        {/* Sorting Section */}
        <section>
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Sort Problems</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <select
                  id="difficulty"
                  name="difficulty"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onChange={(e) => handleDifficultyChange(e)} // handle change
                >
                  <option value="">All</option>
                  <option value="Easy">Easy First</option>
                  <option value="Medium">Medium First</option>
                  <option value="Hard">Hard First</option>
                </select>
              </div>
            </div>
        </section>

        {/* Problems Table */}
        <section className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-indigo-600 text-white p-4 font-medium">
            <div className="col-span-6 md:col-span-5">Problem</div>
            <div className="col-span-4 hidden md:block">Topic</div>
            <div className="col-span-3 md:col-span-2">Difficulty</div>
            <div className="col-span-3 md:col-span-1 text-center">Status</div>
          </div>

          {/* Problems List */}
          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <ProblemRow 
                key={problem.id || index}
                problem={problem}
                index={index}
                onClick={handleProblemClick}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No problems found. Add some to get started!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


export default Dashboard;