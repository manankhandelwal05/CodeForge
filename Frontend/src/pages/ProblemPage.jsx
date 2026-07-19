import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { Sparkles, Trash2 } from "lucide-react";
const langMap = {
        cpp: 'c++',
        java: 'java',
        javascript: 'javascript'
};

const LANGUAGES = ['javascript', 'java', 'cpp','c++', 'C++'];

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const navigate = useNavigate();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {

        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        console.table(response.data.startCode);
// console.log(selectedLanguage);
// console.log(langMap[selectedLanguage]);

        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);

        setCode(initialCode);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });
      // console.log("Submission response:", response.data);

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');

    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });
      console.log("Submission response:", response.data);

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');

    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 border-green-500/40 bg-green-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10';
      case 'hard': return 'text-red-500 border-red-500/40 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/40 bg-gray-500/10';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f0f10]">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  const leftTabs = [
    { key: 'description', label: 'Description' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'solutions', label: 'Solutions' },
    { key: 'submissions', label: 'Submissions' },
    { key: 'chatAI', label: 'ChatAI' },
  ];

  const rightTabs = [
    { key: 'code', label: 'Code' },
    { key: 'testcase', label: 'Testcase' },
    { key: 'result', label: 'Result' },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0f0f10] text-gray-200">
      {/* Page Header (replaces the old top navbar) */}
      {problem && (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 bg-[#141416]">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-white"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-lg font-semibold text-white">{problem.title}</h1>
          <div className={`badge badge-outline text-xs px-3 py-3 ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </div>
          <div className="badge bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs px-3 py-3">
            {problem.tags}
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-800">
          {/* Left Tabs */}
          <div className="flex gap-1 px-4 pt-2 bg-[#141416] border-b border-gray-800">
            {leftTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeLeftTab === tab.key
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => setActiveLeftTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div>
                    <div className="prose max-w-none prose-invert">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
                        {problem.description}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-base font-semibold mb-4 text-white">Examples</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-[#1a1a1c] border border-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2 text-sm text-gray-200">Example {index + 1}</h4>
                            <div className="space-y-1.5 text-xs font-mono text-gray-400">
                              <div><span className="text-gray-500">Input:</span> {example.input}</div>
                              <div><span className="text-gray-500">Output:</span> {example.output}</div>
                              <div><span className="text-gray-500">Explanation:</span> {example.explanation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div className="prose max-w-none prose-invert">
                    <h2 className="text-lg font-bold mb-4 text-white">Editorial</h2>
                    <div className="text-sm leading-relaxed">
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} textEditorial={problem.textEditorial} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div>
                    <h2 className="text-lg font-bold mb-4 text-white">Solutions</h2>
                    <div className="space-y-6">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
                          <div className="bg-[#1a1a1c] px-4 py-2 border-b border-gray-800">
                            <h3 className="font-semibold text-sm text-gray-200">{problem?.title} - {solution?.language}</h3>
                          </div>
                          <div className="p-4 bg-[#141416]">
                            <pre className="text-xs overflow-x-auto text-gray-300">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || <p className="text-gray-500 text-sm">Solutions will be available after you solve the problem.</p>}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div>
                    <h2 className="text-lg font-bold mb-4 text-white">My Submissions</h2>
                    <div className="text-gray-400">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === "chatAI" && (
  <div className="h-full flex flex-col bg-[#080202]">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-[#30363D]">

      <div>
        <div className="flex items-center gap-3">
          <Sparkles
    size={30}
    className="text-violet-500"
/>

          <div>
            <h2 className="text-2xl font-bold text-white">
              AI Assistant
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Ask anything about this problem
            </p>
          </div>
        </div>
      </div>

      {/* <button className="px-4 py-2 rounded-lg border border-[#30363D] hover:bg-[#21262D] transition text-gray-300 text-sm ">
        <Trash2 size={18} />
<span>Clear Chat</span>
      </button> */}

    </div>

    {/* Chat Area */}
    <div className="flex-1 overflow-hidden">

      <ChatAi problem={problem} />

    </div>

  </div>
)}
              </>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Right Tabs */}
          <div className="flex gap-1 px-4 pt-2 bg-[#141416] border-b border-gray-800">
            {rightTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeRightTab === tab.key
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => setActiveRightTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Language Selector */}
               {/* Language Selector */}
<div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#141416]">

  <select
    value={selectedLanguage}
    onChange={(e) => handleLanguageChange(e.target.value)}
    className="bg-[#1E1E1E] border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="javascript">JavaScript</option>
    <option value="java">Java</option>
    <option value="cpp">C++</option>
  </select>

</div>

                {/* Monaco Editor */}
                <div className="flex-1 min-h-0">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t border-gray-800 bg-[#141416] flex justify-between items-center">
                  <button
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:bg-gray-800"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    Console
                  </button>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-1.5 rounded-md text-xs font-medium border border-gray-700 text-gray-200 hover:bg-gray-800 flex items-center gap-1.5 ${loading ? 'opacity-60' : ''}`}
                      onClick={handleRun}
                      disabled={loading}
                    >
                      ▶ Run
                    </button>
                    <button
                      className={`px-4 py-1.5 rounded-md text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600 flex items-center gap-1.5 ${loading ? 'opacity-60' : ''}`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                    >
                      ➤ Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4 text-sm text-gray-200">Test Results</h3>
                {runResult ? (
                  <div className={`rounded-lg p-4 mb-4 border ${runResult.success ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div>
                      {runResult.success ? (
                        <div>
                          <h4 className="font-bold text-sm text-green-400">✅ All test cases passed!</h4>
                          <p className="text-xs mt-2 text-gray-400">Runtime: {runResult.runtime + " sec"}</p>
                          <p className="text-xs text-gray-400">Memory: {runResult.memory + " KB"}</p>

                          <div className="mt-4 space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-[#1a1a1c] border border-gray-800 p-3 rounded text-xs">
                                <div className="font-mono text-gray-400">
                                  <div><span className="text-gray-500">Input:</span> {tc.stdin}</div>
                                  <div><span className="text-gray-500">Expected:</span> {tc.expected_output}</div>
                                  <div><span className="text-gray-500">Output:</span> {tc.stdout}</div>
                                  <div className="text-green-500">✓ Passed</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-sm text-red-400">❌ Error</h4>
                          <div className="mt-4 space-y-2">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-[#1a1a1c] border border-gray-800 p-3 rounded text-xs">
                                <div className="font-mono text-gray-400">
                                  <div><span className="text-gray-500">Input:</span> {tc.stdin}</div>
                                  <div><span className="text-gray-500">Expected:</span> {tc.expected_output}</div>
                                  <div><span className="text-gray-500">Output:</span> {tc.stdout}</div>
                                  <div className={tc.status_id == 3 ? 'text-green-500' : 'text-red-500'}>
                                    {tc.status_id == 3 ? '✓ Passed' : '✗ Failed'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Click "Run" to test your code with the example test cases.
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="font-semibold mb-4 text-sm text-gray-200">Submission Result</h3>
                {submitResult ? (
                  <div className={`rounded-lg p-4 border ${submitResult.status ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div>
                      {submitResult.status ? (
                        <div>
                          <h4 className="font-bold text-base text-green-400">🎉 Accepted</h4>
                          <div className="mt-4 space-y-1.5 text-sm text-gray-300">
                            <p>Test Cases Passed: {submitResult.testCasesPassed
}/{submitResult.
testCasesTotal}</p>
                            <p>Runtime: {submitResult.runtime + " sec"}</p>
                            <p>Memory: {submitResult.memory + "KB"}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-base text-red-400">❌ {submitResult.error}</h4>
                          <div className="mt-4 space-y-1.5 text-sm text-gray-300">
                            {/* console.log(submitResult); */}
                            <p>Runtime: {submitResult.runtime + " sec"}</p>
                            <p>Memory: {submitResult.memory + "KB"}</p>
                            <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Click "Submit" to submit your solution for evaluation.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;