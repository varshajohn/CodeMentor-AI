import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/CodeBlock";

export default function Message({ message }) {
  const content = message.content || "";

  return (
    <div
      className={`message ${
        message.role === "user"
          ? "user"
          : "assistant"
      }`}
    >
      <div className="bubble fade">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const isInline = !match;
              return (
                <CodeBlock
                  inline={isInline}
                  className={className}
                  {...props}
                >
                  {children}
                </CodeBlock>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}