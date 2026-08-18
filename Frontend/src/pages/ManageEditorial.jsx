import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import axiosClient from "../utils/axiosClient";
import { Save, FileText, Search, ChevronDown, Heading, Bold, Italic, Code, List, Eye, ArrowLeft, Loader2, BookOpen, Sparkles } from "lucide-react";

function ManageEditorial() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [selectedProblemName, setSelectedProblemName] = useState("");
  const [textEditorial, setTextEditorial] = useState("");
  const [loading, setLoading] = useState(false);

  // Search selector state
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProblems();
    // Close dropdown on click outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axiosClient.get("/problem/getAllProblem");
      setProblems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProblemChange = async (problemId, title) => {
    setSelectedProblem(problemId);
    setSelectedProblemName(title);

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

  // Helper to insert markdown tags at cursor position
  const insertMarkdown = (syntaxType) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let cursorOffset = 0;

    switch (syntaxType) {
      case "header":
        replacement = `\n### ${selectedText || "Header"}\n`;
        cursorOffset = 5;
        break;
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffset = 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffset = 1;
        break;
      case "code":
        replacement = `\n\`\`\`javascript\n${selectedText || "// your code here"}\n\`\`\`\n`;
        cursorOffset = 15;
        break;
      case "list":
        replacement = `\n- ${selectedText || "list item"}\n`;
        cursorOffset = 3;
        break;
      case "inline-code":
        replacement = `\`${selectedText || "code"}\``;
        cursorOffset = 1;
        break;
      default:
        break;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setTextEditorial(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + cursorOffset, 
        start + cursorOffset + (selectedText.length || replacement.length - cursorOffset * 2)
      );
    }, 50);
  };

  // Custom parser to translate markdown content into styled HTML safely
  const renderMarkdown = (text) => {
    if (!text) return '<p class="text-zinc-500 italic text-center py-20">Preview will render in real-time as you write...</p>';
    
    // Basic HTML escaping
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-xl font-extrabold text-white mt-6 mb-3 border-b border-zinc-800 pb-1">$1</h1>');

    // Fenced Code block
    html = html.replace(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g, '<pre class="bg-black/50 border border-zinc-800 p-4 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto my-4">$1</pre>');

    // Inline Code
    html = html.replace(/`([^`\n]+)`/g, '<code class="bg-zinc-850 text-zinc-250 px-1.5 py-0.5 rounded font-mono text-[11px] border border-zinc-800">$1</code>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

    // Italics
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-zinc-300">$1</em>');

    // Lists
    html = html.replace(/^[*-] (.*?)$/gm, '<li class="ml-4 list-disc text-zinc-300 my-1">$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-zinc-700 pl-4 py-1 italic text-zinc-400 my-3">$1</blockquote>');

    // Paragraph split
    const blocks = html.split(/(\n\n|<h[1-3]>|<pre>|<\/pre>|<li>|<blockquote>|<\/blockquote>)/);
    html = blocks.map(block => {
      if (!block.trim()) return '';
      if (
        block.startsWith('<h') || 
        block.startsWith('<pre') || 
        block.startsWith('</pre') || 
        block.startsWith('<li') || 
        block.startsWith('<block') || 
        block.startsWith('</block') || 
        block === '\n\n'
      ) {
        return block;
      }
      return `<p class="text-zinc-300 leading-relaxed my-2 text-sm">${block}</p>`;
    }).join('');

    return html;
  };

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.05),rgba(255,255,255,0))] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin"
              className="p-2.5 bg-[#18181b]/60 border border-[#27272a] hover:border-zinc-400 hover:text-white rounded-xl text-zinc-400 transition-all duration-200"
            >
              <ArrowLeft size={18} />
            </NavLink>
            <div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-1">
                <BookOpen size={12} />
                Content Studio
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Editorial Workspace
              </h1>
            </div>
          </div>

          {/* Action Button */}
          {selectedProblem && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-lg shadow-zinc-500/5 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-zinc-950" size={18} />
                  Saving Editorial...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Editorial
                </>
              )}
            </button>
          )}
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Settings / Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-2xl p-6 shadow-xl space-y-5">
              
              <div className="flex items-center gap-2 pb-3 border-b border-[#27272a]">
                <FileText size={18} className="text-zinc-400" />
                <h3 className="font-bold text-white">Select Problem</h3>
              </div>

              {/* Searchable dropdown custom wrapper */}
              <div ref={dropdownRef} className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
                  Target Problem
                </label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex justify-between items-center bg-[#18181b]/60 border border-[#27272a] hover:border-zinc-400 rounded-xl px-4 py-3.5 text-white text-sm transition duration-150 focus:outline-none text-left"
                  >
                    <span className="truncate">{selectedProblemName || "Choose problem to write for..."}</span>
                    <ChevronDown size={16} className={`text-zinc-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#09090b]/95 border border-[#27272a] rounded-xl shadow-2xl p-3 space-y-2 max-w-full backdrop-blur-md">
                      <div className="relative">
                        <Search className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 w-4 h-4 mt-2.5" />
                        <input 
                          type="text"
                          placeholder="Filter problems..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-[#18181b]/60 border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-[#27272a]/30 pr-1">
                        {filteredProblems.length > 0 ? (
                          filteredProblems.map(p => (
                            <button
                              key={p._id}
                              type="button"
                              onClick={() => {
                                handleProblemChange(p._id, p.title);
                                setIsOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 text-sm text-zinc-300 hover:bg-[#18181b] hover:text-white rounded-lg transition truncate"
                            >
                              {p.title}
                            </button>
                          ))
                        ) : (
                          <div className="text-zinc-500 text-xs py-4 text-center">No matching problems</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guidelines panel */}
              <div className="bg-[#18181b]/30 border border-[#27272a]/60 rounded-xl p-4 text-xs text-zinc-400 space-y-2">
                <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={13} className="text-zinc-400" />
                  Markdown Help
                </h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                  <div># Header 1</div>
                  <div>### Header 3</div>
                  <div>**bold**</div>
                  <div>*italic*</div>
                  <div>`code`</div>
                  <div>```javascript</div>
                  <div>- List Item</div>
                  <div>&gt; Quote</div>
                </div>
              </div>

            </div>
          </div>

          {/* Split Screen Editor & Preview Workspace */}
          <div className="lg:col-span-3">
            {selectedProblem ? (
              <div className="bg-[#09090b]/80 backdrop-blur-xl border border-[#27272a] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px] transition-all duration-300">
                
                {/* Editor Toolbar Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-[#18181b]/40 border-b border-[#27272a]">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => insertMarkdown("header")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition"
                      title="Header"
                    >
                      <Heading size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("bold")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("italic")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition"
                      title="Italic"
                    >
                      <Italic size={16} />
                    </button>
                    <div className="h-6 border-r border-[#27272a] mx-1"></div>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("code")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition"
                      title="Code Block"
                    >
                      <Code size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("inline-code")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition text-xs font-mono font-bold"
                      title="Inline Code"
                    >
                      `..`
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown("list")}
                      className="p-2 border border-transparent hover:border-zinc-700 hover:bg-zinc-800/40 rounded-lg text-zinc-400 hover:text-white transition"
                      title="Bullet List"
                    >
                      <List size={16} />
                    </button>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={12} />
                    Live Sync Enabled
                  </span>
                </div>

                {/* Editor Split Windows */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#27272a] overflow-hidden">
                  
                  {/* Markdown Text Editor Area */}
                  <div className="flex flex-col h-full overflow-hidden p-4">
                    <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Editor (Markdown)</div>
                    <textarea
                      ref={textareaRef}
                      className="w-full flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                      placeholder="Start drafting your problem editorial using markdown tags here..."
                      value={textEditorial}
                      onChange={(e) => setTextEditorial(e.target.value)}
                    />
                  </div>

                  {/* Rendered Live HTML Preview Area */}
                  <div className="flex flex-col h-full overflow-hidden p-4 bg-[#18181b]/15">
                    <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Live Preview</div>
                    <div 
                      className="flex-1 overflow-y-auto pr-1"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(textEditorial) }}
                    />
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-[#09090b]/40 border border-[#27272a] rounded-2xl h-[450px] flex flex-col items-center justify-center text-center p-8">
                <FileText size={48} className="text-zinc-600 mb-4" />
                <h3 className="text-lg font-bold text-white mb-1.5">No Problem Selected</h3>
                <p className="text-zinc-400 text-sm max-w-sm">
                  Please search and choose a problem from the left sidebar to open the editorial workspace.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ManageEditorial;