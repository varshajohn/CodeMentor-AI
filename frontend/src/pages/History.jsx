import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCode,
  FaTrash,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import api from "../services/api";

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const userId = user.id || user._id;

      const res = await api.get(
        `/session/all?userId=${userId}`
      );

      setSessions(res.data.sessions || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(id) {
    if (
      !window.confirm(
        "Delete this session permanently?"
      )
    )
      return;

    try {
      await api.delete(`/session/${id}`);

      loadSessions();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            History
          </h1>

          <p className="text-slate-400 mt-2">
            Review your previous coding sessions.
          </p>

        </div>

        {loading ? (

          <div className="text-center mt-20">

            <h2 className="text-xl text-slate-400">

              Loading...

            </h2>

          </div>

        ) : sessions.length === 0 ? (

          <div className="glass rounded-3xl p-16 text-center">

            <FaCode className="mx-auto text-6xl text-indigo-400 mb-6" />

            <h2 className="text-3xl font-bold">

              No Sessions Yet

            </h2>

            <p className="text-slate-400 mt-4">

              Your saved coding sessions will appear here.

            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="primary-btn mt-8"
            >
              Start Coding
            </button>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">

            {sessions.map((session) => (

              <div
                key={session._id}
                className="glass rounded-3xl p-6 hover-card flex flex-col"
              >

                {/* Top */}

                <div className="flex justify-between items-center mb-5">

                  <span className="badge">

                    {session.language}

                  </span>

                  <div className="flex items-center gap-2 text-sm text-slate-400">

                    <FaCalendarAlt />

                    {new Date(
                      session.createdAt
                    ).toLocaleDateString()}

                  </div>

                </div>

                {/* Title */}

                <h2 className="text-xl font-semibold leading-8">

                  {session.title}

                </h2>

                <div className="flex-1" />

                {/* Buttons */}

                <div className="flex gap-3 mt-8">

                  <button
                    onClick={() =>
                      navigate(
                        `/session/${session._id}`
                      )
                    }
                    className="primary-btn flex-1 flex justify-center items-center gap-2"
                  >

                    Open

                    <FaArrowRight />

                  </button>

                  <button
                    onClick={() =>
                      deleteSession(session._id)
                    }
                    className="secondary-btn px-5"
                  >

                    <FaTrash />

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