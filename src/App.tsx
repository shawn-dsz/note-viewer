/**
 * Main App component with mobile navigation and tag search
 */

import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { TagSidebar } from './components/TagSidebar'
import { ThemeToggle } from './components/ThemeToggle'
import { HomePage } from './pages/HomePage'
import { DocPage } from './pages/DocPage'
import { CalculatorsPage } from './pages/CalculatorsPage'
import { siteConfig, featuresConfig } from './data/docs'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isTagSidebarOpen, setIsTagSidebarOpen] = useState(false)

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)
  const openTagSidebar = () => setIsTagSidebarOpen(true)
  const closeTagSidebar = () => setIsTagSidebarOpen(false)

  const showTagSidebar = featuresConfig.tagSidebar !== false
  const showDarkMode = featuresConfig.darkMode !== false

  return (
    <ThemeProvider>
      {/* Mobile header with hamburger menu */}
      <header className="mobile-header">
        <button
          className="hamburger-button"
          onClick={openSidebar}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
        <span className="mobile-header-title">{siteConfig.title || 'Notes'}</span>
        <div className="mobile-header-actions">
          {showTagSidebar && (
            <button
              className="tag-search-button"
              onClick={openTagSidebar}
              aria-label="Search by tags"
            >
              🏷️
            </button>
          )}
          {showDarkMode && <ThemeToggle />}
        </div>
      </header>

      <div className="app">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main className="main-content">
          <div className="main-header">
            <div className="flex-grow" />
            {showTagSidebar && (
              <button
                className="tag-search-button desktop-only"
                onClick={openTagSidebar}
                aria-label="Search by tags"
                title="Search by tags"
              >
                🏷️ Tags
              </button>
            )}
            {showDarkMode && <ThemeToggle />}
          </div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/doc/:docId" element={<DocPage />} />
            {featuresConfig.calculators && (
              <Route path="/calculators" element={<CalculatorsPage />} />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Tag search sidebar */}
      {showTagSidebar && <TagSidebar isOpen={isTagSidebarOpen} onClose={closeTagSidebar} />}
    </ThemeProvider>
  )
}

export default App
