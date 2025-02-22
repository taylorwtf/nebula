'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export default function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <div
      className={`p-4 rounded-2xl max-w-[80%] ${
        isUser
          ? 'ml-auto bg-pink-500/10 text-pink-500 border border-pink-500/20'
          : 'mr-auto bg-teal-400/10 text-teal-400 border border-teal-400/20'
      }`}
    >
      {isUser ? (
        content
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Style code blocks
            code({ className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              return (
                <code
                  className={`${className} ${
                    isInline
                      ? 'bg-gray-800/50 px-1 py-0.5 rounded'
                      : 'block bg-gray-800/50 p-3 rounded-lg my-2 overflow-x-auto'
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // Style links
            a({ children, ...props }: any) {
              return (
                <a
                  className="text-pink-400 hover:text-pink-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // Style headings
            h1: ({ children }) => <h1 className="text-2xl font-bold my-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold my-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold my-2">{children}</h3>,
            // Style lists
            ul: ({ children }) => <ul className="list-disc list-inside my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside my-2">{children}</ol>,
            // Style paragraphs
            p: ({ children }) => <p className="my-2">{children}</p>,
          }}
          className="prose prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent"
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
} 