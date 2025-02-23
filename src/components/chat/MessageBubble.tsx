'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  content: string;
  isUser: boolean;
}

export default function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <motion.div
      className={`p-4 rounded-2xl max-w-[80%] ${
        isUser
          ? 'ml-auto glass-panel border-primary/20 text-primary-light'
          : 'mr-auto glass-panel border-accent/20 text-accent-light'
      }`}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2 }}
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
                      ? 'bg-glass-dark px-1.5 py-0.5 rounded text-primary-light'
                      : 'block bg-glass-dark p-4 rounded-xl my-3 overflow-x-auto'
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
                  className="text-primary hover:text-primary-light underline decoration-primary/30 hover:decoration-primary-light/50 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            // Style headings
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold my-4 bg-gradient-to-r from-primary-light to-accent-light bg-clip-text text-transparent">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold my-3 text-primary-light/90">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold my-2 text-primary-light/80">
                {children}
              </h3>
            ),
            // Style lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside my-3 space-y-1 marker:text-primary-light/50">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside my-3 space-y-1 marker:text-primary-light/50">
                {children}
              </ol>
            ),
            // Style paragraphs
            p: ({ children }) => (
              <p className="my-2 leading-relaxed">
                {children}
              </p>
            ),
          }}
          className="prose prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent"
        >
          {content}
        </ReactMarkdown>
      )}
    </motion.div>
  );
} 