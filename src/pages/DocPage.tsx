/**
 * Documentation page component with keyword tags
 */

import { useParams, useNavigate } from 'react-router-dom'
import { getDocFile, tagConfig, tagRules } from '../data/docs'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { getTagConfig, autoDetectTags } from '../data/defaults/tags'

export function DocPage() {
  const { docId } = useParams<{ docId: string }>()
  const navigate = useNavigate()
  const doc = docId ? getDocFile(docId) : undefined

  if (!doc) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Document not found</h1>
        <p className="text-secondary mb-4">
          The requested document could not be found.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
        >
          Go Home
        </button>
      </div>
    )
  }

  // Build a config object for the helper functions
  const configForHelpers = { tags: tagConfig, tagRules }

  // Get tags from file or auto-detect
  const tags = doc.tags || autoDetectTags(doc.title, doc.description, configForHelpers)

  return (
    <div>
      {/* Tags at top of content */}
      {tags.length > 0 && (
        <div className="doc-tags">
          {tags.map(tag => {
            const tagConf = getTagConfig(tag, configForHelpers)
            return (
              <span
                key={tag}
                className="doc-tag"
                style={{
                  backgroundColor: tagConf.bg,
                  color: tagConf.text
                }}
              >
                {tagConf.name}
              </span>
            )
          })}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
      {doc.description && (
        <p className="text-secondary mb-6">{doc.description}</p>
      )}
      <MarkdownRenderer filePath={doc.path} />
    </div>
  )
}
