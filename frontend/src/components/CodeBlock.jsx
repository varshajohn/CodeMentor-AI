import { useState } from "react";
import {
  FaCopy,
  FaCheck,
} from "react-icons/fa";

import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";

import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  inline,
  className,
  children,
}) {
  const [copied, setCopied] = useState(false);

  const match =
    /language-(\w+)/.exec(className || "");

  const code = String(children).replace(/\n$/, "");

  async function copyCode() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  if (inline) {
    return (
      <code
        className="px-2 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[14px]"
      >
        {children}
      </code>
    );
  }

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">

      {/* Header */}

      <div className="bg-[#0f172a] border-b border-white/10 px-5 py-3 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {/* macOS buttons */}

          <div className="bg-[#0f172a] border-b border-white/10 px-5 py-3 flex items-center justify-between">

    <span className="text-sm font-semibold text-slate-300 uppercase">

        {match ? match[1] : "CODE"}

    </span>

    <button
        onClick={copyCode}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition

        ${
            copied
                ? "bg-green-600"
                : "bg-indigo-600 hover:bg-indigo-500"
        }`}
    >

        {copied ? (
            <>
                <FaCheck />
                Copied
            </>
        ) : (
            <>
                <FaCopy />
                Copy
            </>
        )}

    </button>

</div>

          <span className="text-sm text-slate-400 uppercase tracking-wider">

            {match
              ? match[1]
              : "CODE"}

          </span>

        </div>

        <button
          onClick={copyCode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition

          ${
            copied
              ? "bg-green-600"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
        >

          {copied ? (
            <>
              <FaCheck />

              Copied
            </>
          ) : (
            <>
              <FaCopy />

              Copy
            </>
          )}

        </button>

      </div>

      {/* Code */}

      <SyntaxHighlighter
        language={
          match
            ? match[1]
            : "javascript"
        }
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "28px",
          background: "#020617",
          fontSize: "15px",
          borderRadius: 0,
          minHeight: "100%",
        }}
      >
        {code}
      </SyntaxHighlighter>

    </div>
  );
}