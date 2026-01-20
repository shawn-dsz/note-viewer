/**
 * Markdown file scanner and catalog generator
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { DocFile, DocCategory, DocFrontmatter, GeneratedCatalog } from '../types/docs.js'
import { loadConfig, getContentDir, mergeCategoryThemes, type NotesViewerConfig, DEFAULT_CONFIG } from '../config.js'

// Load configuration
let config: NotesViewerConfig = DEFAULT_CONFIG
let configPath: string
let contentDir: string

/**
 * Get the currently loaded configuration
 * Call this after initConfig has been called
 */
export function getLoadedConfig(): NotesViewerConfig {
  return config
}

// Initialize config - this runs at module load time
async function initConfig() {
  // Allow override via environment variable for CLI usage
  const configDir = process.env.NOTE_VIEWER_CONFIG_DIR || process.cwd()
  configPath = path.resolve(configDir, 'note-viewer.config.ts')
  try {
    config = await loadConfig(configPath)
    contentDir = getContentDir(config, configPath)
    console.log(`Loading configuration from: ${configPath}`)
    console.log(`Content directory: ${contentDir}`)

    // Apply custom category themes from config
    if (config.categories) {
      mergeCategoryThemes(config.categories)
      console.log(`Applied ${Object.keys(config.categories).length} custom category theme(s)`)
    }
  } catch (error) {
    console.error('Error loading configuration:', error)
    console.error('Using fallback defaults')
    configPath = process.cwd()
    config = DEFAULT_CONFIG
    contentDir = path.resolve(process.cwd(), config.contentDir)
  }
}

// Initialize immediately
await initConfig()

const IGNORE_DIRECTORIES = config.ignore || [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.specify',
  'venv',
  '.venv',
  'specs',
  '.claude',
  'coverage',
  '.vscode',
]

const IGNORE_FILES = [
  'CLAUDE.md',
  'LICENSE',
  '*.spec.md',
  '*.test.md',
]

// Get patterns from config or use default
const DISCOVERY_PATTERNS = config.patterns || ['**/*.md']

/**
 * Check if a file path matches a glob pattern
 * Supports **, *, and ? wildcards
 */
function matchesGlob(filePath: string, pattern: string, rootDir: string): boolean {
  const normalizedPath = path.relative(rootDir, filePath).replace(/\\/g, '/')

  // Convert glob pattern to regex
  // Process glob syntax first, then escape regex special chars in literals
  let regexPattern = ''
  let i = 0
  while (i < pattern.length) {
    if (pattern.slice(i, i + 3) === '**/') {
      // **/ matches zero or more directory levels
      regexPattern += '(?:.+/)?'
      i += 3
    } else if (pattern.slice(i, i + 2) === '**') {
      // ** matches anything
      regexPattern += '.*'
      i += 2
    } else if (pattern[i] === '*') {
      // * matches anything except /
      regexPattern += '[^/]*'
      i += 1
    } else if (pattern[i] === '?') {
      // ? matches single char except /
      regexPattern += '[^/]'
      i += 1
    } else if ('.+^${}|[]()\\'.includes(pattern[i]!)) {
      // Escape regex special characters
      regexPattern += '\\' + pattern[i]
      i += 1
    } else {
      regexPattern += pattern[i]
      i += 1
    }
  }

  // Ensure pattern matches entire path
  regexPattern = '^' + regexPattern + '$'

  try {
    const regex = new RegExp(regexPattern)
    return regex.test(normalizedPath)
  } catch {
    // If regex is invalid, fall back to simple matching
    return normalizedPath.includes(pattern.replace(/\*\*/g, '').replace(/\*/g, ''))
  }
}

/**
 * Check if a file path matches any of the configured discovery patterns
 */
function matchesDiscoveryPatterns(filePath: string, rootDir: string): boolean {
  for (const pattern of DISCOVERY_PATTERNS) {
    if (matchesGlob(filePath, pattern, rootDir)) {
      return true
    }
  }
  return false
}

/**
 * Check if a file/directory should be ignored
 */
