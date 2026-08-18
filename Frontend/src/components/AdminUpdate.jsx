// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useNavigate } from "react-router-dom";
// import axiosClient from "../utils/axiosClient";
// import Editor from "@monaco-editor/react";
// import {
//     Check,
//     Loader2,
//     Save,
//     X
// } from "lucide-react";
// import {
//   Code2,
//   CheckCircle2,
// } from "lucide-react";
// import {
//     ArrowLeft,
//     FileText,
//     Layers,
//     Sparkles,
//     Tag,
// } from "lucide-react";
// import {
//     Plus,
//     Trash2,
//     Eye,
//     EyeOff,
//     TestTube2,
//     ListChecks,
// } from "lucide-react";

// const supportedTags = [
//   'array',
//   'linkedList',
//   'graph',
//   'dp',
//   'string',
//   'tree',
//   'math',
//   'greedy',
//   'backtracking',
//   'bitManipulation',
//   'divideAndConquer',
//   'heap',
//   'twoPointers',
//   'binarySearch'
// ];

// // Zod schema matching the problem schema
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(supportedTags),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3, 'All three languages required'),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3, 'All three languages required')
// });

// // Default shape used before a problem is selected / while resetting the form
// const emptyDefaults = {
//   title: "",
//   description: "",
//   difficulty: "easy",
//   tags: "array",
//   visibleTestCases: [{ input: "", output: "", explanation: "" }],
//   hiddenTestCases: [{ input: "", output: "" }],
//   startCode: [
//     { language: 'C++', initialCode: '' },
//     { language: 'Java', initialCode: '' },
//     { language: 'JavaScript', initialCode: '' }
//   ],
//   referenceSolution: [
//     { language: 'C++', completeCode: '' },
//     { language: 'Java', completeCode: '' },
//     { language: 'JavaScript', completeCode: '' }
//   ]
// };

// function AdminUpdatePanel() {
//   const navigate = useNavigate();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Problem list (for the selection dropdown) + selection/loading state
//   const [problems, setProblems] = useState([]);
//   const [isLoadingProblems, setIsLoadingProblems] = useState(true);
//   const [selectedProblemId, setSelectedProblemId] = useState("");
//   const [isLoadingProblem, setIsLoadingProblem] = useState(false);
//   const [loadError, setLoadError] = useState("");

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: emptyDefaults
//   });

//   const {
//     fields: visibleFields,
//     append: appendVisible,
//     remove: removeVisible
//   } = useFieldArray({
//     control,
//     name: 'visibleTestCases'
//   });

//   const {
//     fields: hiddenFields,
//     append: appendHidden,
//     remove: removeHidden
//   } = useFieldArray({
//     control,
//     name: 'hiddenTestCases'
//   });

//   const difficulties = [
//     { value: "easy", label: "Easy", color: "bg-green-500" },
//     { value: "medium", label: "Medium", color: "bg-yellow-500" },
//     { value: "hard", label: "Hard", color: "bg-red-500" },
//   ];

//   const tags = supportedTags;

//   // Fetch the list of problems for the dropdown on mount
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setIsLoadingProblems(true);
//         // NOTE: adjust this endpoint to whatever your backend actually exposes
//         // for listing problems (id + title is enough for the dropdown).
//         const response = await axiosClient.get("/problem/getAllProblem");
//         setProblems(response.data || []);
//       } catch (err) {
//         console.error(err);
//         setLoadError("Failed to load problem list.");
//       } finally {
//         setIsLoadingProblems(false);
//       }
//     };

//     fetchProblems();
//   }, []);

//   // When admin picks a problem from the dropdown, fetch its full details
//   // and pre-fill the form with reset()
//   useEffect(() => {
//     if (!selectedProblemId) {
//       reset(emptyDefaults);
//       return;
//     }

//     const fetchProblem = async () => {
//       try {
//         setIsLoadingProblem(true);
//         setLoadError("");
//         // NOTE: adjust this endpoint to match your backend's "get problem by id" route.
//         const response = await axiosClient.get(`/problem/problemById/${selectedProblemId}`);
//         const problem = response.data;

//         reset({
//           title: problem.title || "",
//           description: problem.description || "",
//           difficulty: problem.difficulty || "easy",
//           tags: problem.tags || "array",
//           visibleTestCases: problem.visibleTestCases?.length
//             ? problem.visibleTestCases
//             : emptyDefaults.visibleTestCases,
//           hiddenTestCases: problem.hiddenTestCases?.length
//             ? problem.hiddenTestCases
//             : emptyDefaults.hiddenTestCases,
//           startCode: problem.startCode?.length === 3
//             ? problem.startCode
//             : emptyDefaults.startCode,
//           referenceSolution: problem.referenceSolution?.length === 3
//             ? problem.referenceSolution
//             : emptyDefaults.referenceSolution,
//         });
//       } catch (err) {
//         console.error(err);
//         setLoadError("Failed to load the selected problem.");
//         reset(emptyDefaults);
//       } finally {
//         setIsLoadingProblem(false);
//       }
//     };

//     fetchProblem();
//   }, [selectedProblemId, reset]);

//   const onSubmit = async (data) => {
//     if (!selectedProblemId) return;

//     try {
//       setIsSubmitting(true);
//       console.log("Updating:", JSON.stringify(data, null, 2));

//       // NOTE: adjust this endpoint to match your backend's update route.
//       const response = await axiosClient.put(`/problem/update/${selectedProblemId}`, data);
//       console.log("Update response:", response.data);

//       setShowSuccess(true);

//       setTimeout(() => {
//         navigate("/admin");
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       const message = err?.response?.data?.message || err?.response?.data || "Failed to update problem. Please try again.";
//       alert(typeof message === "string" ? message : "Failed to update problem. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getMonacoLanguage = (language) => {
//     switch (language) {
//       case "C++":
//         return "cpp";
//       case "Java":
//         return "java";
//       case "JavaScript":
//         return "javascript";
//       default:
//         return "plaintext";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0D1117] text-white">

//       {showSuccess && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
//           <CheckCircle2 size={20} />
//           Problem updated successfully! Redirecting...
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-8 py-10">

//         {/* Header */}
//         <button
//           onClick={() => navigate("/admin")}
//           className="flex items-center gap-2 text-gray-400 hover:text-white transition"
//         >
//           <ArrowLeft size={18} />
//           Dashboard
//         </button>

//         <h1 className="text-4xl font-bold mt-6">
//           Update Problem
//         </h1>

//         <p className="text-gray-400 mt-2">
//           Select an existing problem and edit its details.
//         </p>

//         {/* ================= PROBLEM SELECTOR ================= */}
//         <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//           <div className="flex items-center gap-3 mb-8">
//             <ListChecks className="text-violet-500" size={28} />
//             <div>
//               <h2 className="text-2xl font-bold">Select Problem</h2>
//               <p className="text-gray-400 text-sm">
//                 Choose which problem you want to edit.
//               </p>
//             </div>
//           </div>

//           {loadError && (
//             <p className="text-red-500 mb-4 text-sm">{loadError}</p>
//           )}

//           <select
//             value={selectedProblemId}
//             onChange={(e) => setSelectedProblemId(e.target.value)}
//             disabled={isLoadingProblems}
//             className="
//               w-full
//               rounded-xl
//               border
//               border-[#30363D]
//               bg-[#0D1117]
//               px-4
//               py-3
//               text-white
//               focus:outline-none
//               focus:border-violet-500
//               disabled:opacity-50
//             "
//           >
//             <option value="">
//               {isLoadingProblems ? "Loading problems..." : "-- Select a problem --"}
//             </option>
//             {problems.map((problem) => (
//               <option key={problem._id} value={problem._id}>
//                 {problem.title} ({problem.difficulty})
//               </option>
//             ))}
//           </select>

//           {isLoadingProblem && (
//             <div className="flex items-center gap-2 text-gray-400 mt-4 text-sm">
//               <Loader2 size={16} className="animate-spin" />
//               Loading problem details...
//             </div>
//           )}
//         </div>

//         {/* The rest of the form only renders once a problem is selected and loaded */}
//         {selectedProblemId && !isLoadingProblem && (
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="mt-10"
//           >
//             {/* Problem Details */}
//             <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//               <div className="flex items-center gap-3 mb-8">
//                 <FileText className="text-violet-500" size={28} />
//                 <div>
//                   <h2 className="text-2xl font-bold">Problem Details</h2>
//                   <p className="text-gray-400 text-sm">
//                     Basic information about the coding problem.
//                   </p>
//                 </div>
//               </div>

//               {/* Title */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Problem Title
//                 </label>
//                 <input
//                   {...register("title")}
//                   placeholder="Reverse a String"
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     px-4
//                     py-3
//                     text-white
//                     placeholder:text-gray-500
//                     focus:outline-none
//                     focus:border-violet-500
//                   "
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 mt-2 text-sm">{errors.title.message}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Description
//                 </label>
//                 <textarea
//                   rows={10}
//                   {...register("description")}
//                   placeholder="Describe the problem..."
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     px-4
//                     py-3
//                     resize-none
//                     text-white
//                     placeholder:text-gray-500
//                     focus:outline-none
//                     focus:border-violet-500
//                   "
//                 />
//                 {errors.description && (
//                   <p className="text-red-500 mt-2 text-sm">{errors.description.message}</p>
//                 )}
//               </div>

//               {/* Difficulty */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Difficulty
//                 </label>
//                 <Controller
//                   control={control}
//                   name="difficulty"
//                   render={({ field }) => (
//                     <div className="flex gap-4">
//                       {difficulties.map((difficulty) => (
//                         <button
//                           type="button"
//                           key={difficulty.value}
//                           onClick={() => field.onChange(difficulty.value)}
//                           className={`
//                             flex items-center gap-3
//                             px-6
//                             py-3
//                             rounded-xl
//                             border
//                             transition
//                             ${
//                               field.value === difficulty.value
//                                 ? "border-violet-500 bg-violet-500/20"
//                                 : "border-[#30363D] hover:border-violet-500"
//                             }
//                           `}
//                         >
//                           <div className={`w-3 h-3 rounded-full ${difficulty.color}`} />
//                           {difficulty.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 />
//               </div>

//               {/* Tag */}
//               <div>
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Topic
//                 </label>
//                 <Controller
//                   control={control}
//                   name="tags"
//                   render={({ field }) => (
//                     <div>
//                       <div className="flex flex-wrap gap-3">
//                         {tags.map((tag) => (
//                           <button
//                             key={tag}
//                             type="button"
//                             onClick={() => field.onChange(tag)}
//                             className={`
//                               px-5
//                               py-2.5
//                               rounded-full
//                               border
//                               transition
//                               ${
//                                 field.value === tag
//                                   ? "bg-violet-500 border-violet-500 text-white"
//                                   : "border-[#30363D] text-gray-300 hover:border-violet-500"
//                               }
//                             `}
//                           >
//                             {tag}
//                           </button>
//                         ))}
//                       </div>
//                       {errors.tags && (
//                         <p className="text-red-500 mt-2 text-sm">{errors.tags.message}</p>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* ================= TEST CASES ================= */}
//             <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//               <div className="flex items-center gap-3 mb-8">
//                 <TestTube2 size={28} className="text-violet-500" />
//                 <div>
//                   <h2 className="text-2xl font-bold">Test Cases</h2>
//                   <p className="text-gray-400 text-sm">
//                     Edit visible and hidden test cases.
//                   </p>
//                 </div>
//               </div>

//               {/* ================= Visible ================= */}
//               <div className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <Eye size={22} className="text-green-400" />
//                     <h3 className="text-xl font-semibold">Visible Test Cases</h3>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       appendVisible({ input: "", output: "", explanation: "" })
//                     }
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       px-5
//                       py-2.5
//                       rounded-xl
//                       bg-violet-600
//                       hover:bg-violet-700
//                       transition
//                     "
//                   >
//                     <Plus size={18} />
//                     Add Case
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {visibleFields.map((field, index) => (
//                     <div
//                       key={field.id}
//                       className="rounded-xl border border-[#30363D] bg-[#0D1117] p-6"
//                     >
//                       <div className="flex justify-between items-center mb-5">
//                         <h4 className="font-semibold text-lg">Visible Case #{index + 1}</h4>
//                         <button
//                           type="button"
//                           onClick={() => removeVisible(index)}
//                           className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Input</label>
//                           <textarea
//                             rows={3}
//                             {...register(`visibleTestCases.${index}.input`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>

//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Output</label>
//                           <textarea
//                             rows={3}
//                             {...register(`visibleTestCases.${index}.output`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>

//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Explanation</label>
//                           <textarea
//                             rows={4}
//                             {...register(`visibleTestCases.${index}.explanation`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ================= Hidden ================= */}
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <EyeOff size={22} className="text-red-400" />
//                     <h3 className="text-xl font-semibold">Hidden Test Cases</h3>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => appendHidden({ input: "", output: "" })}
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       px-5
//                       py-2.5
//                       rounded-xl
//                       bg-violet-600
//                       hover:bg-violet-700
//                       transition
//                     "
//                   >
//                     <Plus size={18} />
//                     Add Case
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {hiddenFields.map((field, index) => (
//                     <div
//                       key={field.id}
//                       className="rounded-xl border border-[#30363D] bg-[#0D1117] p-6"
//                     >
//                       <div className="flex justify-between items-center mb-5">
//                         <h4 className="font-semibold text-lg">Hidden Case #{index + 1}</h4>
//                         <button
//                           type="button"
//                           onClick={() => removeHidden(index)}
//                           className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Input</label>
//                           <textarea
//                             rows={3}
//                             {...register(`hiddenTestCases.${index}.input`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>

//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Output</label>
//                           <textarea
//                             rows={3}
//                             {...register(`hiddenTestCases.${index}.output`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ================= CODE SECTION ================= */}
//             <div className="mt-10 space-y-10">
//               {[
//                 {
//                   title: "Starter Code",
//                   icon: <Code2 size={26} className="text-violet-500" />,
//                   field: "startCode",
//                   valueKey: "initialCode"
//                 },
//                 {
//                   title: "Reference Solution",
//                   icon: <CheckCircle2 size={26} className="text-green-500" />,
//                   field: "referenceSolution",
//                   valueKey: "completeCode"
//                 }
//               ].map((section) => (
//                 <div
//                   key={section.title}
//                   className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8"
//                 >
//                   <div className="flex items-center gap-3 mb-8">
//                     {section.icon}
//                     <div>
//                       <h2 className="text-2xl font-bold">{section.title}</h2>
//                       <p className="text-gray-400 text-sm">
//                         {section.title === "Starter Code"
//                           ? "Boilerplate code for every language."
//                           : "Official solution used by the judge."}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="space-y-10">
//                     {[0, 1, 2].map((index) => {
//                       const language =
//                         index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript";

//                       return (
//                         <div
//                           key={language}
//                           className="border border-[#30363D] rounded-xl overflow-hidden"
//                         >
//                           {/* Header */}
//                           <div className="
//                             bg-[#0D1117]
//                             border-b
//                             border-[#30363D]
//                             px-5
//                             py-3
//                             flex
//                             items-center
//                             justify-between
//                           ">
//                             <div className="flex items-center gap-3">
//                               <div className="w-3 h-3 rounded-full bg-violet-500" />
//                               <span className="font-medium">{language}</span>
//                             </div>
//                           </div>

//                           {/* Monaco */}
//                           <Editor
//                             height="350px"
//                             language={getMonacoLanguage(language)}
//                             theme="vs-dark"
//                             value={watch(`${section.field}.${index}.${section.valueKey}`)}
//                             onChange={(value) => {
//                               setValue(
//                                 `${section.field}.${index}.${section.valueKey}`,
//                                 value || ""
//                               );
//                             }}
//                             options={{
//                               fontSize: 15,
//                               minimap: { enabled: false },
//                               automaticLayout: true,
//                               scrollBeyondLastLine: false,
//                               wordWrap: "on",
//                               tabSize: 4,
//                               padding: { top: 20 }
//                             }}
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed rounded-xl font-semibold transition"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={18} className="animate-spin" />
//                   Updating Problem...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Update Problem
//                 </>
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminUpdatePanel;









// import React, { useState, useEffect } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useNavigate } from "react-router-dom";
// import axiosClient from "../utils/axiosClient";
// import Editor from "@monaco-editor/react";
// import {
//     Check,
//     Loader2,
//     Save,
//     X
// } from "lucide-react";
// import {
//   Code2,
//   CheckCircle2,
// } from "lucide-react";
// import {
//     ArrowLeft,
//     FileText,
//     Layers,
//     Sparkles,
//     Tag,
// } from "lucide-react";
// import {
//     Plus,
//     Trash2,
//     Eye,
//     EyeOff,
//     TestTube2,
//     ListChecks,
//     ChevronDown,
//     ChevronRight,
// } from "lucide-react";

// const supportedTags = [
//   'array',
//   'linkedList',
//   'graph',
//   'dp',
//   'string',
//   'tree',
//   'math',
//   'greedy',
//   'backtracking',
//   'bitManipulation',
//   'divideAndConquer',
//   'heap',
//   'twoPointers',
//   'binarySearch'
// ];

// // Zod schema matching the problem schema
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(supportedTags),
//   visibleTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required'),
//       explanation: z.string().min(1, 'Explanation is required')
//     })
//   ).min(1, 'At least one visible test case required'),
//   hiddenTestCases: z.array(
//     z.object({
//       input: z.string().min(1, 'Input is required'),
//       output: z.string().min(1, 'Output is required')
//     })
//   ).min(1, 'At least one hidden test case required'),
//   startCode: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       initialCode: z.string().min(1, 'Initial code is required')
//     })
//   ).length(3, 'All three languages required'),
//   referenceSolution: z.array(
//     z.object({
//       language: z.enum(['C++', 'Java', 'JavaScript']),
//       completeCode: z.string().min(1, 'Complete code is required')
//     })
//   ).length(3, 'All three languages required')
// });

// // Default shape used before a problem is selected / while resetting the form
// const emptyDefaults = {
//   title: "",
//   description: "",
//   difficulty: "easy",
//   tags: "array",
//   visibleTestCases: [{ input: "", output: "", explanation: "" }],
//   hiddenTestCases: [{ input: "", output: "" }],
//   startCode: [
//     { language: 'C++', initialCode: '' },
//     { language: 'Java', initialCode: '' },
//     { language: 'JavaScript', initialCode: '' }
//   ],
//   referenceSolution: [
//     { language: 'C++', completeCode: '' },
//     { language: 'Java', completeCode: '' },
//     { language: 'JavaScript', completeCode: '' }
//   ]
// };

// // Rebuilds a startCode / referenceSolution array against the fixed
// // ["C++", "Java", "JavaScript"] order, matching each entry by its
// // `language` field instead of trusting array position. This is what
// // was causing reference solutions to appear blank: if the backend
// // returns the three languages in a different order (or the array
// // length isn't exactly 3 for some other reason), the old code threw
// // the whole thing away and fell back to empty strings. This version
// // keeps whatever the backend actually sent, regardless of order.
// const mapByLanguage = (arr, key) => {
//   const languages = ['C++', 'Java', 'JavaScript'];
//   return languages.map((language) => {
//     const match = Array.isArray(arr)
//       ? arr.find((item) => item.language === language)
//       : null;
//     return { language, [key]: match?.[key] || "" };
//   });
// };

// function AdminUpdatePanel() {
//   const navigate = useNavigate();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Which hidden test cases are expanded for editing. Hidden cases can
//   // number in the dozens/hundreds for some problems, so we render them
//   // collapsed by default instead of mounting a full set of textareas
//   // for every single one.
//   const [expandedHidden, setExpandedHidden] = useState(new Set());
//   const toggleHidden = (fieldId) => {
//     setExpandedHidden((prev) => {
//       const next = new Set(prev);
//       if (next.has(fieldId)) next.delete(fieldId);
//       else next.add(fieldId);
//       return next;
//     });
//   };

//   // Problem list (for the selection dropdown) + selection/loading state
//   const [problems, setProblems] = useState([]);
//   const [isLoadingProblems, setIsLoadingProblems] = useState(true);
//   const [selectedProblemId, setSelectedProblemId] = useState("");
//   const [isLoadingProblem, setIsLoadingProblem] = useState(false);
//   const [loadError, setLoadError] = useState("");

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors }
//   } = useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: emptyDefaults
//   });

//   const {
//     fields: visibleFields,
//     append: appendVisible,
//     remove: removeVisible
//   } = useFieldArray({
//     control,
//     name: 'visibleTestCases'
//   });

//   const {
//     fields: hiddenFields,
//     append: appendHidden,
//     remove: removeHidden
//   } = useFieldArray({
//     control,
//     name: 'hiddenTestCases'
//   });

//   const difficulties = [
//     { value: "easy", label: "Easy", color: "bg-green-500" },
//     { value: "medium", label: "Medium", color: "bg-yellow-500" },
//     { value: "hard", label: "Hard", color: "bg-red-500" },
//   ];

//   const tags = supportedTags;

//   // Fetch the list of problems for the dropdown on mount
//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         setIsLoadingProblems(true);
//         // NOTE: adjust this endpoint to whatever your backend actually exposes
//         // for listing problems (id + title is enough for the dropdown).
//         const response = await axiosClient.get("/problem/getAllProblem");
//         setProblems(response.data || []);
//       } catch (err) {
//         console.error(err);
//         setLoadError("Failed to load problem list.");
//       } finally {
//         setIsLoadingProblems(false);
//       }
//     };

//     fetchProblems();
//   }, []);

//   // When admin picks a problem from the dropdown, fetch its full details
//   // and pre-fill the form with reset()
//   useEffect(() => {
//     if (!selectedProblemId) {
//       reset(emptyDefaults);
//       return;
//     }

//     const fetchProblem = async () => {
//       try {
//         setIsLoadingProblem(true);
//         setLoadError("");
//         // NOTE: adjust this endpoint to match your backend's "get problem by id" route.
//         const response = await axiosClient.get(`/problem/problemById/${selectedProblemId}`);
//         const problem = response.data;

//         reset({
//           title: problem.title || "",
//           description: problem.description || "",
//           difficulty: problem.difficulty || "easy",
//           tags: problem.tags || "array",
//           visibleTestCases: problem.visibleTestCases?.length
//             ? problem.visibleTestCases
//             : emptyDefaults.visibleTestCases,
//           hiddenTestCases: problem.hiddenTestCases?.length
//             ? problem.hiddenTestCases
//             : emptyDefaults.hiddenTestCases,
//           startCode: mapByLanguage(problem.startCode, 'initialCode'),
//           referenceSolution: mapByLanguage(problem.referenceSolution, 'completeCode'),
//         });
//       } catch (err) {
//         console.error(err);
//         setLoadError("Failed to load the selected problem.");
//         reset(emptyDefaults);
//       } finally {
//         setIsLoadingProblem(false);
//       }
//     };

//     fetchProblem();
//   }, [selectedProblemId, reset]);

//   const onSubmit = async (data) => {
//     if (!selectedProblemId) return;

//     try {
//       setIsSubmitting(true);
//       console.log("Updating:", JSON.stringify(data, null, 2));

//       // NOTE: adjust this endpoint to match your backend's update route.
//       const response = await axiosClient.put(`/problem/update/${selectedProblemId}`, data);
//       console.log("Update response:", response.data);

//       setShowSuccess(true);

//       setTimeout(() => {
//         navigate("/admin");
//       }, 2000);
//     } catch (err) {
//       console.error(err);
//       const message = err?.response?.data?.message || err?.response?.data || "Failed to update problem. Please try again.";
//       alert(typeof message === "string" ? message : "Failed to update problem. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getMonacoLanguage = (language) => {
//     switch (language) {
//       case "C++":
//         return "cpp";
//       case "Java":
//         return "java";
//       case "JavaScript":
//         return "javascript";
//       default:
//         return "plaintext";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0D1117] text-white">

//       {showSuccess && (
//         <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
//           <CheckCircle2 size={20} />
//           Problem updated successfully! Redirecting...
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-8 py-10">

//         {/* Header */}
//         <button
//           onClick={() => navigate("/")}
//           className="flex items-center gap-2 text-gray-400 hover:text-white transition"
//         >
//           <ArrowLeft size={18} />
//           Dashboard
//         </button>

//         <h1 className="text-4xl font-bold mt-6">
//           Update Problem
//         </h1>

//         <p className="text-gray-400 mt-2">
//           Select an existing problem and edit its details.
//         </p>

//         {/* ================= PROBLEM SELECTOR ================= */}
//         <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//           <div className="flex items-center gap-3 mb-8">
//             <ListChecks className="text-violet-500" size={28} />
//             <div>
//               <h2 className="text-2xl font-bold">Select Problem</h2>
//               <p className="text-gray-400 text-sm">
//                 Choose which problem you want to edit.
//               </p>
//             </div>
//           </div>

//           {loadError && (
//             <p className="text-red-500 mb-4 text-sm">{loadError}</p>
//           )}

//           <select
//             value={selectedProblemId}
//             onChange={(e) => setSelectedProblemId(e.target.value)}
//             disabled={isLoadingProblems}
//             className="
//               w-full
//               rounded-xl
//               border
//               border-[#30363D]
//               bg-[#0D1117]
//               px-4
//               py-3
//               text-white
//               focus:outline-none
//               focus:border-violet-500
//               disabled:opacity-50
//             "
//           >
//             <option value="">
//               {isLoadingProblems ? "Loading problems..." : "-- Select a problem --"}
//             </option>
//             {problems.map((problem) => (
//               <option key={problem._id} value={problem._id}>
//                 {problem.title} ({problem.difficulty})
//               </option>
//             ))}
//           </select>

//           {isLoadingProblem && (
//             <div className="flex items-center gap-2 text-gray-400 mt-4 text-sm">
//               <Loader2 size={16} className="animate-spin" />
//               Loading problem details...
//             </div>
//           )}
//         </div>

//         {/* The rest of the form only renders once a problem is selected and loaded */}
//         {selectedProblemId && !isLoadingProblem && (
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="mt-10"
//           >
//             {/* Problem Details */}
//             <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//               <div className="flex items-center gap-3 mb-8">
//                 <FileText className="text-violet-500" size={28} />
//                 <div>
//                   <h2 className="text-2xl font-bold">Problem Details</h2>
//                   <p className="text-gray-400 text-sm">
//                     Basic information about the coding problem.
//                   </p>
//                 </div>
//               </div>

//               {/* Title */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Problem Title
//                 </label>
//                 <input
//                   {...register("title")}
//                   placeholder="Reverse a String"
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     px-4
//                     py-3
//                     text-white
//                     placeholder:text-gray-500
//                     focus:outline-none
//                     focus:border-violet-500
//                   "
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 mt-2 text-sm">{errors.title.message}</p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Description
//                 </label>
//                 <textarea
//                   rows={10}
//                   {...register("description")}
//                   placeholder="Describe the problem..."
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     px-4
//                     py-3
//                     resize-none
//                     text-white
//                     placeholder:text-gray-500
//                     focus:outline-none
//                     focus:border-violet-500
//                   "
//                 />
//                 {errors.description && (
//                   <p className="text-red-500 mt-2 text-sm">{errors.description.message}</p>
//                 )}
//               </div>

//               {/* Difficulty */}
//               <div className="mb-8">
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Difficulty
//                 </label>
//                 <Controller
//                   control={control}
//                   name="difficulty"
//                   render={({ field }) => (
//                     <div className="flex gap-4">
//                       {difficulties.map((difficulty) => (
//                         <button
//                           type="button"
//                           key={difficulty.value}
//                           onClick={() => field.onChange(difficulty.value)}
//                           className={`
//                             flex items-center gap-3
//                             px-6
//                             py-3
//                             rounded-xl
//                             border
//                             transition
//                             ${
//                               field.value === difficulty.value
//                                 ? "border-violet-500 bg-violet-500/20"
//                                 : "border-[#30363D] hover:border-violet-500"
//                             }
//                           `}
//                         >
//                           <div className={`w-3 h-3 rounded-full ${difficulty.color}`} />
//                           {difficulty.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 />
//               </div>

//               {/* Tag */}
//               <div>
//                 <label className="block mb-3 text-sm font-semibold text-gray-300">
//                   Topic
//                 </label>
//                 <Controller
//                   control={control}
//                   name="tags"
//                   render={({ field }) => (
//                     <div>
//                       <div className="flex flex-wrap gap-3">
//                         {tags.map((tag) => (
//                           <button
//                             key={tag}
//                             type="button"
//                             onClick={() => field.onChange(tag)}
//                             className={`
//                               px-5
//                               py-2.5
//                               rounded-full
//                               border
//                               transition
//                               ${
//                                 field.value === tag
//                                   ? "bg-violet-500 border-violet-500 text-white"
//                                   : "border-[#30363D] text-gray-300 hover:border-violet-500"
//                               }
//                             `}
//                           >
//                             {tag}
//                           </button>
//                         ))}
//                       </div>
//                       {errors.tags && (
//                         <p className="text-red-500 mt-2 text-sm">{errors.tags.message}</p>
//                       )}
//                     </div>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* ================= TEST CASES ================= */}
//             <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//               <div className="flex items-center gap-3 mb-8">
//                 <TestTube2 size={28} className="text-violet-500" />
//                 <div>
//                   <h2 className="text-2xl font-bold">Test Cases</h2>
//                   <p className="text-gray-400 text-sm">
//                     Edit visible and hidden test cases.
//                   </p>
//                 </div>
//               </div>

//               {/* ================= Visible ================= */}
//               <div className="mb-10">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <Eye size={22} className="text-green-400" />
//                     <h3 className="text-xl font-semibold">Visible Test Cases</h3>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       appendVisible({ input: "", output: "", explanation: "" })
//                     }
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       px-5
//                       py-2.5
//                       rounded-xl
//                       bg-violet-600
//                       hover:bg-violet-700
//                       transition
//                     "
//                   >
//                     <Plus size={18} />
//                     Add Case
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {visibleFields.map((field, index) => (
//                     <div
//                       key={field.id}
//                       className="rounded-xl border border-[#30363D] bg-[#0D1117] p-6"
//                     >
//                       <div className="flex justify-between items-center mb-5">
//                         <h4 className="font-semibold text-lg">Visible Case #{index + 1}</h4>
//                         <button
//                           type="button"
//                           onClick={() => removeVisible(index)}
//                           className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>

//                       <div className="space-y-5">
//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Input</label>
//                           <textarea
//                             rows={3}
//                             {...register(`visibleTestCases.${index}.input`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>

//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Output</label>
//                           <textarea
//                             rows={3}
//                             {...register(`visibleTestCases.${index}.output`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>

//                         <div>
//                           <label className="block mb-2 text-sm text-gray-400">Explanation</label>
//                           <textarea
//                             rows={4}
//                             {...register(`visibleTestCases.${index}.explanation`)}
//                             className="
//                               w-full
//                               rounded-lg
//                               bg-[#161B22]
//                               border
//                               border-[#30363D]
//                               p-3
//                               resize-none
//                               focus:outline-none
//                               focus:border-violet-500
//                             "
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* ================= Hidden ================= */}
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center gap-3">
//                     <EyeOff size={22} className="text-red-400" />
//                     <h3 className="text-xl font-semibold">Hidden Test Cases</h3>
//                     <span className="text-sm text-gray-400">
//                       ({hiddenFields.length} total)
//                     </span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => appendHidden({ input: "", output: "" })}
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       px-5
//                       py-2.5
//                       rounded-xl
//                       bg-violet-600
//                       hover:bg-violet-700
//                       transition
//                     "
//                   >
//                     <Plus size={18} />
//                     Add Case
//                   </button>
//                 </div>

//                 {/* Collapsed by default — with many hidden cases, mounting a
//                     full input/output pair of textareas for every single one
//                     is what was making this section unusable. Each case now
//                     only renders its editable fields once expanded. */}
//                 <div className="space-y-3">
//                   {hiddenFields.map((field, index) => {
//                     const isOpen = expandedHidden.has(field.id);
//                     return (
//                       <div
//                         key={field.id}
//                         className="rounded-xl border border-[#30363D] bg-[#0D1117] overflow-hidden"
//                       >
//                         <div className="flex justify-between items-center px-6 py-4">
//                           <button
//                             type="button"
//                             onClick={() => toggleHidden(field.id)}
//                             className="flex items-center gap-2 font-semibold text-lg"
//                           >
//                             {isOpen ? (
//                               <ChevronDown size={18} className="text-gray-400" />
//                             ) : (
//                               <ChevronRight size={18} className="text-gray-400" />
//                             )}
//                             Hidden Case #{index + 1}
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => removeHidden(index)}
//                             className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </div>

//                         {isOpen && (
//                           <div className="space-y-5 px-6 pb-6">
//                             <div>
//                               <label className="block mb-2 text-sm text-gray-400">Input</label>
//                               <textarea
//                                 rows={3}
//                                 {...register(`hiddenTestCases.${index}.input`)}
//                                 className="
//                                   w-full
//                                   rounded-lg
//                                   bg-[#161B22]
//                                   border
//                                   border-[#30363D]
//                                   p-3
//                                   resize-none
//                                   focus:outline-none
//                                   focus:border-violet-500
//                                 "
//                               />
//                             </div>

//                             <div>
//                               <label className="block mb-2 text-sm text-gray-400">Output</label>
//                               <textarea
//                                 rows={3}
//                                 {...register(`hiddenTestCases.${index}.output`)}
//                                 className="
//                                   w-full
//                                   rounded-lg
//                                   bg-[#161B22]
//                                   border
//                                   border-[#30363D]
//                                   p-3
//                                   resize-none
//                                   focus:outline-none
//                                   focus:border-violet-500
//                                 "
//                               />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* ================= CODE SECTION ================= */}
//             <div className="mt-10 space-y-10">
//               {[
//                 {
//                   title: "Starter Code",
//                   icon: <Code2 size={26} className="text-violet-500" />,
//                   field: "startCode",
//                   valueKey: "initialCode"
//                 },
//                 {
//                   title: "Reference Solution",
//                   icon: <CheckCircle2 size={26} className="text-green-500" />,
//                   field: "referenceSolution",
//                   valueKey: "completeCode"
//                 }
//               ].map((section) => (
//                 <div
//                   key={section.title}
//                   className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8"
//                 >
//                   <div className="flex items-center gap-3 mb-8">
//                     {section.icon}
//                     <div>
//                       <h2 className="text-2xl font-bold">{section.title}</h2>
//                       <p className="text-gray-400 text-sm">
//                         {section.title === "Starter Code"
//                           ? "Boilerplate code for every language."
//                           : "Official solution used by the judge."}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="space-y-10">
//                     {[0, 1, 2].map((index) => {
//                       const language =
//                         index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript";

//                       return (
//                         <div
//                           key={language}
//                           className="border border-[#30363D] rounded-xl overflow-hidden"
//                         >
//                           {/* Header */}
//                           <div className="
//                             bg-[#0D1117]
//                             border-b
//                             border-[#30363D]
//                             px-5
//                             py-3
//                             flex
//                             items-center
//                             justify-between
//                           ">
//                             <div className="flex items-center gap-3">
//                               <div className="w-3 h-3 rounded-full bg-violet-500" />
//                               <span className="font-medium">{language}</span>
//                             </div>
//                           </div>

//                           {/* Monaco */}
//                           <Editor
//                             height="350px"
//                             language={getMonacoLanguage(language)}
//                             theme="vs-dark"
//                             value={watch(`${section.field}.${index}.${section.valueKey}`)}
//                             onChange={(value) => {
//                               setValue(
//                                 `${section.field}.${index}.${section.valueKey}`,
//                                 value || ""
//                               );
//                             }}
//                             options={{
//                               fontSize: 15,
//                               minimap: { enabled: false },
//                               automaticLayout: true,
//                               scrollBeyondLastLine: false,
//                               wordWrap: "on",
//                               tabSize: 4,
//                               padding: { top: 20 }
//                             }}
//                           />
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed rounded-xl font-semibold transition"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 size={18} className="animate-spin" />
//                   Updating Problem...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Update Problem
//                 </>
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminUpdatePanel;


import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import Editor from "@monaco-editor/react";
import {
    Check,
    Loader2,
    Save,
    X
} from "lucide-react";
import {
  Code2,
  CheckCircle2,
} from "lucide-react";
import {
    ArrowLeft,
    FileText,
    Layers,
    Sparkles,
    Tag,
} from "lucide-react";
import {
    Plus,
    Trash2,
    Eye,
    EyeOff,
    TestTube2,
    ListChecks,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

const supportedTags = [
  'array',
  'linkedList',
  'graph',
  'dp',
  'string',
  'tree',
  'math',
  'greedy',
  'backtracking',
  'bitManipulation',
  'divideAndConquer',
  'heap',
  'twoPointers',
  'binarySearch'
];

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(supportedTags),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

// Default shape used before a problem is selected / while resetting the form
const emptyDefaults = {
  title: "",
  description: "",
  difficulty: "easy",
  tags: "array",
  visibleTestCases: [{ input: "", output: "", explanation: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  startCode: [
    { language: 'C++', initialCode: '' },
    { language: 'Java', initialCode: '' },
    { language: 'JavaScript', initialCode: '' }
  ],
  referenceSolution: [
    { language: 'C++', completeCode: '' },
    { language: 'Java', completeCode: '' },
    { language: 'JavaScript', completeCode: '' }
  ]
};

// Rebuilds a startCode / referenceSolution array against the fixed
// ["C++", "Java", "JavaScript"] order. Tries to match each entry by its
// `language` field (case-insensitively) first; if nothing matches by
// name, it falls back to whatever is at that same index in the source
// array, so real data is never dropped just because of a naming/casing
// mismatch or unexpected order.
const mapByLanguage = (arr, key) => {
  const languages = ['C++', 'Java', 'JavaScript'];
  return languages.map((language, idx) => {
    let match = null;
    if (Array.isArray(arr)) {
      match = arr.find(
        (item) => item?.language?.toLowerCase() === language.toLowerCase()
      );
      if (!match) match = arr[idx] || null;
    }
    return { language, [key]: match?.[key] ?? "" };
  });
};

function AdminUpdatePanel() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Which hidden test cases are expanded for editing. Hidden cases can
  // number in the dozens/hundreds for some problems, so we render them
  // collapsed by default instead of mounting a full set of textareas
  // for every single one.
  const [expandedHidden, setExpandedHidden] = useState(new Set());
  const toggleHidden = (fieldId) => {
    setExpandedHidden((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  };

  // Problem list (for the selection dropdown) + selection/loading state
  const [problems, setProblems] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [loadError, setLoadError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: emptyDefaults
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const difficulties = [
    { value: "easy", label: "Easy", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "hard", label: "Hard", color: "bg-red-500" },
  ];

  const tags = supportedTags;

  // Fetch the list of problems for the dropdown on mount
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoadingProblems(true);
        // NOTE: adjust this endpoint to whatever your backend actually exposes
        // for listing problems (id + title is enough for the dropdown).
        const response = await axiosClient.get("/problem/getAllProblem");
        setProblems(response.data || []);
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load problem list.");
      } finally {
        setIsLoadingProblems(false);
      }
    };

    fetchProblems();
  }, []);

  // When admin picks a problem from the dropdown, fetch its full details
  // and pre-fill the form with reset()
  useEffect(() => {
    if (!selectedProblemId) {
      reset(emptyDefaults);
      return;
    }

    const fetchProblem = async () => {
      try {
        setIsLoadingProblem(true);
        setLoadError("");
        // NOTE: adjust this endpoint to match your backend's "get problem by id" route.
        const response = await axiosClient.get(`/problem/problemById/${selectedProblemId}`);
        const problem = response.data;
        console.log("Fetched problem (check field names here if code is blank):", problem);

        reset({
          title: problem.title || "",
          description: problem.description || "",
          difficulty: problem.difficulty || "easy",
          tags: problem.tags || "array",
          visibleTestCases: problem.visibleTestCases?.length
            ? problem.visibleTestCases
            : emptyDefaults.visibleTestCases,
          hiddenTestCases: problem.hiddenTestCases?.length
            ? problem.hiddenTestCases
            : emptyDefaults.hiddenTestCases,
          startCode: mapByLanguage(problem.startCode, 'initialCode'),
          referenceSolution: mapByLanguage(problem.referenceSolution, 'completeCode'),
        });
      } catch (err) {
        console.error(err);
        setLoadError("Failed to load the selected problem.");
        reset(emptyDefaults);
      } finally {
        setIsLoadingProblem(false);
      }
    };

    fetchProblem();
  }, [selectedProblemId, reset]);

  const onSubmit = async (data) => {
    if (!selectedProblemId) return;

    try {
      setIsSubmitting(true);
      console.log("Updating:", JSON.stringify(data, null, 2));

      // NOTE: adjust this endpoint to match your backend's update route.
      const response = await axiosClient.put(`/problem/update/${selectedProblemId}`, data);
      console.log("Update response:", response.data);

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err?.response?.data || "Failed to update problem. Please try again.";
      alert(typeof message === "string" ? message : "Failed to update problem. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMonacoLanguage = (language) => {
    switch (language) {
      case "C++":
        return "cpp";
      case "Java":
        return "java";
      case "JavaScript":
        return "javascript";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 size={20} />
          Problem updated successfully! Redirecting...
        </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Header */}
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <h1 className="text-4xl font-bold mt-6">
          Update Problem
        </h1>

        <p className="text-gray-400 mt-2">
          Select an existing problem and edit its details.
        </p>

        {/* ================= PROBLEM SELECTOR ================= */}
        <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

          <div className="flex items-center gap-3 mb-8">
            <ListChecks className="text-violet-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold">Select Problem</h2>
              <p className="text-gray-400 text-sm">
                Choose which problem you want to edit.
              </p>
            </div>
          </div>

          {loadError && (
            <p className="text-red-500 mb-4 text-sm">{loadError}</p>
          )}

          <select
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            disabled={isLoadingProblems}
            className="
              w-full
              rounded-xl
              border
              border-[#30363D]
              bg-[#0D1117]
              px-4
              py-3
              text-white
              focus:outline-none
              focus:border-violet-500
              disabled:opacity-50
            "
          >
            <option value="">
              {isLoadingProblems ? "Loading problems..." : "-- Select a problem --"}
            </option>
            {problems.map((problem) => (
              <option key={problem._id} value={problem._id}>
                {problem.title} ({problem.difficulty})
              </option>
            ))}
          </select>

          {isLoadingProblem && (
            <div className="flex items-center gap-2 text-gray-400 mt-4 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading problem details...
            </div>
          )}
        </div>

        {/* The rest of the form only renders once a problem is selected and loaded */}
        {selectedProblemId && !isLoadingProblem && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10"
          >
            {/* Problem Details */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

              <div className="flex items-center gap-3 mb-8">
                <FileText className="text-violet-500" size={28} />
                <div>
                  <h2 className="text-2xl font-bold">Problem Details</h2>
                  <p className="text-gray-400 text-sm">
                    Basic information about the coding problem.
                  </p>
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-semibold text-gray-300">
                  Problem Title
                </label>
                <input
                  {...register("title")}
                  placeholder="Reverse a String"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#30363D]
                    bg-[#0D1117]
                    px-4
                    py-3
                    text-white
                    placeholder:text-gray-500
                    focus:outline-none
                    focus:border-violet-500
                  "
                />
                {errors.title && (
                  <p className="text-red-500 mt-2 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  rows={10}
                  {...register("description")}
                  placeholder="Describe the problem..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-[#30363D]
                    bg-[#0D1117]
                    px-4
                    py-3
                    resize-none
                    text-white
                    placeholder:text-gray-500
                    focus:outline-none
                    focus:border-violet-500
                  "
                />
                {errors.description && (
                  <p className="text-red-500 mt-2 text-sm">{errors.description.message}</p>
                )}
              </div>

              {/* Difficulty */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-semibold text-gray-300">
                  Difficulty
                </label>
                <Controller
                  control={control}
                  name="difficulty"
                  render={({ field }) => (
                    <div className="flex gap-4">
                      {difficulties.map((difficulty) => (
                        <button
                          type="button"
                          key={difficulty.value}
                          onClick={() => field.onChange(difficulty.value)}
                          className={`
                            flex items-center gap-3
                            px-6
                            py-3
                            rounded-xl
                            border
                            transition
                            ${
                              field.value === difficulty.value
                                ? "border-violet-500 bg-violet-500/20"
                                : "border-[#30363D] hover:border-violet-500"
                            }
                          `}
                        >
                          <div className={`w-3 h-3 rounded-full ${difficulty.color}`} />
                          {difficulty.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-300">
                  Topic
                </label>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <div>
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => field.onChange(tag)}
                            className={`
                              px-5
                              py-2.5
                              rounded-full
                              border
                              transition
                              ${
                                field.value === tag
                                  ? "bg-violet-500 border-violet-500 text-white"
                                  : "border-[#30363D] text-gray-300 hover:border-violet-500"
                              }
                            `}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      {errors.tags && (
                        <p className="text-red-500 mt-2 text-sm">{errors.tags.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* ================= TEST CASES ================= */}
            <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

              <div className="flex items-center gap-3 mb-8">
                <TestTube2 size={28} className="text-violet-500" />
                <div>
                  <h2 className="text-2xl font-bold">Test Cases</h2>
                  <p className="text-gray-400 text-sm">
                    Edit visible and hidden test cases.
                  </p>
                </div>
              </div>

              {/* ================= Visible ================= */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Eye size={22} className="text-green-400" />
                    <h3 className="text-xl font-semibold">Visible Test Cases</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      appendVisible({ input: "", output: "", explanation: "" })
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-xl
                      bg-violet-600
                      hover:bg-violet-700
                      transition
                    "
                  >
                    <Plus size={18} />
                    Add Case
                  </button>
                </div>

                <div className="space-y-6">
                  {visibleFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-[#30363D] bg-[#0D1117] p-6"
                    >
                      <div className="flex justify-between items-center mb-5">
                        <h4 className="font-semibold text-lg">Visible Case #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeVisible(index)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block mb-2 text-sm text-gray-400">Input</label>
                          <textarea
                            rows={3}
                            {...register(`visibleTestCases.${index}.input`)}
                            className="
                              w-full
                              rounded-lg
                              bg-[#161B22]
                              border
                              border-[#30363D]
                              p-3
                              resize-none
                              focus:outline-none
                              focus:border-violet-500
                            "
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm text-gray-400">Output</label>
                          <textarea
                            rows={3}
                            {...register(`visibleTestCases.${index}.output`)}
                            className="
                              w-full
                              rounded-lg
                              bg-[#161B22]
                              border
                              border-[#30363D]
                              p-3
                              resize-none
                              focus:outline-none
                              focus:border-violet-500
                            "
                          />
                        </div>

                        <div>
                          <label className="block mb-2 text-sm text-gray-400">Explanation</label>
                          <textarea
                            rows={4}
                            {...register(`visibleTestCases.${index}.explanation`)}
                            className="
                              w-full
                              rounded-lg
                              bg-[#161B22]
                              border
                              border-[#30363D]
                              p-3
                              resize-none
                              focus:outline-none
                              focus:border-violet-500
                            "
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= Hidden ================= */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <EyeOff size={22} className="text-red-400" />
                    <h3 className="text-xl font-semibold">Hidden Test Cases</h3>
                    <span className="text-sm text-gray-400">
                      ({hiddenFields.length} total)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendHidden({ input: "", output: "" })}
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-xl
                      bg-violet-600
                      hover:bg-violet-700
                      transition
                    "
                  >
                    <Plus size={18} />
                    Add Case
                  </button>
                </div>

                {/* Collapsed by default — with many hidden cases, mounting a
                    full input/output pair of textareas for every single one
                    is what was making this section unusable. Each case now
                    only renders its editable fields once expanded. */}
                <div className="space-y-3">
                  {hiddenFields.map((field, index) => {
                    const isOpen = expandedHidden.has(field.id);
                    return (
                      <div
                        key={field.id}
                        className="rounded-xl border border-[#30363D] bg-[#0D1117] overflow-hidden"
                      >
                        <div className="flex justify-between items-center px-6 py-4">
                          <button
                            type="button"
                            onClick={() => toggleHidden(field.id)}
                            className="flex items-center gap-2 font-semibold text-lg"
                          >
                            {isOpen ? (
                              <ChevronDown size={18} className="text-gray-400" />
                            ) : (
                              <ChevronRight size={18} className="text-gray-400" />
                            )}
                            Hidden Case #{index + 1}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeHidden(index)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {isOpen && (
                          <div className="space-y-5 px-6 pb-6">
                            <div>
                              <label className="block mb-2 text-sm text-gray-400">Input</label>
                              <textarea
                                rows={3}
                                {...register(`hiddenTestCases.${index}.input`)}
                                className="
                                  w-full
                                  rounded-lg
                                  bg-[#161B22]
                                  border
                                  border-[#30363D]
                                  p-3
                                  resize-none
                                  focus:outline-none
                                  focus:border-violet-500
                                "
                              />
                            </div>

                            <div>
                              <label className="block mb-2 text-sm text-gray-400">Output</label>
                              <textarea
                                rows={3}
                                {...register(`hiddenTestCases.${index}.output`)}
                                className="
                                  w-full
                                  rounded-lg
                                  bg-[#161B22]
                                  border
                                  border-[#30363D]
                                  p-3
                                  resize-none
                                  focus:outline-none
                                  focus:border-violet-500
                                "
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= CODE SECTION ================= */}
            <div className="mt-10 space-y-10">
              {[
                {
                  title: "Starter Code",
                  icon: <Code2 size={26} className="text-violet-500" />,
                  field: "startCode",
                  valueKey: "initialCode"
                },
                {
                  title: "Reference Solution",
                  icon: <CheckCircle2 size={26} className="text-green-500" />,
                  field: "referenceSolution",
                  valueKey: "completeCode"
                }
              ].map((section) => (
                <div
                  key={section.title}
                  className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    {section.icon}
                    <div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                      <p className="text-gray-400 text-sm">
                        {section.title === "Starter Code"
                          ? "Boilerplate code for every language."
                          : "Official solution used by the CodeForge."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {[0, 1, 2].map((index) => {
                      const language =
                        index === 0 ? "C++" : index === 1 ? "Java" : "JavaScript";

                      return (
                        <div
                          key={language}
                          className="border border-[#30363D] rounded-xl overflow-hidden"
                        >
                          {/* Header */}
                          <div className="
                            bg-[#0D1117]
                            border-b
                            border-[#30363D]
                            px-5
                            py-3
                            flex
                            items-center
                            justify-between
                          ">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-violet-500" />
                              <span className="font-medium">{language}</span>
                            </div>
                          </div>

                          {/* Monaco */}
                          <Editor
                            height="350px"
                            language={getMonacoLanguage(language)}
                            theme="vs-dark"
                            value={watch(`${section.field}.${index}.${section.valueKey}`)}
                            onChange={(value) => {
                              setValue(
                                `${section.field}.${index}.${section.valueKey}`,
                                value || ""
                              );
                            }}
                            options={{
                              fontSize: 15,
                              minimap: { enabled: false },
                              automaticLayout: true,
                              scrollBeyondLastLine: false,
                              wordWrap: "on",
                              tabSize: 4,
                              padding: { top: 20 }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed rounded-xl font-semibold transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating Problem...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Update Problem
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminUpdatePanel;