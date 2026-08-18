import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { NavLink } from 'react-router-dom';
import { Search, Upload, Trash2, ArrowLeft, Video, Filter, Film, Loader2 } from "lucide-react";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete the video solution for this problem?')) return;
    
    try {
      await axiosClient.delete(`/video/delete/${id}`);
      alert('Video deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete video. It might not exist.');
      console.log(err);
    }
  };

  // Filter logic
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = 
      (problem.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (Array.isArray(problem.tags) 
        ? problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) 
        : typeof problem.tags === 'string' 
          ? problem.tags.toLowerCase().includes(searchQuery.toLowerCase())
          : false);
    const matchesDifficulty = difficultyFilter === 'All' || 
                              (problem.difficulty || "").toLowerCase() === difficultyFilter.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-zinc-400" size={40} />
          <span className="text-zinc-400 text-sm font-medium">Loading problems database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin"
              className="p-2.5 bg-[#18181b]/60 border border-[#27272a] hover:border-zinc-400 hover:text-white rounded-xl text-zinc-400 transition-all duration-200"
            >
              <ArrowLeft size={18} />
            </NavLink>
            <div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-1">
                <Film size={12} />
                Video Library Manager
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Video Problem Solutions
              </h1>
            </div>
          </div>
          
          {/* Stats quick view */}
          <div className="px-5 py-3.5 bg-[#18181b]/30 border border-[#27272a] rounded-2xl flex items-center gap-6 text-sm">
            <div>
              <span className="text-zinc-500 block text-xs">Total Problems</span>
              <span className="font-bold text-white text-lg">{problems.length}</span>
            </div>
            <div className="border-l border-[#27272a] h-8"></div>
            <div>
              <span className="text-zinc-500 block text-xs">Filtered Results</span>
              <span className="font-bold text-zinc-200 text-lg">{filteredProblems.length}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] p-4 rounded-2xl">
          
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search problems by title, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200 text-sm"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
              <Filter size={18} />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200 text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

        </div>

        {/* Problems Card Grid / Table Dashboard */}
        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] text-zinc-400 text-xs font-semibold uppercase tracking-wider bg-[#18181b]/30">
                  <th className="py-4 px-6 text-center w-16">#</th>
                  <th className="py-4 px-6">Problem Details</th>
                  <th className="py-4 px-6 text-center w-36">Difficulty</th>
                  <th className="py-4 px-6 text-center w-72">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a]/50">
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem, index) => (
                    <tr 
                      key={problem._id}
                      className="hover:bg-[#18181b]/20 transition-colors duration-150"
                    >
                      {/* Index */}
                      <td className="py-4 px-6 text-center font-mono text-zinc-500 text-sm">
                        {index + 1}
                      </td>
                      
                      {/* Title & Tags */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-white block text-base mb-1">
                          {problem.title}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(problem.tags) ? (
                            problem.tags.map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/50 rounded-md font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          ) : typeof problem.tags === 'string' ? (
                            problem.tags.split(',').map((tag, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-zinc-700/50 rounded-md font-medium"
                              >
                                {tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-600 italic">No tags</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Difficulty */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          problem.difficulty === 'Easy' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : problem.difficulty === 'Medium' 
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <NavLink 
                            to={`/admin/upload/${problem._id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer text-center"
                          >
                            <Upload size={14} />
                            Upload Video
                          </NavLink>
                          
                          <button 
                            onClick={() => handleDelete(problem._id)}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/50 text-xs font-semibold rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-zinc-500 text-sm">
                      No matching coding problems found. Try search parameters again.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminVideo;