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
    <div className="min-h-screen bg-[#000205] text-white">

      {/* Navbar */}

      <nav className="navbar sticky top-0 z-50 bg-base-100 border-b border-base-300 px-8">

  {/* Left */}
  <div className="navbar-start">
    <NavLink
      to="/"
      className="flex items-center gap-2 text-2xl font-bold"
    >
      <Code2 size={28} />
      <span>CodeForge</span>
    </NavLink>
  </div>

  {/* Center */}
  <div className="navbar-center">
    <label className="input input-bordered flex items-center gap-2 w-96">

      <Search size={18} />

      <input
        type="text"
        className="grow"
        placeholder="Search problems..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

    </label>
  </div>

  {/* Right */}
  <div className="navbar-end">

    <div className="dropdown dropdown-end">

      <div tabIndex={0} className="btn btn-ghost gap-2">

        <div className="avatar placeholder">

          <div className="bg-neutral rounded-full w-9">
            <span>{user?.firstName?.charAt(0).toUpperCase()}</span>
          </div>

        </div>

        <span>{user?.firstName}</span>

        <ChevronDown size={18} />

      </div>

      <ul
        tabIndex={0}
        className="menu dropdown-content mt-3 w-56 rounded-xl bg-base-100 border border-base-300 shadow-xl p-2"
      >
        {user?.role === "admin" && (
          <li>
            <NavLink to="/admin">
              <Shield size={16} />
              Admin Control
            </NavLink>
          </li>
        )}

        <li>
          <button
  onClick={handleLogout}
  className="text-red-500 hover:bg-red-500 hover:text-white flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
>
  <LogOut size={16} />
  Logout
</button>
        </li>
      </ul>

    </div>

  </div>

</nav>

      {/* Main */}

      <div className="max-w-8xl mx-auto px-6 py-8">

        {/* Tabs */}

{/* Top Filter Bar */}

<div className="flex flex-wrap items-center justify-between gap-4 my-6">

  {/* Left Filters */}

  <div className="flex flex-wrap items-center gap-3">

    {/* Problems */}

    <select
      className="select select-bordered select-sm w-44"
      value={filters.status}
      onChange={(e) => {
        setFilters({
          ...filters,
          status: e.target.value,
        });
        setCurrentPage(1);
      }}
    >
      <option value="all">All Problems</option>
      <option value="solved">Solved Problems</option>
    </select>

    {/* Difficulty */}

    <select
      className="select select-bordered select-sm w-40"
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

    {/* Tags */}

    <select
      className="select select-bordered select-sm w-52"
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

  <p className="text-sm text-gray-400">
    {filteredProblems.length} Problems
  </p>

</div>

        {/* Problems List starts here in Part 2 */}
                {/* Problems List */}

        <div className="space-y-4">

          {currentProblems.length === 0 ? (

            <div className="rounded-xl border border-base-300 bg-base-100 p-10 text-center">

              <h2 className="text-xl font-semibold">
                No Problems Found
              </h2>

              <p className="text-gray-400 mt-2">
                Try changing your filters.
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
                  className="rounded-xl border border-base-300 bg-base-100 px-6 py-5 transition-all duration-200 hover:border-gray-500"
                >

                  <div className="flex items-center justify-between">

                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="text-lg font-semibold hover:text-primary transition"
                    >
                      {problem.title}
                    </NavLink>

                    {solved && (
                      <div className="badge badge-outline border-green-500 text-green-500">
                        Solved
                      </div>
                    )}

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span
                      className={`badge badge-outline ${getDifficultyBadgeColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>

                    {Array.isArray(problem.tags) ? (

                      problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge badge-neutral"
                        >
                          {tag}
                        </span>
                      ))

                    ) : (

                      <span className="badge badge-neutral">
                        {problem.tags}
                      </span>

                    )}

                  </div>

                </div>

              );

            })

          )}

        </div>

        {/* Pagination */}

        {totalPages > 1 && (

          <div className="flex justify-center mt-10">

            <div className="join">

              <button
                className="join-item btn"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`join-item btn ${
                    page === currentPage
                      ? "btn-active"
                      : ""
                  }`}
                >
                  {page}
                </button>

              ))}

              <button
                className="join-item btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
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