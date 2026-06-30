import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaDownload,
  FaCode,
  FaComments,
  FaBookOpen,
  FaCalendarAlt,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import Message from "./Message";
import api, { BACKEND_URL } from "../services/api";

export default function Session() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] =
    useState("code");

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const res = await api.get(
        `/session/${id}`
      );

      setSession(res.data.session);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-slate-400 text-xl">

          Loading Session...

        </h2>

      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex justify-center items-center">

        <h2 className="text-2xl">

          Session Not Found

        </h2>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}

        <div className="glass rounded-3xl p-8 mb-8">

          <div className="flex flex-wrap justify-between gap-6 items-center">

            <div>

              <span className="badge">

                {session.language}

              </span>

              <h1 className="text-4xl font-bold mt-4">

                {session.title}

              </h1>

              <div className="flex items-center gap-3 mt-3 text-slate-400">

                <FaCalendarAlt />

                {new Date(
                  session.createdAt
                ).toLocaleString()}

              </div>

            </div>

            <a
              href={`${BACKEND_URL}/api/pdf/${session._id}`}
              target="_blank"
              rel="noreferrer"
              className="primary-btn flex items-center gap-3"
            >

              <FaDownload />

              Download PDF

            </a>

          </div>

        </div>

        {/* Tabs */}

        <div className="glass rounded-3xl p-2 flex gap-2 mb-8">

          <button
            onClick={() =>
              setActiveTab("code")
            }
            className={`flex-1 py-4 rounded-2xl transition flex justify-center items-center gap-3

            ${
              activeTab === "code"
                ? "bg-indigo-600"
                : "hover:bg-white/5"
            }`}
          >

            <FaCode />

            Code

          </button>

          <button
            onClick={() =>
              setActiveTab("mentor")
            }
            className={`flex-1 py-4 rounded-2xl transition flex justify-center items-center gap-3

            ${
              activeTab === "mentor"
                ? "bg-indigo-600"
                : "hover:bg-white/5"
            }`}
          >

            <FaComments />

            Mentor

          </button>

          <button
            onClick={() =>
              setActiveTab("notes")
            }
            className={`flex-1 py-4 rounded-2xl transition flex justify-center items-center gap-3

            ${
              activeTab === "notes"
                ? "bg-indigo-600"
                : "hover:bg-white/5"
            }`}
          >

            <FaBookOpen />

            Notes

          </button>

        </div>

        <div className="glass rounded-3xl p-8">

          {activeTab === "code" && (

            <div>

              <h2 className="text-2xl font-bold mb-5">

                Problem Statement

              </h2>

              <div className="glass rounded-2xl p-5 mb-8">

                {session.prompt}

              </div>

              <div className="grid xl:grid-cols-2 gap-8">

                <div>

                  <h3 className="text-xl font-semibold mb-5">

                    Generated Code

                  </h3>

                  <Message
                    message={{
                      role: "assistant",
                      content:
                        session.generatedCode,
                    }}
                  />

                </div>

                <div>

                  <h3 className="text-xl font-semibold mb-5">

                    Optimized Code

                  </h3>

                  <Message
                    message={{
                      role: "assistant",
                      content:
                        session.optimizedCode ||
                        "No optimized code available.",
                    }}
                  />

                </div>

              </div>

            </div>

          )}
                    {activeTab === "mentor" && (

            <div>

              <h2 className="text-2xl font-bold mb-8">
                Mentor Conversation
              </h2>

              {!session.chatHistory ||
              session.chatHistory.length === 0 ? (

                <div className="text-center py-20 text-slate-400">

                  No mentor conversation available.

                </div>

              ) : (

                <div className="space-y-8">

                  {session.chatHistory.map(
                    (chat, index) => (

                      <div
                        key={index}
                        className="space-y-4"
                      >

                        {/* User */}

                        <div className="flex justify-end">

                          <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 shadow-lg">

                            {chat.question}

                          </div>

                        </div>

                        {/* AI */}

                        <div className="flex justify-start">

                          <div className="glass rounded-3xl rounded-bl-lg p-5 max-w-[90%]">

                            <Message
                              message={{
                                role:
                                  "assistant",
                                content:
                                  chat.answer,
                              }}
                            />

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )}

          {activeTab === "notes" && (

            <div>

              <h2 className="text-2xl font-bold mb-6">

                Study Notes

              </h2>

              {!session.studyNotes ? (

                <div className="text-center py-20 text-slate-400">

                  Notes were not generated for
                  this session.

                </div>

              ) : (

                <div className="glass rounded-3xl p-8">

                  <Message
                    message={{
                      role: "assistant",
                      content:
                        session.studyNotes,
                    }}
                  />

                </div>

              )}

            </div>

          )}

        </div>

      </main>

    </div>

  );

}