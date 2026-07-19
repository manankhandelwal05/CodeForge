import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { Save, Upload, Trash2, FileText, Video } from "lucide-react";

function ManageEditorial() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState("");

//   const [video, setVideo] = useState(null);
  const [textEditorial, setTextEditorial] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axiosClient.get("/problem/getAllProblem");

setProblems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };
  const handleProblemChange = async (e) => {
  const problemId = e.target.value;
  setSelectedProblem(problemId);

  if (!problemId) {
    setTextEditorial("");
    return;
  }

  try {
    const res = await axiosClient.get(`/editorial/${problemId}`);
    setTextEditorial(res.data?.textEditorial || "");
  } catch (err) {
    setTextEditorial("");
  }
};

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSave = async () => {
  if (!selectedProblem) {
    alert("Please select a problem");
    return;
  }

  try {
    setLoading(true);

    await axiosClient.post("/editorial/save", {
      problemId: selectedProblem,
      textEditorial,
    });

    alert("Editorial saved successfully!");

  } catch (err) {
    console.log(err);
    alert("Failed to save editorial");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-base-200 py-10">

      <div className="max-w-5xl mx-auto bg-base-100 rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Manage Editorial
        </h1>

        {/* Select Problem */}

        <div className="mb-8">

          <label className="font-semibold block mb-2">
            Select Problem
          </label>

          <select
            className="select select-bordered w-full"
            value={selectedProblem}
            onChange={(e) =>
              setSelectedProblem(e.target.value)
            }
          >

            <option value="">
              Choose Problem
            </option>

            {problems.map((problem) => (

              <option
                key={problem._id}
                value={problem._id}
              >
                {problem.title}
              </option>

            ))}

          </select>

        </div>

        {/* Video */}

        {/* <div className="bg-base-200 rounded-xl p-6 mb-8">

          <div className="flex items-center gap-2 mb-4">

            <Video />

            <h2 className="text-xl font-semibold">
              Video Editorial
            </h2>

          </div>

          <input
            type="file"
            accept="video/*"
            className="file-input file-input-bordered w-full"
            onChange={handleVideoChange}
          />

          {video && (

            <div className="mt-3">

              <p className="text-success">

                Selected:

                {" "}

                {video.name}

              </p>

            </div>

          )}

        </div> */}

        {/* Written Editorial */}

        <div className="bg-base-200 rounded-xl p-6">

          <div className="flex items-center gap-2 mb-4">

            <FileText />

            <h2 className="text-xl font-semibold">
              Written Editorial
            </h2>

          </div>

          <textarea
            rows={18}
            className="textarea textarea-bordered w-full"
            placeholder="Write your editorial here..."
            value={textEditorial}
            onChange={(e) =>
              setTextEditorial(e.target.value)
            }
          />

        </div>

        {/* Save */}

        <div className="flex justify-end mt-8">

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-success"
          >

            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Editorial
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}

export default ManageEditorial;