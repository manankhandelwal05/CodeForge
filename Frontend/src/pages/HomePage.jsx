import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import {
  Code2,
  Search,
  ChevronDown,
  Shield,
  LogOut,
} from "lucide-react";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const problemsPerPage = 7;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          "/problem/problemSolvedByUser"
        );

        setSolvedProblems(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProblems();

    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const difficultyMatch =
        filters.difficulty === "all" ||
        problem.difficulty.toLowerCase() === filters.difficulty;

      const tagMatch =
        filters.tag === "all" ||
        (Array.isArray(problem.tags)
          ? problem.tags.includes(filters.tag)
          : problem.tags === filters.tag);

      const statusMatch =
        filters.status === "all" ||
        solvedProblems.some((sp) => sp._id === problem._id);

      const searchMatch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return (
        difficultyMatch &&
        tagMatch &&
        statusMatch &&
        searchMatch
      );
    });
  }, [problems, solvedProblems, filters, search]);

  const totalPages = Math.ceil(
    filteredProblems.length / problemsPerPage
  );

  const currentProblems = filteredProblems.slice(
    (currentPage - 1) * problemsPerPage,
    currentPage * problemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-[#27272a] px-8 py-3.5 flex items-center justify-between">
        
        {/* Left */}
        <div className="flex items-center">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center shadow-md shadow-zinc-500/10">
              <Code2 size={20} className="text-white" />
            </div>
            <span>CodeForge</span>
          </NavLink>
        </div>

        {/* Center - Search */}
        <div className="relative w-96 max-w-lg hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full bg-[#18181b]/75 border border-[#27272a] rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition duration-200 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Right - Profile */}
        <div className="flex items-center">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost flex items-center gap-3 hover:bg-[#18181b] rounded-xl px-4 py-2 cursor-pointer transition">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-500 flex items-center justify-center font-bold text-white shadow-md shadow-zinc-500/10 text-sm">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-200 font-medium text-sm hidden sm:inline">{user?.firstName}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content mt-3 w-56 rounded-xl bg-[#09090b] border border-[#27272a] shadow-2xl p-2 gap-1 text-gray-200"
            >
              {user?.role === "admin" && (
                <li>
                  <NavLink to="/admin" className="flex items-center gap-2 hover:bg-[#18181b] rounded-lg px-3 py-2">
                    <Shield size={16} className="text-zinc-400" />
                    Admin Control
                  </NavLink>
                </li>
              )}

              <li>
                <button
                  onClick={handleLogout}
                  className="text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 rounded-lg px-3 py-2 transition-colors cursor-pointer w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Problem Explorer
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sharpen your algorithmic thinking and solve curated data structure challenges.
          </p>
        </div>

        {/* Top Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#09090b] border border-[#27272a] rounded-2xl p-4 mb-8">
          
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Status Select */}
            <select
              className="bg-[#18181b] border border-[#27272a] text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition duration-200 w-44 cursor-pointer"
              value={filters.status}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  status: e.target.value,
                });
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="solved">Solved Problems</option>
            </select>

            {/* Difficulty Select */}
            <select
              className="bg-[#18181b] border border-[#27272a] text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition duration-200 w-44 cursor-pointer"
              value={filters.difficulty}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  difficulty: e.target.value,
                });
                setCurrentPage(1);
              }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Tags Select */}
            <select
              className="bg-[#18181b] border border-[#27272a] text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition duration-200 w-52 cursor-pointer"
              value={filters.tag}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  tag: e.target.value,
                });
                setCurrentPage(1);
              }}
            >
              <option value="all">All Topics</option>
              <option value="array">Array</option>
              <option value="string">String</option>
              <option value="hashing">Hash Table</option>
              <option value="math">Math</option>
              <option value="binarySearch">Binary Search</option>
              <option value="twoPointers">Two Pointers</option>
              <option value="slidingWindow">Sliding Window</option>
              <option value="prefixSum">Prefix Sum</option>
              <option value="sorting">Sorting</option>
              <option value="greedy">Greedy</option>
              <option value="linkedList">Linked List</option>
              <option value="stack">Stack</option>
              <option value="queue">Queue</option>
              <option value="heap">Heap / Priority Queue</option>
              <option value="tree">Tree</option>
              <option value="bst">Binary Search Tree</option>
              <option value="trie">Trie</option>
              <option value="graph">Graph</option>
              <option value="dfs">DFS</option>
              <option value="bfs">BFS</option>
              <option value="topologicalSort">Topological Sort</option>
              <option value="unionFind">Union Find</option>
              <option value="backtracking">Backtracking</option>
              <option value="recursion">Recursion</option>
              <option value="dp">Dynamic Programming</option>
              <option value="bitManipulation">Bit Manipulation</option>
              <option value="segmentTree">Segment Tree</option>
              <option value="fenwickTree">Fenwick Tree</option>
              <option value="matrix">Matrix</option>
            </select>

          </div>

          {/* Result Count */}
          <p className="text-sm text-gray-400 font-medium px-2">
            Showing {filteredProblems.length} challenge{filteredProblems.length !== 1 ? 's' : ''}
          </p>

        </div>

        {/* Problems List */}
        <div className="space-y-4">

          {currentProblems.length === 0 ? (
            <div className="rounded-2xl border border-[#27272a] bg-[#09090b] p-16 text-center shadow-lg">
              <h2 className="text-xl font-semibold text-white">
                No Problems Found
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Try clearing or changing your filters.
              </p>
            </div>
          ) : (
            currentProblems.map((problem) => {
              const solved = solvedProblems.some(
                (sp) => sp._id === problem._id
              );

              return (
                <div
                  key={problem._id}
                  className="group relative bg-[#09090b] border border-[#27272a] rounded-2xl p-6 transition-all duration-300 hover:border-zinc-400/50 hover:shadow-lg hover:shadow-zinc-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden"
                >
                  {/* Left indicator accent based on difficulty */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    problem.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500' :
                    problem.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />

                  <div className="flex flex-col gap-2.5 pl-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <NavLink
                        to={`/problem/${problem._id}`}
                        className="text-lg font-bold text-white group-hover:text-white transition duration-200"
                      >
                        {problem.title}
                      </NavLink>
                      {solved && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Solved
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border uppercase tracking-wider ${
                        problem.difficulty.toLowerCase() === 'easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                        problem.difficulty.toLowerCase() === 'medium' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                        'border-rose-500/20 text-rose-400 bg-rose-500/5'
                      }`}>
                        {problem.difficulty}
                      </span>
                      {Array.isArray(problem.tags) ? (
                        problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-400 bg-[#18181b] border border-[#27272a] px-2.5 py-0.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 bg-[#18181b] border border-[#27272a] px-2.5 py-0.5 rounded-full font-medium">
                          {problem.tags}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center sm:justify-end shrink-0 pl-2 sm:pl-0">
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="w-full sm:w-auto bg-[#18181b] hover:bg-zinc-100 hover:text-zinc-950 border border-[#27272a] text-gray-300 text-xs font-semibold px-4.5 py-2.5 rounded-xl transition duration-200 text-center"
                    >
                      Solve Challenge
                    </NavLink>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center bg-[#09090b] border border-[#27272a] p-1.5 rounded-xl gap-1">
              <button
                className="btn btn-sm btn-ghost hover:bg-[#18181b] text-gray-300 hover:text-white rounded-lg cursor-pointer px-3 disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 flex items-center justify-center text-xs font-semibold rounded-lg cursor-pointer transition ${
                    page === currentPage
                      ? "bg-zinc-100 text-zinc-950"
                      : "text-gray-400 hover:bg-[#18181b] hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                className="btn btn-sm btn-ghost hover:bg-[#18181b] text-gray-300 hover:text-white rounded-lg cursor-pointer px-3 disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );

}

function getDifficultyBadgeColor(difficulty) {

  switch (difficulty.toLowerCase()) {

    case "easy":
      return "border-green-500 text-green-500";

    case "medium":
      return "border-yellow-500 text-yellow-500";

    case "hard":
      return "border-red-500 text-red-500";

    default:
      return "border-gray-500 text-gray-400";

  }

}

export default Homepage;