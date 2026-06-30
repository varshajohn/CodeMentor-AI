import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../components/CodeBlock";

export default function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex mb-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[90%] rounded-3xl px-5 py-4 shadow-lg transition-all duration-300

        ${
          isUser
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-lg"
            : "glass text-slate-100 rounded-bl-lg"
        }`}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-3">

            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">

              AI

            </div>

            <span className="font-semibold text-sm">

              CodeMentor AI

            </span>

          </div>
        )}

        <div className="prose prose-invert max-w-none text-sm leading-7">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({
                inline,
                className,
                children,
                ...props
              }) {
                return (
                  <CodeBlock
                    inline={inline}
                    className={className}
                    {...props}
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
    </div>
  );
}