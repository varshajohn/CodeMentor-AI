import { useEffect, useRef, useState } from "react";
import {
  FaPaperPlane,
  FaBookOpen,
} from "react-icons/fa";
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

  async function askAI() {
    if (!question.trim()) return;

    const currentQuestion = question;

    setHistory((prev) => [
      ...prev,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

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
        {
          role: "assistant",
          content: res.data.answer,
        },
      ]);
    } catch {
      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function generateNotes() {
    try {
      setSaving(true);

      const res = await api.post("/ai/notes", {
        prompt,
        language,
        code,
        optimizedCode,
        history,
      });

      setNotes(res.data.studyNotes);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const chatHistory = [];

      for (let i = 0; i < history.length; i += 2) {
        if (
          history[i] &&
          history[i + 1]
        ) {
          chatHistory.push({
            question: history[i].content,
            answer: history[i + 1].content,
          });
        }
      }

      await api.post("/session/save", {
        userId: user.id || user._id,
        title: prompt,
        prompt,
        language,
        generatedCode: code,
        optimizedCode,
        chatHistory,
        studyNotes: res.data.studyNotes,
      });

      alert("Study Notes Saved Successfully");
    } catch {
      alert("Failed to generate notes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">

        {history.length === 0 && (

          <div className="flex justify-center items-center h-full text-slate-500">

            Ask me anything about your generated code.

          </div>

        )}

        {history.map((msg, index) => (

          <Message
            key={index}
            message={msg}
          />

        ))}

        {loading && (

          <div className="bg-white/5 rounded-2xl p-4 animate-pulse w-fit">

            AI is thinking...

          </div>

        )}

        <div ref={bottomRef} />

      </div>

      {/* Input */}

      <div className="mt-5">

        <textarea
          rows={3}
          className="input resize-none"
          placeholder="Ask about variables, loops, recursion, dry run..."
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              askAI();
            }
          }}
        />

        <div className="flex gap-4 mt-4">

          <button
            onClick={askAI}
            className="primary-btn flex-1 flex justify-center items-center gap-3"
          >

            <FaPaperPlane />

            Send

          </button>

          <button
            disabled={saving}
            onClick={generateNotes}
            className="secondary-btn flex-1 flex justify-center items-center gap-3"
          >

            <FaBookOpen />

            {saving
              ? "Generating..."
              : "Generate Notes"}

          </button>

        </div>

      </div>

      {notes && (

        <div className="glass rounded-2xl mt-6 p-5 max-h-[250px] overflow-y-auto">

          <Message
            message={{
              role: "assistant",
              content: notes,
            }}
          />

        </div>

      )}

    </div>
  );
}