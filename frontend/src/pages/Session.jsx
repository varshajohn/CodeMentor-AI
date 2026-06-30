import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Message from "./Message";
import api from "../services/api";

export default function Session() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const res = await api.get(`/session/${id}`);
      setSession(res.data.session);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-2xl">
        Loading Session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-2xl">
        Session Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <main className="flex-1 overflow-y-auto">

        <div className="max-w-7xl mx-auto p-10 space-y-10">

          <div>

            <h1 className="text-5xl font-bold">
              {session.title}
            </h1>

            <p className="text-slate-400 mt-4">
              {new Date(session.createdAt).toLocaleString()}
            </p>

          </div>

          {/* Problem */}

          <section className="bg-slate-900 rounded-3xl border border-slate-800 p-8">

            <h2 className="text-3xl font-bold mb-5">
              Programming Problem
            </h2>

            <p className="text-lg leading-8">
              {session.prompt}
            </p>

          </section>

          {/* Generated */}

          <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

            <div className="bg-slate-800 px-8 py-5">

              <h2 className="text-3xl font-bold">
                Generated Solution
              </h2>

            </div>

            <div className="p-8">

              <Message
                message={{
                  role: "assistant",
                  content: session.generatedCode,
                }}
              />

            </div>

          </section>

          {/* Optimized */}

          <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

            <div className="bg-slate-800 px-8 py-5">

              <h2 className="text-3xl font-bold">
                Optimized Solution
              </h2>

            </div>

            <div className="p-8">

              <Message
                message={{
                  role: "assistant",
                  content: session.optimizedCode,
                }}
              />

            </div>

          </section>

          {/* Chat */}

          <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

            <div className="bg-slate-800 px-8 py-5">

              <h2 className="text-3xl font-bold">
                Mentor Discussion
              </h2>

            </div>

            <div className="p-8 space-y-5">

              {session.chatHistory?.map((chat, index) => (
                <div key={index}>

                  <Message
                    message={{
                      role: "user",
                      content: chat.question,
                    }}
                  />

                  <Message
                    message={{
                      role: "assistant",
                      content: chat.answer,
                    }}
                  />

                </div>
              ))}

            </div>

          </section>

          {/* Notes */}

          <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">

            <div className="bg-slate-800 px-8 py-5">

              <h2 className="text-3xl font-bold">
                Study Notes
              </h2>

            </div>

            <div className="p-8">

              <Message
                message={{
                  role: "assistant",
                  content: session.studyNotes,
                }}
              />

            </div>

          </section>

          {/* PDF */}

          <div className="flex justify-end">

            <a
              href={`http://localhost:5000/api/pdf/${session._id}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold"
            >
              Download PDF
            </a>

          </div>

        </div>

      </main>

    </div>
  );
}