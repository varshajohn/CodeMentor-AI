import { useState } from "react";
import Sidebar from "./Sidebar";
import CodeGenerator from "./CodeGenerator";
import ChatPanel from "./ChatPanel";
import Message from "./Message";

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("generated");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Sleek App Header */}
        <div className="border-b border-slate-200 bg-white px-8 py-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Interactive Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Analyze problems to generate clean code solutions, compare optimizations, and save detailed revisions.
            </p>
          </div>
        </div>

        <div className="max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8 flex-1 flex flex-col">
          {/* Main generator card */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <CodeGenerator
              setPrompt={setPrompt}
              setLanguage={setLanguage}
              setGeneratedCode={setGeneratedCode}
              setOptimizedCode={setOptimizedCode}
            />
          </section>

          {/* Solution displays */}
          {generatedCode && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 min-h-[580px]">
              {/* Code output (7/12 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[580px]">
                <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-semibold text-slate-900">Source Solutions</h2>
                    <p className="text-[10px] text-slate-500">Review compiled algorithm scripts.</p>
                  </div>
                  
                  {/* Tab switches */}
                  <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg">
                    <button
                      onClick={() => setActiveTab("generated")}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition ${
                        activeTab === "generated"
                          ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Baseline
                    </button>
                    <button
                      onClick={() => setActiveTab("optimized")}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition ${
                        activeTab === "optimized"
                          ? "bg-white text-blue-600 shadow-xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Optimized Code
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-white">
                  {activeTab === "generated" ? (
                    <div>
                      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Baseline Code</span>
                      </div>
                      <Message
                        message={{
                          role: "assistant",
                          content: generatedCode,
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-semibold">Refactored Version</span>
                      </div>
                      <Message
                        message={{
                          role: "assistant",
                          content: optimizedCode || "*Optimization response generated or still loading.*",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mentor interaction block (5/12 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[580px]">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
                  <h2 className="text-sm font-semibold text-slate-900">Mentor Queries</h2>
                  <p className="text-[10px] text-slate-500">Step-by-step concept dialog.</p>
                </div>
                
                <div className="p-6 flex-1 flex flex-col min-h-0 bg-white">
                  <ChatPanel
                    code={generatedCode}
                    prompt={prompt}
                    language={language}
                    optimizedCode={optimizedCode}
                    history={history}
                    setHistory={setHistory}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}