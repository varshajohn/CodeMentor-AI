import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Message from "./Message";

export default function ChatPanel({
  code,
  prompt,
  language,
  history,
  setHistory,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
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

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
      };

      setHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log(err);

      setHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to generate a response. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  const generateNotes = async () => {
    try {
      setLoading(true);

      const res = await api.post("/ai/notes", {
        prompt,
        language,
        code,
        optimizedCode: "",
        history,
      });

      setNotes(res.data.studyNotes);

      await api.post("/session/save", {
        title: prompt,
        prompt,
        language,
        generatedCode: code,
        optimizedCode: "",
        chatHistory: history,
        studyNotes: res.data.studyNotes,
      });
    } catch (err) {
      console.log(err);
      alert("Failed to generate notes.");
    }

    setLoading(false);
  };

  const enter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-800">

          <h2 className="text-2xl font-semibold">
            AI Mentor
          </h2>

          <p className="text-slate-400 mt-2">
            Ask questions only about the generated solution.
          </p>

        </div>

        <div className="h-[500px] overflow-y-auto p-6 space-y-5">

          {history.length === 0 && (

            <div className="text-center mt-28">

              <h2 className="text-2xl font-semibold">
                Ready to Learn 🚀
              </h2>

              <p className="text-slate-400 mt-3">
                Ask anything about the generated solution.
              </p>

            </div>

          )}

          {history.map((msg, index) => (
            <Message
              key={index}
              message={msg}
            />
          ))}

          {loading && (

            <div className="message assistant">

              <div className="bubble">

                Thinking...

              </div>

            </div>

          )}

          <div ref={bottomRef} />

        </div>

        <div className="border-t border-slate-800 p-6">

          <textarea
            rows={3}
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={enter}
            placeholder="Ask why the algorithm works, dry run, variables, loops..."
            className="w-full bg-slate-800 rounded-xl p-4"
          />

          <div className="flex gap-4 mt-5">

            <button
              onClick={askAI}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
            >
              Ask Mentor
            </button>

            <button
              onClick={generateNotes}
              className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3 rounded-xl"
            >
              Generate Study Notes
            </button>

          </div>

        </div>

      </div>

      {notes && (

        <div className="mt-10 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-800">

            <h2 className="text-2xl font-semibold">
              Study Notes
            </h2>

          </div>

          <div className="p-8">

            <Message
              message={{
                role: "assistant",
                content: notes,
              }}
            />

          </div>

        </div>

      )}
    </>
  );
}