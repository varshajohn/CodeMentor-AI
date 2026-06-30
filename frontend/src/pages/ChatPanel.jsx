import { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaRegCommentDots } from "react-icons/fa";
import api from "../services/api";
import Message from "./Message";

export default function ChatPanel({
  code,
  prompt,
  language,
  optimizedCode,
  history,
  setHistory,
  isLightMode,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function askAI() {
    if (!question.trim()) return;

    const currentQuestion = question;
    setHistory((prev) => [...prev, { role: "user", content: currentQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ai/mentor", {
        code,
        history,
        question: currentQuestion,
      });

      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to CodeMentor." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Dynamic input theme bundles
  const inputThemeClass = isLightMode 
    ? "bg-slate-100 border-slate-300 text-slate-950 placeholder-slate-400" 
    : "bg-[#090e1a] border-white/5 text-slate-200 placeholder-slate-500";
  const borderClass = isLightMode ? "border-slate-200" : "border-white/5";

  return (
    <div className="flex flex-col h-full justify-between pb-1">
      
      {/* Scrollable conversation thread */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin mb-4 h-[calc(100vh-370px)]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FaRegCommentDots className="text-3xl text-slate-600 mb-2" />
            <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
              Ask me anything about the selected solution.
            </p>
          </div>
        ) : (
          history.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        )}

        {loading && (
          <div className="bg-slate-800/40 border border-white/5 rounded-xl p-3 animate-pulse text-xs text-slate-400 w-fit">
            Tutor is thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Taller text field area for comfortable ask experience */}
      <div className={`pt-4 border-t flex flex-col gap-3 flex-shrink-0 ${borderClass}`}>
        <textarea
          rows={2}
          className={`w-full text-xs rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none border ${inputThemeClass}`}
          placeholder="Ask your AI mentor a coding question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askAI();
            }
          }}
        />
        <div className="flex justify-end flex-shrink-0">
          <button
            onClick={askAI}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <FaPaperPlane className="text-[10px]" />
            <span>Ask Mentor</span>
          </button>
        </div>
      </div>

    </div>
  );
}