function shouldIgnore(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/')

  // Check directory patterns
  for (const dir of IGNORE_DIRECTORIES) {
    if (normalizedPath.includes(`/${dir}/`) || normalizedPath.startsWith(`${dir}/`)) {
      return true
    }
  }

  // Check file patterns
  const basename = path.basename(filePath)
  for (const pattern of IGNORE_FILES) {
    const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.')
    if (basename.match(regexPattern)) {
      return true
    }
  }

  return false
}

/**
 * Check if a path is in an auto-discovered location (root or weeks/)
 */
function isAutoDiscoveredLocation(filePath: string, rootDir: string): boolean {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const parts = relativePath.split('/')

  // Root level files
  if (parts.length === 1) {
    return true
  }

  // Files in week directories (e.g., weeks/week-1-*)
  if (parts[0] === 'weeks' && parts[1]?.startsWith('week-')) {
    return true
  }

  // Files directly in week-N-* directories (if weeks/ wasn't the parent)
  if (parts[0]?.startsWith('week-')) {
    return true
  }

  return false
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, frontmatter: DocFrontmatter, filename: string): string {
  // 1. Use frontmatter title if available
  if (frontmatter.title) {
    return frontmatter.title
  }

  // 2. Use first # heading if available
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  // 3. Fallback to filename
  return filename
    .replace(/\.md$/, '')
    .replace(/[_-]/g, ' ')
    .trim()
}

/**
 * Extract description from markdown content
 */
function extractDescription(content: string, frontmatter: DocFrontmatter): string | undefined {
  // 1. Use frontmatter description if available
  if (frontmatter.description) {
    return frontmatter.description
  }

  // 2. Extract first paragraph after first heading
  const lines = content.split('\n')
  let foundHeading = false
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#')) {
      foundHeading = true
      continue
    }
    if (foundHeading && trimmed && !trimmed.startsWith('#')) {
      return trimmed.slice(0, 150)
    }
  }

  return undefined
}

/**
 * Infer category from file path
 */
function inferCategory(filePath: string, rootDir: string, frontmatter: DocFrontmatter): string {
  // 1. Use frontmatter category if available
  if (frontmatter.category) {
    if (Array.isArray(frontmatter.category)) {
      return frontmatter.category[0]
    }
    return frontmatter.category
  }

  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
  const parts = relativePath.split('/')

  // 2. Week directories (handle both week-N-* and weeks/week-N-* patterns)
  for (const part of parts) {
    const weekMatch = part.match(/^week-(\d+)-?/)
    if (weekMatch) {
      return `week-${weekMatch[1]}`
    }
  }

  // 3. Root files - determine by name pattern
  if (parts.length === 1) {
    const filename = parts[0] || ''

    if (filename === 'Index.md' || filename === 'README.md') {
      return 'reference'
    }

    return 'misc'
  }

  return 'uncategorized'
}

/**
 * Generate category display name from ID
 */
function getCategoryDisplayName(categoryId: string): string {
  const weekMatch = categoryId.match(/^week-(\d+)$/)
  if (weekMatch) {
    return `Week ${weekMatch[1]}`
  }

  const names: Record<string, string> = {
    'reference': 'Reference',
    'misc': 'Miscellaneous',
    'uncategorized': 'Uncategorized',
  }

  return names[categoryId] || titleCase(categoryId)
}

/**
 * Convert a kebab-case or snake_case string to Title Case
 */
function titleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Generate category description
 */
function getCategoryDescription(categoryId: string): string {
  const weekMatch = categoryId.match(/^week-(\d+)$/)
  if (weekMatch) {
    return `Materials for Week ${weekMatch[1]}`
  }

  const descriptions: Record<string, string> = {
    'reference': 'Index and reference documentation',
    'misc': 'Additional notes and resources',
    'uncategorized': 'Other documents',
  }

  return descriptions[categoryId] || ''
}

/**
 * Generate a URL-safe ID from a string
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a unique ID for a document
 */
function generateId(
  filePath: string,
  category: string,
  existingIds: Set<string>,
  frontmatter: DocFrontmatter
): string {
  // 1. Use frontmatter ID if available
  if (frontmatter.id) {
    return frontmatter.id
  }

  // 2. Generate from category + filename
  const basename = path.basename(filePath, '.md')
  const baseId = `${category}-${slugify(basename)}`

  // 3. Handle collisions
  let id = baseId
  let counter = 1

  while (existingIds.has(id)) {
    id = `${baseId}-${counter}`
    counter++
  }

  return id
}

