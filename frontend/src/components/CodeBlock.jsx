import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaCheck } from "react-icons/fa";

export default function CodeBlock({
  inline,
  className,
  children,
}) {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");

  const code = String(children).replace(/\n$/, "");

  async function copy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (inline) {
    return (
      <code
        style={{
          background: "#1e293b",
          padding: "3px 8px",
          borderRadius: "6px",
          color: "#38bdf8",
        }}
      >
        {children}
      </code>
    );
  }

  return (
    <div
      style={{
        marginTop: "25px",
        marginBottom: "25px",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #334155",
      }}
    >
      <div
        style={{
          background: "#111827",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          borderBottom: "1px solid #334155",
        }}
      >
        <span
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            textTransform: "uppercase",
          }}
        >
          {match ? match[1] : "code"}
        </span>

        <button
          onClick={copy}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
          }}
        >
          {copied ? <FaCheck /> : <FaCopy />}
        </button>
      </div>

      <SyntaxHighlighter
        language={match ? match[1] : "javascript"}
        style={oneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "24px",
          fontSize: "15px",
          background: "#0f172a",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}