import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Message from "./Message";
import api, { BACKEND_URL } from "../services/api";

export default function Session() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("code");

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const res = await api.get(`/session/${id}`);
      setSession(res.data.session);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-400 flex items-center justify-center text-xs uppercase font-bold tracking-wider animate-pulse">
        Loading Session Data...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center text-sm font-semibold">
        Session Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                {session.language || "N/A"}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-2">
                {session.title || "Workshop Reference"}
              </h1>
              <p className="text-slate-400 text-[10px] font-medium">
                Saved on {new Date(session.createdAt).toLocaleString()}
              </p>
            </div>

            <a
              href={`${BACKEND_URL}/api/pdf/${session._id}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm active:scale-[0.98]"
            >
              Export to PDF
            </a>
          </div>

          {/* Nav Tab Switches */}
          <div className="flex bg-slate-100 border border-slate-200 p-1.5 rounded-xl max-w-sm">
            {["code", "mentor", "notes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Panels */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs min-h-[350px]">
            {activeTab === "code" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Original Prompt</h3>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{session.prompt}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Baseline Version</h4>
                    <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4">
                      <Message message={{ role: "assistant", content: session.generatedCode }} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">Optimized Version</h4>
                    <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4">
                      <Message message={{ role: "assistant", content: session.optimizedCode || "*No performance data saved.*" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mentor" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Dialogue Log</h3>
                {!session.chatHistory || session.chatHistory.length === 0 ? (
                  <p className="text-slate-400 text-xs">No conversations recorded for this session.</p>
                ) : (
                  <div className="space-y-4">
                    {session.chatHistory.map((chat, idx) => (
                      <div key={idx} className="space-y-2 border-b border-slate-100 pb-4 last:border-0">
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-xl px-4 py-2 text-xs max-w-lg shadow-xs">
                            {chat.question}
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-xs w-full">
                            <Message message={{ role: "assistant", content: chat.answer }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notes" && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Revision Notes</h3>
                {!session.studyNotes ? (
                  <p className="text-slate-400 text-xs">No notes generated for this session.</p>
                ) : (
                  <Message message={{ role: "assistant", content: session.studyNotes }} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}