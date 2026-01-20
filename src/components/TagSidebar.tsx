/**
 * Tag search sidebar component
 * Allows searching and filtering by tags to navigate to documents
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { docFiles, tagConfig, tagRules } from '../data/docs'
import { getTagConfig, autoDetectTags } from '../data/defaults/tags'

interface TagSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface DocWithTags {
  id: string
  title: string
  tags: string[]
}

export function TagSidebar({ isOpen, onClose }: TagSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  // Build a config object for the helper functions
  const configForHelpers = useMemo(() => ({ tags: tagConfig, tagRules }), [])

  // Build document-to-tags mapping
  const docsWithTags = useMemo((): DocWithTags[] => {
    return docFiles.map(doc => ({
      id: doc.id,
      title: doc.title,
      tags: doc.tags || autoDetectTags(doc.title, doc.description, configForHelpers)
    }))
  }, [configForHelpers])

  // Get all unique tags used across documents
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    docsWithTags.forEach(doc => {
      doc.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [docsWithTags])

  // Filter tags by search query
  const filteredTags = useMemo(() => {
    if (!searchQuery) return allTags
    const query = searchQuery.toLowerCase()
    return allTags.filter(tag => {
      const config = getTagConfig(tag, configForHelpers)
      return tag.toLowerCase().includes(query) ||
             config.name.toLowerCase().includes(query)
    })
  }, [allTags, searchQuery, configForHelpers])

  // Get documents matching selected tags
  const matchingDocs = useMemo(() => {
    if (selectedTags.size === 0) return []
    return docsWithTags.filter(doc =>
      Array.from(selectedTags).some(tag => doc.tags.includes(tag))
    )
  }, [docsWithTags, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

  const clearSelection = () => {
    setSelectedTags(new Set())
    setSearchQuery('')
  }

  const navigateToDoc = (docId: string) => {
    navigate(`/doc/${docId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="tag-sidebar-backdrop" onClick={onClose} />

      {/* Sidebar */}
      <aside className="tag-sidebar">
        <div className="tag-sidebar-header">
          <h3>Search by Tag</h3>
          <button className="tag-sidebar-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>

        {/* Search input */}
        <div className="tag-search-input-wrapper">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tag-search-input"
          />
        </div>

        {/* Tag list */}
        <div className="tag-list">
          <div className="tag-list-header">
            <span>Tags</span>
            {selectedTags.size > 0 && (
              <button className="tag-clear-btn" onClick={clearSelection}>
                Clear
              </button>
            )}
          </div>
          <div className="tag-grid">
            {filteredTags.map(tag => {
              const tagConf = getTagConfig(tag, configForHelpers)
              const isSelected = selectedTags.has(tag)
              return (
                <button
                  key={tag}
                  className={`tag-btn ${isSelected ? 'selected' : ''}`}
                  style={{
                    backgroundColor: tagConf.bg,
                    color: tagConf.text,
                    borderColor: isSelected ? tagConf.text : 'transparent'
                  }}
                  onClick={() => toggleTag(tag)}
                >
                  {tagConf.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Matching documents */}
        {selectedTags.size > 0 && (
          <div className="tag-results">
            <div className="tag-results-header">
              Documents ({matchingDocs.length})
            </div>
            <div className="tag-results-list">
              {matchingDocs.map(doc => (
                <button
                  key={doc.id}
                  className="tag-result-item"
                  onClick={() => navigateToDoc(doc.id)}
                >
                  <span className="tag-result-icon">📄</span>
                  <span className="tag-result-title">{doc.title}</span>
                </button>
              ))}
              {matchingDocs.length === 0 && (
                <p className="tag-no-results">No documents match the selected tags</p>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
