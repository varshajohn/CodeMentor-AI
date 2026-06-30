import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "./Sidebar";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;
      const res = await api.get(`/session/all?userId=${userId}`);
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id) {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await api.delete(`/session/${id}`);
      loadSessions();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto mb-8 border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Learning History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access previous problem-solving workshops and review saved revision notes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider animate-pulse">
              Loading Sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">No sessions recorded</h2>
              <p className="text-xs text-slate-500 mt-2">
                Generate code blocks and save notes to log references here.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
              >
                Start New Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-200 flex flex-col justify-between h-48 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-blue-50 border border-blue-100 text-blue-600 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {session.language || "N/A"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-sm font-bold text-slate-900 line-clamp-2 leading-relaxed">
                      {session.title || "Untitled Workshop"}
                    </h2>
                  </div>

                  <div className="flex gap-3 border-t border-slate-100 pt-4 mt-4">
                    <button
                      onClick={() => navigate(`/session/${session._id}`)}
                      className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2 rounded-xl text-[11px] font-semibold transition active:scale-[0.98]"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => deleteSession(session._id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100/50 py-2 rounded-xl text-[11px] font-semibold transition active:scale-[0.98]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}