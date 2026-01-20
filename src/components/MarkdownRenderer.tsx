/**
 * Markdown renderer component with syntax highlighting and math support
 */

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import type { Components } from 'react-markdown'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'

interface MarkdownRendererProps {
  filePath: string
}

export function MarkdownRenderer({ filePath }: MarkdownRendererProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.statusText}`)
        return res.text()
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      })
  }, [filePath])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-secondary">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 py-12">
        <p>Error loading document: {error}</p>
      </div>
    )
  }

  const components: Components = {
    // Custom heading component with IDs for anchor linking
    h1: ({ node, children, ...props }) => (
      <h1 {...props} id={generateSlug(children?.toString() || '')} />
    ),
    h2: ({ node, children, ...props }) => (
      <h2 {...props} id={generateSlug(children?.toString() || '')} />
    ),
    h3: ({ node, children, ...props }) => (
      <h3 {...props} id={generateSlug(children?.toString() || '')} />
    ),
    h4: ({ node, children, ...props }) => (
      <h4 {...props} id={generateSlug(children?.toString() || '')} />
    ),
    // Custom code component
    code: ({ node, className, children, ...props }) => {
      const codeProps = props as React.HTMLAttributes<HTMLElement>
      const isInline = !className?.includes('hljs')
      if (isInline) {
        return <code className={className} {...codeProps}>{children}</code>
      }
      return <code className={className} {...codeProps}>{children}</code>
    },
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
