import { useState } from "react";
import { 
  FaRocket, 
  FaShieldAlt, 
  FaRobot, 
  FaUndoAlt,
  FaCode,
  FaBookOpen,
  FaTimes,
  FaDownload,
  FaSun,
  FaMoon
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";
import CodeBlock from "../components/CodeBlock";
import api, { BACKEND_URL } from "../services/api";

export default function Dashboard() {
  // Cleared prepopulated strings per instructions
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("Python");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  const [generatedCodeMD, setGeneratedCodeMD] = useState("");
  const [optimizedCodeMD, setOptimizedCodeMD] = useState("");
  const [history, setHistory] = useState([]);
  const [studyNotes, setStudyNotes] = useState("");
  const [savedSessionId, setSavedSessionId] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Dynamic Theme Class Bundles
  const bgClass = isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#080c14] text-slate-100";
  const cardClass = isLightMode ? "bg-white border-slate-200" : "bg-[#0b0f19] border-white/5";
  const borderClass = isLightMode ? "border-slate-200" : "border-white/5";
  const textClass = isLightMode ? "text-slate-900" : "text-slate-100";
  const mutedClass = isLightMode ? "text-slate-500" : "text-slate-400";
  const selectClass = isLightMode ? "bg-slate-100 border-slate-300 text-slate-900" : "bg-[#0f172a] border-white/10 text-slate-300";
  const btnResetClass = isLightMode ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200" : "bg-slate-800 border-white/10 text-slate-300 hover:bg-slate-700";

  // Dynamic utility to clean up complexity notation
  function cleanComplexity(text) {
    if (!text) return "";
    let cleaned = text.replace(/[*#`:-]/g, "").trim();
    cleaned = cleaned.replace(/^(Time|Space)\s*Complexity\s*(is|:)?\s*/gi, "");
    cleaned = cleaned.replace(/^The\s*(time|space)\s*complexity\s*(of\s*this\s*solution\s*)?(is)?\s*/gi, "");
    if (cleaned.length > 25) {
      return cleaned.substring(0, 22) + "...";
    }
    return cleaned;
  }

  // Parsers to extract segments from AI raw outputs
  function parseBeginnerMarkdown(md) {
    if (!md) return {};
    const approachMatch = md.match(/#\s*Approach\s*([\s\S]*?)(?:#\s*Generated Code|---)/i);
    const codeBlockMatch = md.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const timeMatch = md.match(/#\s*Time Complexity\s*([\s\S]*?)(?:#\s*Space Complexity|---|$)/i);
    const spaceMatch = md.match(/#\s*Space Complexity\s*([\s\S]*?)(?:---|$)/i);

    return {
      approach: approachMatch ? approachMatch[1].trim() : "",
      code: codeBlockMatch ? codeBlockMatch[1].trim() : "",
      time: timeMatch ? cleanComplexity(timeMatch[1]) : "",
      space: spaceMatch ? cleanComplexity(spaceMatch[1]) : "",
    };
  }

  function parseProfessionalMarkdown(md) {
    if (!md) return {};
    const whyBetterMatch = md.match(/(?:##\s*Why is it Better\??|#\s*Why is this better\??)\s*([\s\S]*?)(?:##\s*Professional Code|---)/i);
    const codeBlockMatch = md.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const timeMatch = md.match(/(?:##|#)\s*Time Complexity\s*([\s\S]*?)(?:(?:##|#)\s*Space Complexity|---|$)/i);
    const spaceMatch = md.match(/(?:##|#)\s*Space Complexity\s*([\s\S]*?)(?:---|$)/i);

    return {
      whyBetter: whyBetterMatch ? whyBetterMatch[1].trim() : "",
      code: codeBlockMatch ? codeBlockMatch[1].trim() : "",
      time: timeMatch ? cleanComplexity(timeMatch[1]) : "",
      space: spaceMatch ? cleanComplexity(spaceMatch[1]) : "",
    };
  }

  const beginner = parseBeginnerMarkdown(generatedCodeMD);
  const professional = parseProfessionalMarkdown(optimizedCodeMD);

  function validateProblem(text) {
    const lower = text.toLowerCase();
    const invalid = ["hello", "hi", "weather", "movie", "song", "joke"];
    return !invalid.some((item) => lower.includes(item));
  }

  async function handleGenerate() {
    if (!problem.trim()) {
      alert("Please enter a coding problem.");
      return;
    }

    try {
      setLoading(true);
      setHistory([]);
      setSavedSessionId(null);
      setStudyNotes("");

      const generatedRes = await api.post("/ai/generate", {
        prompt: problem,
        language,
      });
      const bMD = generatedRes.data.code;
      setGeneratedCodeMD(bMD);

      const match = bMD.match(/```[\w]*\n([\s\S]*?)```/);
      const extractedCode = match ? match[1].trim() : bMD;

      const optimizeRes = await api.post("/ai/optimize", {
        code: extractedCode,
        language,
      });
      setOptimizedCodeMD(optimizeRes.data.result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate code solutions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSummarizeAndSave() {
    if (!generatedCodeMD) {
      alert("Please generate code solutions first.");
      return;
    }

    try {
      setSaving(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await api.post("/ai/notes", {
        prompt: problem,
        language,
        code: beginner.code,
        optimizedCode: professional.code,
        history,
      });

      const generatedNotes = res.data.studyNotes;
      setStudyNotes(generatedNotes);

      const formattedHistory = [];
      for (let i = 0; i < history.length; i += 2) {
        if (history[i] && history[i + 1]) {
          formattedHistory.push({
            question: history[i].content,
            answer: history[i + 1].content,
          });
        }
      }

      const saveRes = await api.post("/session/save", {
        userId: user.id || user._id,
        title: problem,
        prompt: problem,
        language,
        generatedCode: generatedCodeMD,
        optimizedCode: optimizedCodeMD,
        chatHistory: formattedHistory,
        studyNotes: generatedNotes,
      });

      setSavedSessionId(saveRes.data.session._id);
      setShowSummaryModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to summarize session.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setProblem("");
    setGeneratedCodeMD("");
    setOptimizedCodeMD("");
    setHistory([]);
    setStudyNotes("");
    setSavedSessionId(null);
  }

  return (
    <div className={`min-h-screen flex overflow-hidden relative transition-colors duration-300 ${bgClass}`}>
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col gap-5 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className={`flex justify-between items-center border-b pb-3 ${borderClass}`}>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-[#6366f1] via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              CodeMentor AI
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className={`p-2.5 rounded-xl border transition ${btnResetClass}`}
              title="Toggle theme"
            >
              {isLightMode ? <FaMoon className="text-base" /> : <FaSun className="text-base" />}
            </button>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium focus:border-indigo-500 cursor-pointer outline-none ${selectClass}`}
            >
              <option value="Python">🐍 Python</option>
              <option value="Java">☕ Java</option>
              <option value="C">🛠️ C</option>
              <option value="C++">💻 C++</option>
              <option value="JavaScript">🌐 JavaScript</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className={`p-2.5 rounded-xl transition flex items-center justify-center border ${btnResetClass}`}
              title="Reset Fields"
            >
              <FaUndoAlt className="text-xs" />
            </button>

            {/* Save & Summarize Button */}
            <button
              onClick={handleSummarizeAndSave}
              disabled={saving || !generatedCodeMD}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg disabled:opacity-40"
            >
              <FaBookOpen className="text-xs" />
              {saving ? "Summarizing..." : "Save & Summarize"}
            </button>

            {/* Generate Action */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <FaWandMagicSparkles className="text-xs" />
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </header>

        {/* Input Box Area */}
        <section className={`border rounded-2xl p-4 relative flex-shrink-0 ${cardClass}`}>
          <span className="block text-[10px] font-bold text-purple-400 tracking-widest uppercase mb-2">
            Coding Problem
          </span>
          <textarea
            rows={2}
            value={problem}
            maxLength={2000}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe your coding problem..."
            className="w-full bg-transparent resize-none text-xs placeholder-slate-500 focus:outline-none leading-relaxed"
          />
          <div className="text-right text-[10px] text-slate-500 mt-1">
            {problem.length} / 2000
          </div>
        </section>

        {/* Stretched 3-Column Workspace Layout */}
        <section className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-5 h-[calc(100vh-230px)] min-h-0">
          
          {/* Column 1: Beginner Friendly Solution */}
          <div className={`border rounded-2xl p-5 flex flex-col justify-between overflow-hidden h-full ${cardClass}`}>
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                  <FaShieldAlt /> Beginner Friendly Solution
                </span>
              </div>
              
              {generatedCodeMD ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1 pb-4 scrollbar-thin">
                  <div className="mb-4">
                    <h4 className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${mutedClass}`}>Approach</h4>
                    <p className={`text-xs leading-relaxed whitespace-pre-line ${textClass}`}>
                      {beginner.approach}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h4 className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${mutedClass}`}>Code</h4>
                    <div className="rounded-xl text-xs">
                      <CodeBlock inline={false} className={`language-${language.toLowerCase()}`}>
                        {beginner.code}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-2 p-4">
                  <FaCode className="text-2xl opacity-40" />
                  <p className="text-xs">Submit a problem above to view the beginner-friendly solution.</p>
                </div>
              )}
            </div>

            {generatedCodeMD && (
              <div className={`flex items-center gap-3 pt-4 border-t mt-auto flex-shrink-0 ${borderClass}`}>
                <span className="text-[10px] font-bold py-2 px-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm uppercase tracking-wider whitespace-nowrap">
                  Time: {beginner.time || "N/A"}
                </span>
                <span className="text-[10px] font-bold py-2 px-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm uppercase tracking-wider whitespace-nowrap">
                  Space: {beginner.space || "O(1)"}
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Professional Solution */}
          <div className={`border rounded-2xl p-5 flex flex-col justify-between overflow-hidden h-full ${cardClass}`}>
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <span className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                  <FaRocket /> Professional Solution
                </span>
              </div>

              {optimizedCodeMD ? (
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pr-1 pb-4 scrollbar-thin">
                  <div className="mb-4">
                    <h4 className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${mutedClass}`}>Why this is better?</h4>
                    <p className={`text-xs leading-relaxed ${textClass}`}>
                      {professional.whyBetter}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h4 className={`text-[10px] font-bold tracking-wider uppercase mb-1 ${mutedClass}`}>Code</h4>
                    <div className="rounded-xl text-xs">
                      <CodeBlock inline={false} className={`language-${language.toLowerCase()}`}>
                        {professional.code}
                      </CodeBlock>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 gap-2 p-4">
                  <FaRocket className="text-2xl opacity-40" />
                  <p className="text-xs">The optimized professional solution will appear here.</p>
                </div>
              )}
            </div>

            {optimizedCodeMD && (
              <div className={`flex items-center gap-3 pt-4 border-t mt-auto flex-shrink-0 ${borderClass}`}>
                <span className="text-[10px] font-bold py-2 px-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm uppercase tracking-wider whitespace-nowrap">
                  Time: {professional.time || "N/A"}
                </span>
                <span className="text-[10px] font-bold py-2 px-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm uppercase tracking-wider whitespace-nowrap">
                  Space: {professional.space || "O(1)"}
                </span>
              </div>
            )}
          </div>

          {/* Column 3: AI Mentor with Dynamic Light/Dark variables */}
          <div className={`border rounded-2xl p-5 flex flex-col overflow-hidden h-full ${cardClass}`}>
            <div className={`flex items-center gap-2 mb-3 border-b pb-2 flex-shrink-0 ${borderClass}`}>
              <span className="flex items-center gap-2 text-[10px] font-bold text-[#8b5cf6] tracking-wider uppercase">
                <FaRobot /> AI Mentor
              </span>
            </div>

            <div className="flex-1 min-h-0">
              <ChatPanel
                code={professional.code || beginner.code}
                prompt={problem}
                language={language}
                optimizedCode={professional.code}
                history={history}
                setHistory={setHistory}
                isLightMode={isLightMode}
              />
            </div>
          </div>

        </section>
      </main>

      {/* Summary revision Notes Modal & download PDF link */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0b1324] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-indigo-400 text-lg" />
                <h3 className="font-bold text-base text-slate-100">Study Notes & Revision Plan</h3>
              </div>
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-300 text-xs leading-relaxed space-y-4 scrollbar-thin">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h4 className="font-semibold text-slate-100 mb-2 uppercase text-[10px] tracking-wider text-indigo-300">Generated Study Notes</h4>
                <p className="whitespace-pre-line">{studyNotes}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 flex gap-3 justify-end bg-slate-900/40">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
              >
                Close
              </button>
              {savedSessionId && (
                <a
                  href={`${BACKEND_URL}/api/pdf/${savedSessionId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs transition flex items-center gap-2 font-semibold shadow-lg shadow-indigo-600/10"
                >
                  <FaDownload className="text-[10px]" />
                  Download PDF
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}