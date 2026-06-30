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
const [comparison, setComparison] = useState("");
  return (
    <div className="min-h-screen flex">

      <Sidebar />

      <main className="flex-1 p-8 overflow-hidden">

        {/* Top */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              AI Workspace
            </h1>

            <p className="text-slate-400 mt-2">
              Generate • Optimize • Learn
            </p>

          </div>

        </div>

        {/* Generator */}

        <div className="glass rounded-3xl p-8 mb-8 fade-up">

          <CodeGenerator
    setComparison={setComparison}
            setPrompt={setPrompt}
            setLanguage={setLanguage}
            setGeneratedCode={setGeneratedCode}
            setOptimizedCode={setOptimizedCode}
          />

        </div>

        {generatedCode && (

          <div className="grid grid-cols-12 gap-8">

            {/* Left */}

            <div className="col-span-8">

              <div className="glass rounded-3xl overflow-hidden h-[700px] flex flex-col">

                {/* Tabs */}

<div className="flex border-b border-white/10">

  <button
    onClick={() => setActiveTab("generated")}
    className={`flex-1 py-5 font-semibold transition ${
      activeTab === "generated"
        ? "bg-indigo-600"
        : "hover:bg-white/5"
    }`}
  >
    Generated
  </button>

  <button
    onClick={() => setActiveTab("optimized")}
    className={`flex-1 py-5 font-semibold transition ${
      activeTab === "optimized"
        ? "bg-indigo-600"
        : "hover:bg-white/5"
    }`}
  >
    Optimized
  </button>

  <button
    onClick={() => setActiveTab("comparison")}
    className={`flex-1 py-5 font-semibold transition ${
      activeTab === "comparison"
        ? "bg-indigo-600"
        : "hover:bg-white/5"
    }`}
  >
    Comparison
  </button>

</div>

                <div className="flex-1 overflow-y-auto p-8">

<Message
  message={{
    role: "assistant",
    content:
      activeTab === "generated"
        ? generatedCode
        : activeTab === "optimized"
        ? optimizedCode
        : comparison,
  }}
/>

                </div>

              </div>

            </div>

            {/* Right */}

            <div className="col-span-4">

              <div className="glass rounded-3xl h-[700px]">

                <div className="px-8 py-6 border-b border-white/10">

                  <h2 className="text-2xl font-bold">
                    AI Mentor
                  </h2>

                  <p className="text-slate-400 text-sm mt-2">
                    Ask anything about this solution.
                  </p>

                </div>

                <div className="h-[610px] p-6">

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

          </div>

        )}

      </main>

    </div>
  );
}