/**
 * Notion-style Sidebar component
 * Resizable with emoji icons
 */

import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { docCategories, siteConfig, categoryConfig, featuresConfig } from '../data/docs'
import { getCategoryEmoji, getCategoryDisplayName } from '../data/defaults/emojis'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 260

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('openCategories')
    return saved ? new Set(JSON.parse(saved)) : new Set(docCategories.map(c => c.id))
  })

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth')
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH
  })

  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      localStorage.setItem('openCategories', JSON.stringify([...next]))
      return next
    })
  }

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  // Resize handlers
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false)
        localStorage.setItem('sidebarWidth', sidebarWidth.toString())
      }
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, sidebarWidth])

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && onClose && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <nav
        ref={sidebarRef}
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-header-icon">{siteConfig.icon || '📓'}</span>
          <span className="sidebar-header-text">{siteConfig.title || 'Notes'}</span>
        </div>

        {/* Calculators Link (only shown if enabled in config) */}
        {featuresConfig.calculators && (
          <NavLink
            to="/calculators"
            className={({ isActive }) =>
              `sidebar-row ${isActive ? 'active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <span className="sidebar-icon">🧮</span>
            <span className="sidebar-text">Calculators</span>
          </NavLink>
        )}

        {/* Divider (only if calculators shown) */}
        {featuresConfig.calculators && <div className="sidebar-divider" />}

        {/* Categories as tree items */}
        {docCategories.map(category => {
          const isOpenCategory = openCategories.has(category.id)
          // Build a minimal config object for the helper functions
          const configForHelpers = { categories: categoryConfig }
          const emoji = getCategoryEmoji(category.id, configForHelpers)
          const displayName = getCategoryDisplayName(category.id, category.name, configForHelpers)

          return (
            <div key={category.id} className="sidebar-tree-item">
              {/* Category row */}
              <button
                className="sidebar-row sidebar-row-parent"
                onClick={() => toggleCategory(category.id)}
              >
                <span className={`sidebar-toggle ${isOpenCategory ? 'open' : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M4 2l4 4-4 4" />
                  </svg>
                </span>
                <span className="sidebar-icon">{emoji}</span>
                <span className="sidebar-text">{displayName}</span>
              </button>

              {/* Child items */}
              {isOpenCategory && (
                <div className="sidebar-children">
                  {category.files.map(file => (
                    <NavLink
                      key={file.id}
                      to={`/doc/${file.id}`}
                      className={({ isActive }) =>
                        `sidebar-row sidebar-row-child ${isActive ? 'active' : ''}`
                      }
                      onClick={handleLinkClick}
                    >
                      <span className="sidebar-icon">📄</span>
                      <span className="sidebar-text">{file.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Footer spacer */}
        <div className="sidebar-footer" />

        {/* Resize handle */}
        <div
          className="sidebar-resize-handle"
          onMouseDown={startResize}
        />
      </nav>
    </>
  )
}
