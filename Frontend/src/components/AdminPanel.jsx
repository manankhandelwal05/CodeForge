// import React, { useState } from "react";
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
// } from "lucide-react";

// // Zod schema matching the problem schema
// const problemSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   difficulty: z.enum(['easy', 'medium', 'hard']),
//   tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
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

// function AdminPanel() {
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
  
//   const {

//     register,

//     control,

//     handleSubmit,

//     watch,

//     setValue,

//     formState:{errors}

// }=useForm({
//     resolver: zodResolver(problemSchema),
//     defaultValues: {
//       startCode: [
//         { language: 'cpp', initialCode: '' },
//         { language: 'Java', initialCode: '' },
//         { language: 'JavaScript', initialCode: '' }
//       ],
//       referenceSolution: [
//         { language: 'cpp', completeCode: '' },
//         { language: 'Java', completeCode: '' },
//         { language: 'JavaScript', completeCode: '' }
//       ]
//     }
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

// const difficulties = [
//     {
//         value: "easy",
//         label: "Easy",
//         color: "bg-green-500",
//     },
//     {
//         value: "medium",
//         label: "Medium",
//         color: "bg-yellow-500",
//     },
//     {
//         value: "hard",
//         label: "Hard",
//         color: "bg-red-500",
//     },
// ];

// const tags = [
//     "array",
//     "linkedList",
//     "graph",
//     "dp",
//     "string",
//     "tree",
//     "math",
    
//     "greedy",
//     "backtracking",
//     "bitManipulation",
//     "divideAndConquer",
//     // "dynamicProgramming", 
//     "heap",
//     "twoPointers",
//     "binarySearch",
// ];
//   const onSubmit = async (data) => {

//     try {

//         setIsSubmitting(true);
//         console.log("Submitting:", JSON.stringify(data, null, 2));

//         await axiosClient.post("/problem/create", data);

//         setShowSuccess(true);

//         setTimeout(() => {

//             navigate("/admin");

//         }, 2000);

//     }

//     catch (err) {

//         console.error(err);

//         alert("Failed to create problem. Please try again.");

//     }

//     finally {

//         setIsSubmitting(false);

//     }

// };
// const getMonacoLanguage = (language) => {
//     switch (language) {
//         case "C++":
//             return "cpp";
//         case "Java":
//             return "java";
//         case "JavaScript":
//             return "javascript";
//         default:
//             return "plaintext";
//     }
// };
//   return (

// <div className="min-h-screen bg-[#0D1117] text-white">

//     {showSuccess && (

//         <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">

//             <CheckCircle2 size={20} />

//             Problem created successfully! Redirecting...

//         </div>

//     )}

//     <div className="max-w-7xl mx-auto px-8 py-10">

//         {/* Header */}

//         <button
//             onClick={() => navigate("/")}
//             className="flex items-center gap-2 text-gray-400 hover:text-white transition"
//         >
//             <ArrowLeft size={18}/>
//             Dashboard
//         </button>

//         <h1 className="text-4xl font-bold mt-6">
//             Create New Problem
//         </h1>

//         <p className="text-gray-400 mt-2">
//             Build coding challenges for CodeForge users.
//         </p>

//         <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="mt-10"
//         >
//       {/* <h1 className="text-3xl font-bold mb-6">Create New Problem</h1> */}
      
//       {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"> */}
//         {/* Basic Information */}
//         {/* Problem Details */}

// <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//     <div className="flex items-center gap-3 mb-8">

//         <FileText
//             className="text-violet-500"
//             size={28}
//         />

//         <div>

//             <h2 className="text-2xl font-bold">
//                 Problem Details
//             </h2>

//             <p className="text-gray-400 text-sm">
//                 Basic information about the coding problem.
//             </p>

//         </div>

//     </div>

//     {/* Title */}

//     <div className="mb-8">

//         <label className="block mb-3 text-sm font-semibold text-gray-300">

//             Problem Title

//         </label>

//         <input
//             {...register("title")}
//             placeholder="Reverse a String"
//             className="
//             w-full
//             rounded-xl
//             border
//             border-[#30363D]
//             bg-[#0D1117]
//             px-4
//             py-3
//             text-white
//             placeholder:text-gray-500
//             focus:outline-none
//             focus:border-violet-500
//             "
//         />

//         {errors.title && (

//             <p className="text-red-500 mt-2 text-sm">

//                 {errors.title.message}

//             </p>

//         )}

//     </div>

//     {/* Description */}

//     <div className="mb-8">

//         <label className="block mb-3 text-sm font-semibold text-gray-300">

//             Description

//         </label>

//         <textarea
//             rows={10}
//             {...register("description")}
//             placeholder="Describe the problem..."
//             className="
//             w-full
//             rounded-xl
//             border
//             border-[#30363D]
//             bg-[#0D1117]
//             px-4
//             py-3
//             resize-none
//             text-white
//             placeholder:text-gray-500
//             focus:outline-none
//             focus:border-violet-500
//             "
//         />

//         {errors.description && (

//             <p className="text-red-500 mt-2 text-sm">

//                 {errors.description.message}

//             </p>

//         )}

//     </div>

//     {/* Difficulty */}

//     <div className="mb-8">

//         <label className="block mb-3 text-sm font-semibold text-gray-300">

//             Difficulty

//         </label>

//         <Controller
//             control={control}
//             name="difficulty"
//             defaultValue="easy"
//             render={({ field }) => (

//                 <div className="flex gap-4">

//                     {difficulties.map((difficulty)=>(

//                         <button
//                             type="button"
//                             key={difficulty.value}
//                             onClick={()=>field.onChange(difficulty.value)}
//                             className={`
//                             flex items-center gap-3
//                             px-6
//                             py-3
//                             rounded-xl
//                             border
//                             transition
//                             ${
//                                 field.value===difficulty.value
//                                 ? "border-violet-500 bg-violet-500/20"
//                                 : "border-[#30363D] hover:border-violet-500"
//                             }
//                             `}
//                         >

//                             <div
//                                 className={`w-3 h-3 rounded-full ${difficulty.color}`}
//                             />

//                             {difficulty.label}

//                         </button>

//                     ))}

//                 </div>

//             )}
//         />

//     </div>

//     {/* Tag */}

//     <div>

//         <label className="block mb-3 text-sm font-semibold text-gray-300">

//             Topic

//         </label>

//         <Controller
//             control={control}
//             name="tags"
//             defaultValue="array"
//             render={({ field }) => (

//                 <div>

//                     <div className="flex flex-wrap gap-3">

//                         {tags.map((tag)=>(

//                             <button
//                                 key={tag}
//                                 type="button"
//                                 onClick={()=>field.onChange(tag)}
//                                 className={`
//                                 px-5
//                                 py-2.5
//                                 rounded-full
//                                 border
//                                 transition
//                                 ${
//                                     field.value===tag
//                                     ? "bg-violet-500 border-violet-500 text-white"
//                                     : "border-[#30363D] text-gray-300 hover:border-violet-500"
//                                 }
//                                 `}
//                             >

//                                 {tag}

//                             </button>

//                         ))}

//                     </div>

//                     {errors.tags && (

//                         <p className="text-red-500 mt-2 text-sm">

//                             {errors.tags.message}

//                         </p>

//                     )}

//                 </div>

//             )}
//         />

//     </div>

// </div>

//         {/* Test Cases */}
//       {/* ================= TEST CASES ================= */}

// <div className="mt-10 bg-[#161B22] border border-[#30363D] rounded-2xl p-8">

//     <div className="flex items-center gap-3 mb-8">

//         <TestTube2
//             size={28}
//             className="text-violet-500"
//         />

//         <div>

//             <h2 className="text-2xl font-bold">

//                 Test Cases

//             </h2>

//             <p className="text-gray-400 text-sm">

//                 Create visible and hidden test cases.

//             </p>

//         </div>

//     </div>

//     {/* ================= Visible ================= */}

//     <div className="mb-10">

//         <div className="flex items-center justify-between mb-6">

//             <div className="flex items-center gap-3">

//                 <Eye
//                     size={22}
//                     className="text-green-400"
//                 />

//                 <h3 className="text-xl font-semibold">

//                     Visible Test Cases

//                 </h3>

//             </div>

//             <button
//                 type="button"
//                 onClick={() =>
//                     appendVisible({
//                         input: "",
//                         output: "",
//                         explanation: "",
//                     })
//                 }
//                 className="
//                 flex
//                 items-center
//                 gap-2
//                 px-5
//                 py-2.5
//                 rounded-xl
//                 bg-violet-600
//                 hover:bg-violet-700
//                 transition
//                 "
//             >

//                 <Plus size={18}/>

//                 Add Case

//             </button>

//         </div>

//         <div className="space-y-6">

//             {visibleFields.map((field,index)=>(

//                 <div
//                     key={field.id}
//                     className="
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     p-6
//                     "
//                 >

//                     <div className="flex justify-between items-center mb-5">

//                         <h4 className="font-semibold text-lg">

//                             Visible Case #{index+1}

//                         </h4>

//                         <button
//                             type="button"
//                             onClick={()=>removeVisible(index)}
//                             className="
//                             p-2
//                             rounded-lg
//                             text-red-400
//                             hover:bg-red-500/20
//                             transition
//                             "
//                         >

//                             <Trash2 size={18}/>

//                         </button>

//                     </div>

//                     <div className="space-y-5">

//                         <div>

//                             <label className="block mb-2 text-sm text-gray-400">

//                                 Input

//                             </label>

//                             <textarea
//                                 rows={3}
//                                 {...register(`visibleTestCases.${index}.input`)}
//                                 className="
//                                 w-full
//                                 rounded-lg
//                                 bg-[#161B22]
//                                 border
//                                 border-[#30363D]
//                                 p-3
//                                 resize-none
//                                 focus:outline-none
//                                 focus:border-violet-500
//                                 "
//                             />

//                         </div>

//                         <div>

//                             <label className="block mb-2 text-sm text-gray-400">

//                                 Output

//                             </label>

//                             <textarea
//                                 rows={3}
//                                 {...register(`visibleTestCases.${index}.output`)}
//                                 className="
//                                 w-full
//                                 rounded-lg
//                                 bg-[#161B22]
//                                 border
//                                 border-[#30363D]
//                                 p-3
//                                 resize-none
//                                 focus:outline-none
//                                 focus:border-violet-500
//                                 "
//                             />

//                         </div>

//                         <div>

//                             <label className="block mb-2 text-sm text-gray-400">

//                                 Explanation

//                             </label>

//                             <textarea
//                                 rows={4}
//                                 {...register(`visibleTestCases.${index}.explanation`)}
//                                 className="
//                                 w-full
//                                 rounded-lg
//                                 bg-[#161B22]
//                                 border
//                                 border-[#30363D]
//                                 p-3
//                                 resize-none
//                                 focus:outline-none
//                                 focus:border-violet-500
//                                 "
//                             />

//                         </div>

//                     </div>

//                 </div>

//             ))}

//         </div>

//     </div>

//     {/* ================= Hidden ================= */}

//     <div>

//         <div className="flex items-center justify-between mb-6">

//             <div className="flex items-center gap-3">

//                 <EyeOff
//                     size={22}
//                     className="text-red-400"
//                 />

//                 <h3 className="text-xl font-semibold">

//                     Hidden Test Cases

//                 </h3>

//             </div>

//             <button
//                 type="button"
//                 onClick={() =>
//                     appendHidden({
//                         input:"",
//                         output:"",
//                     })
//                 }
//                 className="
//                 flex
//                 items-center
//                 gap-2
//                 px-5
//                 py-2.5
//                 rounded-xl
//                 bg-violet-600
//                 hover:bg-violet-700
//                 transition
//                 "
//             >

//                 <Plus size={18}/>

//                 Add Case

//             </button>

//         </div>

//         <div className="space-y-6">

//             {hiddenFields.map((field,index)=>(

//                 <div
//                     key={field.id}
//                     className="
//                     rounded-xl
//                     border
//                     border-[#30363D]
//                     bg-[#0D1117]
//                     p-6
//                     "
//                 >

//                     <div className="flex justify-between items-center mb-5">

//                         <h4 className="font-semibold text-lg">

//                             Hidden Case #{index+1}

//                         </h4>

//                         <button
//                             type="button"
//                             onClick={()=>removeHidden(index)}
//                             className="
//                             p-2
//                             rounded-lg
//                             text-red-400
//                             hover:bg-red-500/20
//                             transition
//                             "
//                         >

//                             <Trash2 size={18}/>

//                         </button>

//                     </div>

//                     <div className="space-y-5">

//                         <div>

//                             <label className="block mb-2 text-sm text-gray-400">

//                                 Input

//                             </label>

//                             <textarea
//                                 rows={3}
//                                 {...register(`hiddenTestCases.${index}.input`)}
//                                 className="
//                                 w-full
//                                 rounded-lg
//                                 bg-[#161B22]
//                                 border
//                                 border-[#30363D]
//                                 p-3
//                                 resize-none
//                                 focus:outline-none
//                                 focus:border-violet-500
//                                 "
//                             />

//                         </div>

//                         <div>

//                             <label className="block mb-2 text-sm text-gray-400">

//                                 Output

//                             </label>

//                             <textarea
//                                 rows={3}
//                                 {...register(`hiddenTestCases.${index}.output`)}
//                                 className="
//                                 w-full
//                                 rounded-lg
//                                 bg-[#161B22]
//                                 border
//                                 border-[#30363D]
//                                 p-3
//                                 resize-none
//                                 focus:outline-none
//                                 focus:border-violet-500
//                                 "
//                             />

//                         </div>

//                     </div>

//                 </div>

//             ))}

//         </div>

//     </div>

// </div>
//         {/* Code Templates */}
//         {/* ================= CODE SECTION ================= */}

// <div className="mt-10 space-y-10">

//     {[

//         {
//             title: "Starter Code",
//             icon: <Code2 size={26} className="text-violet-500"/>,
//             field: "startCode",
//             valueKey: "initialCode"
//         },

//         {
//             title: "Reference Solution",
//             icon: <CheckCircle2 size={26} className="text-green-500"/>,
//             field: "referenceSolution",
//             valueKey: "completeCode"
//         }

//     ].map((section)=>(

//         <div
//             key={section.title}
//             className="
//             bg-[#161B22]
//             border
//             border-[#30363D]
//             rounded-2xl
//             p-8
//             "
//         >

//             <div className="flex items-center gap-3 mb-8">

//                 {section.icon}

//                 <div>

//                     <h2 className="text-2xl font-bold">

//                         {section.title}

//                     </h2>

//                     <p className="text-gray-400 text-sm">

//                         {
//                             section.title==="Starter Code"
//                             ? "Provide boilerplate code for every language."
//                             : "Official solution used by the judge."
//                         }

//                     </p>

//                 </div>

//             </div>

//             <div className="space-y-10">

//                 {[0,1,2].map((index)=>{

//                     const language =
//                         index===0
//                         ? "C++"
//                         : index===1
//                         ? "Java"
//                         : "JavaScript";

//                     return(

//                         <div
//                             key={language}
//                             className="
//                             border
//                             border-[#30363D]
//                             rounded-xl
//                             overflow-hidden
//                             "
//                         >

//                             {/* Header */}

//                             <div className="
//                                 bg-[#0D1117]
//                                 border-b
//                                 border-[#30363D]
//                                 px-5
//                                 py-3
//                                 flex
//                                 items-center
//                                 justify-between
//                             ">

//                                 <div className="flex items-center gap-3">

//                                     <div className="
//                                     w-3
//                                     h-3
//                                     rounded-full
//                                     bg-violet-500
//                                     "/>

//                                     <span className="font-medium">

//                                         {language}

//                                     </span>

//                                 </div>

//                             </div>

//                             {/* Monaco */}

//                             <Editor

//                                 height="350px"

//                                 language={getMonacoLanguage(language)}

//                                 theme="vs-dark"

//                                 value={watch(
//                                     `${section.field}.${index}.${section.valueKey}`
//                                 )}

//                                 onChange={(value)=>{

//                                     setValue(
//                                         `${section.field}.${index}.${section.valueKey}`,
//                                         value || ""
//                                     );

//                                 }}

//                                 options={{

//                                     fontSize:15,

//                                     minimap:{
//                                         enabled:false
//                                     },

//                                     automaticLayout:true,

//                                     scrollBeyondLastLine:false,

//                                     wordWrap:"on",

//                                     tabSize:4,

//                                     padding:{
//                                         top:20
//                                     }

//                                 }}

//                             />

//                         </div>

//                     );

//                 })}

//             </div>

//         </div>

//     ))}

// </div>

//         <button 
//             type="submit" 
//             disabled={isSubmitting}
//             className="mt-10 w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 disabled:cursor-not-allowed rounded-xl font-semibold transition"
//         >
//             {isSubmitting ? (
//                 <>
//                     <Loader2 size={18} className="animate-spin" />
//                     Creating Problem...
//                 </>
//             ) : (
//                 <>
//                     <Save size={18} />
//                     Create Problem
//                 </>
//             )}
//         </button>
//       </form>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;








import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';

// Zod schema matching the problem schema
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
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

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
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
    }
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

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register('title')}
                className={`input input-bordered ${errors.title && 'input-error'}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register('description')}
                className={`textarea textarea-bordered h-32 ${errors.description && 'textarea-error'}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register('difficulty')}
                  className={`select select-bordered ${errors.difficulty && 'select-error'}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Tag</span>
                </label>
                <select
                  {...register('tags')}
                  className={`select select-bordered ${errors.tags && 'select-error'}`}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>
            
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
                
                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() => appendHidden({ input: '', output: '' })}
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>
            
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
                
                <input
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className="input input-bordered w-full"
                />
                
                <input
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className="input input-bordered w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          
          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Create Problem
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;