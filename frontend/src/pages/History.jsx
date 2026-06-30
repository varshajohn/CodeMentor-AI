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
      const res = await api.get("/session/all");

      setSessions(res.data.sessions || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id) {
    const confirmDelete = window.confirm(
      "Delete this learning session?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/session/${id}`);

      loadSessions();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-10">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Learning History
          </h1>

          <p className="text-slate-400 mt-3">
            View all your previous coding sessions.
          </p>

        </div>

        {loading ? (

          <div className="text-xl">
            Loading...
          </div>

        ) : sessions.length === 0 ? (

          <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800">

            <h2 className="text-3xl font-semibold">

              No Sessions Found

            </h2>

            <p className="text-slate-400 mt-4">

              Generate your first coding solution to create a learning session.

            </p>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl"
            >
              New Coding Session
            </button>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {sessions.map((session) => (

              <div
                key={session._id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-blue-500 transition"
              >

                <h2 className="text-2xl font-bold line-clamp-2">

                  {session.title}

                </h2>

                <div className="mt-6 space-y-3">

                  <div>

                    <span className="text-slate-500 text-sm">

                      Language

                    </span>

                    <p className="font-semibold">

                      {session.language}

                    </p>

                  </div>

                  <div>

                    <span className="text-slate-500 text-sm">

                      Created

                    </span>

                    <p>

                      {new Date(
                        session.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>

                <div className="flex gap-3 mt-8">

                  <button
                    onClick={() =>
                      navigate(`/session/${session._id}`)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl"
                  >
                    Open
                  </button>

                  <button
                    onClick={() =>
                      deleteSession(session._id)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}