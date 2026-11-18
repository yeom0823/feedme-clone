import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** 추출된 Markdown을 렌더링해 보여 준다. 긴 코드 블록과 넓은 표는 요소 안에서 가로로 스크롤된다. */
export function MarkdownView({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] leading-7 wrap-anywhere [&_a]:underline [&_a]:underline-offset-3 [&_blockquote]:mb-3 [&_blockquote]:border-l-[3px] [&_blockquote]:pl-3.5 [&_blockquote]:text-muted-foreground [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-[19px] [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-bold [&_img]:max-w-full [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5.5 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => (
            <pre className="mb-3 overflow-x-auto rounded-md bg-muted px-3.5 py-3 font-mono text-[13px] leading-relaxed [&_code]:bg-transparent [&_code]:p-0">
              {children}
            </pre>
          ),
          code: ({ children, className }) => (
            <code
              className={`rounded bg-muted px-1.5 py-px font-mono text-[0.9em] ${className ?? ""}`}
            >
              {children}
            </code>
          ),
          table: ({ children }) => (
            <div className="mb-3 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border px-2.5 py-1.5 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border px-2.5 py-1.5 text-left">{children}</td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
