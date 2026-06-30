import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/CodeBlock";

export default function Message({ message }) {
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
            code({
              inline,
              className,
              children,
            }) {
              return (
                <CodeBlock
                  inline={inline}
                  className={className}
                >
                  {children}
                </CodeBlock>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>

      </div>
    </div>
  );
}