/**
 * Scan a directory recursively for markdown files
 * Uses configured glob patterns to discover files
 */
function scanDirectory(dir: string, rootDir: string, markdownFiles: string[]): void {
  if (shouldIgnore(dir)) {
    return
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name)

    if (entry.isDirectory()) {
      scanDirectory(fullPath, rootDir, markdownFiles)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      // Check if file matches discovery patterns
      if (!shouldIgnore(fullPath) && matchesDiscoveryPatterns(fullPath, rootDir)) {
        markdownFiles.push(fullPath)
      }
    }
  }
}

/**
 * Extract metadata from a markdown file
 */
function extractMetadata(filePath: string, rootDir: string, existingIds: Set<string>): DocFile | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data: frontmatter, content: markdownContent } = matter(content)

    const fm = frontmatter as DocFrontmatter

    // Check if file should be excluded
    if (fm.draft) {
      return null
    }

    // Check if file is published (for non-auto-discovered locations)
    const isAutoDiscovered = isAutoDiscoveredLocation(filePath, rootDir)
    if (!isAutoDiscovered && !fm.published) {
      return null
    }

    const category = inferCategory(filePath, rootDir, fm)
    const id = generateId(filePath, category, existingIds, fm)

    // Mark ID as used
    existingIds.add(id)

    const title = extractTitle(markdownContent, fm, path.basename(filePath))
    const description = extractDescription(markdownContent, fm)

    // Generate path (absolute from project root, starting with /)
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
    const docPath = `/${relativePath}`

    return {
      id,
      title,
      category,
      path: docPath,
      description,
      order: fm.order,
    }
  } catch (error) {
    console.warn(`Warning: Could not process file ${filePath}: ${error}`)
    return null
  }
}

/**
 * Generate the documentation catalog
 */
export function generateCatalog(rootDir: string = contentDir): GeneratedCatalog {
  // Use configured content directory if not specified
  const scanDir = rootDir === process.cwd() ? contentDir : rootDir

  console.log('Scanning for markdown files...')
  console.log(`Scan directory: ${scanDir}`)

  const markdownFiles: string[] = []
  scanDirectory(scanDir, scanDir, markdownFiles)

  console.log(`Found ${markdownFiles.length} markdown files`)

  // Handle empty state
  if (markdownFiles.length === 0) {
    console.warn('No markdown files found in the configured directory.')
    console.warn('Please check your configuration:')
    console.warn('  1. Verify contentDir points to a directory with markdown files')
    console.warn('  2. Check that patterns match your file structure')
    console.warn('  3. Ensure files are not being ignored by the ignore patterns')
    return { docFiles: [], docCategories: [] }
  }

  const docFiles: DocFile[] = []
  const existingIds = new Set<string>()

  for (const filePath of markdownFiles) {
    const metadata = extractMetadata(filePath, rootDir, existingIds)
    if (metadata) {
      docFiles.push(metadata)
    }
  }

  console.log(`Generated ${docFiles.length} document entries`)

  // Group by category
  const categoryMap = new Map<string, DocFile[]>()
  for (const file of docFiles) {
    if (!categoryMap.has(file.category)) {
      categoryMap.set(file.category, [])
    }
    categoryMap.get(file.category)!.push(file)
  }

  // Sort files within each category by order, then title
  for (const files of categoryMap.values()) {
    files.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      return a.title.localeCompare(b.title)
    })
  }

  // Create categories
  const docCategories: DocCategory[] = Array.from(categoryMap.entries())
    .map(([categoryId, files]) => ({
      id: categoryId,
      name: getCategoryDisplayName(categoryId),
      description: getCategoryDescription(categoryId),
      files,
    }))
    .sort((a, b) => {
      // Sort weeks numerically, other categories alphabetically
      const weekMatchA = a.id.match(/^week-(\d+)$/)
      const weekMatchB = b.id.match(/^week-(\d+)$/)

      if (weekMatchA && weekMatchB) {
        return parseInt(weekMatchA[1], 10) - parseInt(weekMatchB[1], 10)
      }

      if (weekMatchA) return -1
      if (weekMatchB) return 1

      return a.name.localeCompare(b.name)
    })

  return { docFiles, docCategories }
}
