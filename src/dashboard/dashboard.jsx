import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrophy, FaUser, FaCode, FaCheck, FaSpinner, FaClipboardList, FaFilter, FaMedal, FaFire } from 'react-icons/fa'
import api from '../api/axios'
import { StatCard, ProblemRow, DSATimer } from '../components/dashboardUtility'
import { toast } from 'sonner'

function Dashboard() {
  const navigate = useNavigate()
  
  // State management
  const [problems, setProblems] = useState([])
  const [originalProblems, setOriginalProblems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timerError, setTimerError] = useState(false)
  const [running, setRunning] = useState(false)
  const [currentProblemClicked, setCurrentProblemClicked] = useState({
    problemId: null,
    seconds: null,
    status: null 
  })
  const [filters, setFilters] = useState({
    difficulty: 'all',
    topic: 'all',
    status: 'all',
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [statusSolved, setStatusSolved] = useState(null)

  // Derived stats using useMemo for performance optimization
  const { totalXP, solvedCount, inProgressCount, todoCount } = useMemo(() => ({
    totalXP: problems.reduce((sum, problem) => problem.status === 'Solved' ? sum + (problem.xp_value || 0) : sum, 0),
    solvedCount: problems.filter(p => p.status === 'Solved').length,
    inProgressCount: problems.filter(p => p.status === 'In Progress').length,
    todoCount: problems.filter(p => p.status === 'Not Started').length
  }), [problems])

  const fetchProblems = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/home/problems/')
      setProblems(response.data)
      setOriginalProblems(response.data)
    } catch (err) {
      console.error('Error fetching problems:', err)
      setError('Failed to load problems. Please try again later.')
      toast.error('Failed to load problems')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token")
      if (token) {
        clearInterval(interval)
        fetchProblems()
      }
    }, 200)

    return () => clearInterval(interval)
  }, [])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }
  
  useEffect(() => {
    if (!originalProblems.length) return

    let filtered = [...originalProblems]

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty)
    }

    if (filters.topic !== 'all') {
      filtered = filtered.filter(p => p.topic === filters.topic)
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status)
    }

    setProblems(filtered)
  }, [filters, originalProblems])

  const handleProblemClick = (url, problemId, status) => {
    if (!running) {
      const errorMsg = '⏱️ Timer is not running. Please start the timer first.'
      setTimerError(true)
      toast.error(errorMsg)
      return
    }
  
    if (currentProblemClicked.problemId && problemId !== currentProblemClicked.problemId) {
      toast.error("⛔ Reset the timer before starting a new problem.")
      setTimerError(true)
      return
    }
  
    if (!currentProblemClicked.problemId && !currentProblemClicked.status) {
      setTimerError(false)
      setCurrentProblemClicked({
        problemId,
        seconds: Date.now(),
        status,
      })
  
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const sendTimeData = async () => {
    if (!currentProblemClicked.problemId) return

    const { problemId, seconds, status } = currentProblemClicked
    const timeSpent = Math.floor((Date.now() - seconds) / 1000)
    
    try {
      await api.post(`/home/updateTime/${problemId}`, { 
        time: timeSpent,
        status: status
      })
      toast.success('XP earned! Time recorded successfully!')
      fetchProblems()
    } catch (error) {
      console.error("Error recording time:", error)
      toast.error('Failed to record time')
    } finally {
      setCurrentProblemClicked({
        problemId: null,
        seconds: null,
        status: null,
      })
    }
  }

  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (running && currentProblemClicked.problemId) {
        e.preventDefault()
        await sendTimeData()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [running, currentProblemClicked])

  const handleMarkAsSolved = async (problem) => {
    try {
      const response = await api.post(`/home/updateStatus/${problem.id}`, {
        status: "Solved"
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const [problemConquered, setProblemConquered] = useState(false);
  useEffect(() => {
    if (statusSolved === null) return

    if (statusSolved.status === "Not Started") {
      toast.error("Can't mark it as solved without starting.")
    } else if (statusSolved.status === "In Progress") {
      toast(
        <div className="bg-gray-800 text-white p-4 rounded-lg border border-purple-500">
          Are you sure you want to mark it as solved?
          <div className="mt-3 flex justify-end gap-3">
            <button
              onClick={async () => {
                const ok = await handleMarkAsSolved(statusSolved)
                if (ok) {
                    setProblemConquered(prev => !prev);
                    fetchProblems()
                    toast.dismiss()
                } 
                else toast.error("Something went wrong")
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-md text-sm transition"
            >
              Confirm
            </button>
            <button
              onClick={() => toast.dismiss()}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          duration: 6000,
        }
      )
    } else if (statusSolved.status === "Solved") {
      toast("Already Solved.")
    }

    setStatusSolved(null)
  }, [statusSolved])

  useEffect(() => {
    if (problemConquered) {
      toast.success("Problem conquered! +XP")
      const timeout = setTimeout(() => setProblemConquered(false), 200) // Give it a moment
      return () => clearTimeout(timeout)
    }
  }, [problemConquered])


  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[url('/bg.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <div className="text-xl text-purple-300 animate-pulse">
            Loading your DSA challenges...
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[url('/bg.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 text-lg p-6 bg-gray-800 rounded-lg shadow-md max-w-md text-center border border-red-500/50">
          <p><strong>Error:</strong> {error}</p>
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Login again
            </button>
            <button 
              onClick={fetchProblems}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[url('/bg.jpg')] bg-center bg-cover min-h-screen p-4 md:p-6">
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
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              DSA Quest
            </h1>
            <p className="text-gray-400">Level up your coding skills</p>
          </div>
          <div 
            onClick={() => navigate('/Profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="text-purple-400 font-medium group-hover:text-purple-300 transition">
              View Profile
            </span>
            <div className="relative w-12 h-12 bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 border-purple-500 hover:border-purple-400 transition">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUser className="text-purple-400 text-2xl" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary Card */}
        <section className="bg-gray-800/90 p-6 rounded-2xl shadow-lg mb-8 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start">
                <FaCode className="mr-2 text-purple-400" />
                Total Challenges: {problems.length}
              </h2>
              <p className="text-purple-300 font-medium">
                {solvedCount > 10 ? "You're on fire! 🔥" : "Keep grinding! ⚔️"}
              </p>
            </div>
            <div className="relative">
              <div className="flex items-center bg-gray-900 px-6 py-3 rounded-full shadow-md border-2 border-yellow-400">
                <FaTrophy className="text-yellow-400 text-xl mr-3" />
                <span className="font-bold text-lg text-white">{totalXP} XP</span>
              </div>
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
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
            icon={<FaCheck className="text-green-400" />}
            bgColor="bg-gray-800"
            borderColor="border-green-500/30"
            hoverEffect="hover:border-green-500/50"
            valueColor="text-green-400"
          />
          <StatCard 
            value={inProgressCount}
            label="In Progress"
            icon={<FaSpinner className="text-yellow-400 animate-spin" />}
            bgColor="bg-gray-800"
            borderColor="border-yellow-500/30"
            hoverEffect="hover:border-yellow-500/50"
            valueColor="text-yellow-400"
          />
          <StatCard 
            value={todoCount}
            label="To Do"
            icon={<FaClipboardList className="text-blue-400" />}
            bgColor="bg-gray-800"
            borderColor="border-blue-500/30"
            hoverEffect="hover:border-blue-500/50"
            valueColor="text-blue-400"
          />
        </section>

        {/* Sorting Section */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaFilter className="text-purple-400" />
            Filter Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-700 bg-gray-800 text-white px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Topic Filter */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                value={filters.topic}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-700 bg-gray-800 text-white px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full rounded-md border border-gray-700 bg-gray-800 text-white px-4 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
        <section className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white p-4 font-medium">
            <div className="col-span-6 md:col-span-5">Challenge</div>
            <div className="col-span-4 hidden md:block">Topic</div>
            <div className="col-span-3 md:col-span-2">Difficulty</div>
            <div className="col-span-3 md:col-span-1 text-center">Status</div>
          </div>

          {/* Problems List */}
          <div className="divide-y divide-gray-700">
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
              <div className="p-8 text-center text-gray-400">
                No challenges match your filters. Try adjusting your criteria.
              </div>
            )}
          </div>
        </section>

        {/* Streak Indicator */}
        <div className="fixed bottom-4 left-4 flex items-center bg-gray-800 px-3 py-2 rounded-full border border-yellow-500/30 shadow-lg">
          <FaFire className="text-yellow-400 mr-2" />
          <span className="text-white font-medium">3-day streak!</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard