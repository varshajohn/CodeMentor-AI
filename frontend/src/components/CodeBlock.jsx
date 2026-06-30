import { useState } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ inline, className, children }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[12px]">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group border border-white/5 rounded-xl overflow-hidden bg-[#020617] mt-2 mb-3">
      {/* Absolute overlay headers for a compact appearance inside the grid */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
        <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-900 px-2 py-1 rounded">
          {match ? match[1] : "CODE"}
        </span>
        <button
          onClick={copyCode}
          className={`p-1.5 rounded text-white transition ${
            copied ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          title="Copy Code"
        >
          {copied ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
        </button>
      </div>

      <SyntaxHighlighter
        language={match ? match[1] : "javascript"}
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "16px",
          background: "#020617",
          fontSize: "12px",
          borderRadius: 0,
          minHeight: "100%",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}