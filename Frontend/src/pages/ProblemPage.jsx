import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { Sparkles, Trash2, ArrowLeft, Play, Terminal, Code } from "lucide-react";
const langMap = {
        cpp: 'c++',
        java: 'java',
        javascript: 'javascript'
};

const LANGUAGES = ['javascript', 'java', 'cpp','c++', 'C++'];

const formatTestCaseInput = (input) => {
  if (!input) return "";
  const str = String(input).trim();
  if (str.includes("\n")) return str;
  
  const spaceIndex = str.indexOf(" ");
  if (spaceIndex === -1) return str;
  
  const firstToken = str.slice(0, spaceIndex);
  const rest = str.slice(spaceIndex + 1).trim();
  
  return `${firstToken}\n${rest}`;
};

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
      <div className="flex justify-center items-center min-h-screen bg-[#09090b]">
        <span className="loading loading-spinner loading-lg text-zinc-400"></span>
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
    <div className="h-screen flex flex-col bg-[#09090b] text-gray-200 font-sans">
      {/* Page Header */}
      {problem && (
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#27272a] bg-[#09090b]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="h-8 w-8 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-gray-400 hover:text-white hover:border-zinc-500 transition duration-200 cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-base font-bold text-white tracking-tight">{problem.title}</h1>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
              problem.difficulty.toLowerCase() === 'easy' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
              problem.difficulty.toLowerCase() === 'medium' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
              'border-rose-500/20 text-rose-400 bg-rose-500/5'
            }`}>
              {problem.difficulty}
            </span>
            <span className="text-[10px] text-gray-400 bg-[#18181b] border border-[#27272a] px-2.5 py-0.5 rounded-full font-semibold">
              {problem.tags}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-[#27272a] bg-[#09090b]">
          {/* Left Tabs */}
          <div className="flex gap-1 px-4 bg-[#09090b] border-b border-[#27272a]">
            {leftTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 cursor-pointer ${
                  activeLeftTab === tab.key
                    ? 'border-white text-white bg-white/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => setActiveLeftTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
            {problem && (
              <>
                {activeLeftTab === 'description' && (
                  <div className="space-y-6">
                    <div className="prose max-w-none prose-invert">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300 font-normal">
                        {problem.description}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#27272a]">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Examples</h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-[#18181b]/50 border border-[#27272a] p-5 rounded-xl shadow-sm">
                            <h4 className="font-bold text-xs text-zinc-300 mb-3 uppercase tracking-wider">Example {index + 1}</h4>
                            <div className="space-y-3 text-xs font-mono text-gray-300">
                              <div className="bg-[#18181b]/70 p-3 rounded-lg border border-[#27272a]/30 whitespace-pre-wrap">
                                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] mr-2 block mb-1 select-none">Input:</span>
                                <span className="text-gray-200">{formatTestCaseInput(example.input)}</span>
                              </div>
                              <div className="bg-[#18181b]/70 p-3 rounded-lg border border-[#27272a]/30 whitespace-pre-wrap">
                                <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] mr-2 block mb-1 select-none">Output:</span>
                                <span className="text-gray-200">{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="p-3 bg-[#18181b]/30 rounded-lg border border-[#27272a]/20 text-gray-400 leading-relaxed whitespace-pre-wrap">
                                  <span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px] mr-2 block mb-1 select-none">Explanation:</span>
                                  {example.explanation}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Editorial Guide</h2>
                    <div className="bg-[#18181b]/50 border border-[#27272a] p-6 rounded-xl text-sm leading-relaxed">
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} textEditorial={problem.textEditorial} />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Reference Solutions</h2>
                    <div className="space-y-6">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div key={index} className="border border-[#27272a] rounded-xl overflow-hidden bg-[#18181b]/30 shadow-lg">
                          <div className="bg-[#18181b] px-5 py-3 border-b border-[#27272a] flex items-center justify-between">
                            <h3 className="font-bold text-xs text-gray-300 uppercase tracking-wider">{solution?.language} Solution</h3>
                          </div>
                          <div className="p-5 overflow-x-auto">
                            <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || <p className="text-gray-500 text-sm italic">Solutions will be available after you solve the problem.</p>}
                    </div>
                  </div>
                )}

                {activeLeftTab === 'submissions' && (
                  <div className="space-y-4">
                    <h2 className="text-base font-bold text-white uppercase tracking-wider mb-2">Submission History</h2>
                    <div className="bg-[#18181b]/50 border border-[#27272a] p-4 rounded-xl text-gray-400">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                )}

                {activeLeftTab === "chatAI" && (
                  <div className="h-full flex flex-col bg-[#09090b]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#09090b]">
                      <div className="flex items-center gap-3">
                        <Sparkles size={20} className="text-zinc-400" />
                        <div>
                          <h2 className="text-sm font-bold text-white uppercase tracking-wider">CODEFORGE AI</h2>
                        </div>
                      </div>
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
        <div className="w-1/2 flex flex-col bg-[#09090b]">
          {/* Right Tabs */}
          <div className="flex gap-1 px-4 bg-[#09090b] border-b border-[#27272a]">
            {rightTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 cursor-pointer ${
                  activeRightTab === tab.key
                    ? 'border-white text-white bg-white/5'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
                onClick={() => setActiveRightTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col min-h-0 bg-[#09090b]">
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
                {/* Language Selector */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-[#27272a]">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-[#09090b] border border-[#27272a] text-gray-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
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
                <div className="p-3 border-t border-[#27272a] bg-[#09090b] flex justify-between items-center">
                  <button
                    className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 hover:bg-[#18181b] rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    <Terminal size={14} />
                    Console
                  </button>
                  <div className="flex gap-2">
                    <button
                      className={`bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-gray-300 text-xs font-semibold px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50`}
                      onClick={handleRun}
                      disabled={loading}
                    >
                      <Play size={12} />
                      Run
                    </button>
                    <button
                      className={`bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50`}
                      onClick={handleSubmitCode}
                      disabled={loading}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeRightTab === 'testcase' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-4">Run Output Console</h3>
                {runResult ? (
                  <div className={`rounded-xl p-5 mb-4 border ${runResult.success ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                    <div>
                      {runResult.success ? (
                        <div>
                          <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">✓ All test cases passed!</h4>
                          <div className="flex items-center gap-4 text-xs mt-2 text-gray-400">
                            <span>Runtime: <strong className="text-gray-200">{runResult.runtime}s</strong></span>
                            <span>Memory: <strong className="text-gray-200">{runResult.memory} KB</strong></span>
                          </div>

                          <div className="mt-5 space-y-3">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg text-xs">
                                <div className="font-mono text-gray-300 space-y-3">
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Input:</span>
                                    <div className="bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 text-gray-200">{formatTestCaseInput(tc.stdin)}</div>
                                  </div>
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Expected Output:</span>
                                    <div className="bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 text-emerald-400">{tc.expected_output}</div>
                                  </div>
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Your Output:</span>
                                    <div className="bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 text-emerald-400">{tc.stdout}</div>
                                  </div>
                                  <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider pt-1">Passed</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-sm text-rose-400 flex items-center gap-2">✗ Test failed</h4>
                          <div className="mt-5 space-y-3">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg text-xs">
                                <div className="font-mono text-gray-300 space-y-3">
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Input:</span>
                                    <div className="bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 text-gray-200">{formatTestCaseInput(tc.stdin)}</div>
                                  </div>
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Expected Output:</span>
                                    <div className="bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 text-emerald-400">{tc.expected_output}</div>
                                  </div>
                                  <div className="whitespace-pre-wrap">
                                    <span className="text-gray-500 font-semibold text-[10px] uppercase block mb-1 select-none">Your Output:</span>
                                    <div className={`bg-[#09090b]/80 p-2.5 rounded border border-[#27272a]/40 ${tc.status_id == 3 ? 'text-emerald-400' : 'text-rose-400'}`}>{tc.stdout}</div>
                                  </div>
                                  <div className={`text-[10px] font-bold uppercase tracking-wider pt-1 ${tc.status_id == 3 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tc.status_id == 3 ? 'Passed' : 'Failed'}
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
                  <div className="text-gray-500 text-xs bg-[#18181b]/50 border border-[#27272a] rounded-xl p-5">
                    Click "Run" to execute your solution against sample test cases.
                  </div>
                )}
              </div>
            )}

            {activeRightTab === 'result' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider mb-4">Submission Verdict</h3>
                {submitResult ? (
                  <div className={`rounded-xl p-5 border ${submitResult.status ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                    <div>
                      {submitResult.status ? (
                        <div>
                          <h4 className="font-extrabold text-lg text-emerald-400">Accepted</h4>
                          <div className="mt-4 space-y-2 text-xs text-gray-300">
                            <div className="flex justify-between border-b border-[#27272a] pb-1.5"><span className="text-gray-500 font-medium">Test Cases Passed:</span><span className="font-bold text-white">{submitResult.testCasesPassed} / {submitResult.testCasesTotal}</span></div>
                            <div className="flex justify-between border-b border-[#27272a] pb-1.5"><span className="text-gray-500 font-medium">Runtime:</span><span className="font-bold text-white">{submitResult.runtime}s</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Memory Usage:</span><span className="font-bold text-white">{submitResult.memory} KB</span></div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-bold text-base text-rose-400">{submitResult.error || "Wrong Answer"}</h4>
                          <div className="mt-4 space-y-2 text-xs text-gray-300">
                            <div className="flex justify-between border-b border-[#27272a] pb-1.5"><span className="text-gray-500 font-medium">Test Cases Passed:</span><span className="font-bold text-white">{submitResult.passedTestCases || 0} / {submitResult.totalTestCases || 0}</span></div>
                            <div className="flex justify-between border-b border-[#27272a] pb-1.5"><span className="text-gray-500 font-medium">Runtime:</span><span className="font-bold text-white">{submitResult.runtime || 0}s</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Memory Usage:</span><span className="font-bold text-white">{submitResult.memory || 0} KB</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-xs bg-[#18181b]/50 border border-[#27272a] rounded-xl p-5">
                    Click "Submit" to run your solution against the full test suite.
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