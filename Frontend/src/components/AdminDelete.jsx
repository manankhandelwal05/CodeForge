import { useEffect, useState } from "react";
import {
  Search,
  Trash2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const AdminDelete = () => {
  const navigate = useNavigate();

const [search, setSearch] = useState("");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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
    
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter(problem => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };
const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(search.toLowerCase())
);

  if (loading) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex justify-center items-center">

      <div className="flex flex-col items-center gap-4">

        <span className="loading loading-spinner loading-lg text-violet-500"></span>

        <p className="text-gray-400">
          Loading Problems...
        </p>

      </div>

    </div>
  );
}

  if (error) {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">

      <div className="bg-[#161B22] border border-red-500/20 rounded-2xl p-8 flex items-center gap-4">

        <AlertCircle className="text-red-400" size={28} />

        <div>

          <h2 className="font-semibold text-lg">
            Something went wrong
          </h2>

          <p className="text-gray-400">
            {error}
          </p>

        </div>

      </div>

    </div>
  );
}

 return (

<div className="min-h-screen bg-[#0D1117] text-white">

<div className="max-w-7xl mx-auto px-8 py-10">
      <div className="mb-10">

<button
onClick={() => navigate("/")}
className="flex items-center gap-2 text-gray-400 hover:text-white transition"
>

<ArrowLeft size={18} />

Dashboard

</button>

<h1 className="text-4xl font-bold mt-5">

Delete Problems

</h1>

<p className="text-gray-400 mt-2">

Manage coding problems available on CodeForge.

</p>

{/* </div> */}
</div>
<div className="mb-8">

<div className="relative w-full md:w-96">

<Search
size={18}
className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
/>

<input
type="text"
placeholder="Search problem..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="
w-full
pl-11
pr-4
py-3
rounded-xl
bg-[#161B22]
border
border-[#30363D]
focus:outline-none
focus:border-violet-500
"
/>

</div>

</div>

      <div className="overflow-hidden rounded-2xl border border-[#30363D] bg-[#161B22]">

  <table className="w-full">

    {/* Table Header */}

    <thead className="bg-[#0D1117]">

      <tr className="border-b border-[#30363D]">

        <th className="text-left px-6 py-4 text-gray-400 font-semibold">
          #
        </th>

        <th className="text-left px-6 py-4 text-gray-400 font-semibold">
          Problem
        </th>

        <th className="text-left px-6 py-4 text-gray-400 font-semibold">
          Difficulty
        </th>

        <th className="text-left px-6 py-4 text-gray-400 font-semibold">
          Tag
        </th>

        <th className="text-right px-6 py-4 text-gray-400 font-semibold">
          Action
        </th>

      </tr>

    </thead>

    <tbody>

      {filteredProblems.map((problem, index) => (

        <tr
          key={problem._id}
          className="
            border-b
            border-[#30363D]
            hover:bg-[#1B222C]
            transition
          "
        >

          {/* Index */}

          <td className="px-6 py-5 text-gray-400">
            {index + 1}
          </td>

          {/* Title */}

          <td className="px-6 py-5">

            <div>

              <p className="font-semibold text-white">

                {problem.title}

              </p>

            </div>

          </td>

          {/* Difficulty */}

          <td className="px-6 py-5">

            <span
              className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-sm
                font-medium

                ${
                  problem.difficulty === "easy"
                    ? "bg-green-500/20 text-green-400"

                    : problem.difficulty === "medium"

                    ? "bg-yellow-500/20 text-yellow-400"

                    : "bg-red-500/20 text-red-400"
                }
              `}
            >

              {problem.difficulty}

            </span>

          </td>

          {/* Tag */}

          <td className="px-6 py-5">

            <span
              className="
                inline-flex
                px-3
                py-1
                rounded-full
                border
                border-[#30363D]
                bg-[#0D1117]
                text-gray-300
                text-sm
              "
            >

              {problem.tags}

            </span>

          </td>

          {/* Delete */}

          <td className="px-6 py-5">

            <div className="flex justify-end">

              <button

                onClick={() => handleDelete(problem._id)}

                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-red-500/20
                  text-red-400
                  hover:bg-red-500
                  hover:text-white
                  transition
                "

              >

                <Trash2 size={16} />

                Delete

              </button>

            </div>

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
    </div>
    </div>
    
  );
};

export default AdminDelete;