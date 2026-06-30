import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Message from "./Message";

export default function ChatPanel({
  code,
  prompt,
  language,
  optimizedCode,
  history,
  setHistory,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [history, loading]);

  const askAI = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    const updated = [...history, userMessage];
    setHistory(updated);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/ai/mentor", {
        code,
        history: updated,
        question,
      });

      setHistory((prev) => [...prev, {
        role: "assistant",
        content: res.data.answer,
      }]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to compile response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateNotes = async () => {
    try {
      setLoading(true);
      setSaving(true);

      const res = await api.post("/ai/notes", {
        prompt,
        language,
        code,
        optimizedCode: optimizedCode || "",
        history,
      });

      setNotes(res.data.studyNotes);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;

      await api.post("/session/save", {
        userId,
        title: prompt,
        prompt,
        language,
        generatedCode: code,
        optimizedCode: optimizedCode || "",
        chatHistory: history,
        studyNotes: res.data.studyNotes,
      });
      
      alert("Revision notes created and saved successfully.");
    } catch {
      alert("Failed to compile notes.");
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Scrollable box */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[320px]">
        {history.length === 0 ? (
          <div className="text-center py-16 space-y-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Active</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              Query variable functions, loop structures, or save dynamic notes.
            </p>
          </div>
        ) : (
          history.map((msg, index) => <Message key={index} message={msg} />)
        )}
        {loading && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
            Compiling...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Inputs box */}
      <div className="border-t border-slate-200 pt-4 mt-auto">
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              askAI();
            }
          }}
          placeholder="Ask why this loop works, request a dry run..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-xs focus:border-blue-500 focus:bg-white outline-none resize-none transition"
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={askAI}
            className="bg-slate-100 hover:bg-slate-200/85 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition active:scale-[0.98]"
          >
            Ask Mentor
          </button>
          <button
            onClick={generateNotes}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? "Compiling..." : "Generate Notes"}
          </button>
        </div>
      </div>

      {notes && (
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-y-auto max-h-[140px]">
          <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Revision Materials</h4>
          <Message message={{ role: "assistant", content: notes }} />
        </div>
      )}
    </div>
  );
}