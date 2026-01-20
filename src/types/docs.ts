/**
 * Types for documentation catalog generation
 */

export interface DocFrontmatter {
  /** Title override for the document */
  title?: string

  /** Description override for the document */
  description?: string

  /** Category override (ID or array of IDs) */
  category?: string | string[]

  /** Custom ID override (for stable URLs) */
  id?: string

  /** If true, exclude from catalog regardless of location */
  draft?: boolean

  /** If true, include in catalog (required for files outside auto-discovered locations) */
  published?: boolean

  /** Sort order within category (lower = first) */
  order?: number

  /** Custom tags/metadata (preserved but not used by system) */
  [key: string]: any
}

export interface DocFile {
  /** Unique identifier for routing (e.g., 'week-1-guide') */
  id: string

  /** Display title for the document */
  title: string

  /** Category ID for grouping */
  category: string

  /** Absolute path to markdown file (e.g., '/weeks/week-1/file.md') */
  path: string

  /** Optional description for the document */
  description?: string

  /** Sort order within category */
  order?: number

  /** Tags/keywords for the document */
  tags?: string[]
}

/** Tag configuration with color */
export interface TagConfig {
  /** Tag display name */
  name: string
  /** Background color (warm Notion-style) */
  bg: string
  /** Text color */
  text: string
}

export interface DocCategory {
  /** Category ID (e.g., 'week-1') */
  id: string

  /** Display name for the category */
  name: string

  /** Description of the category */
  description: string

  /** Optional color theme ID (defaults to category.id if not specified) */
  colorTheme?: string

  /** Emoji icon for the category */
  emoji?: string

  /** Files in this category */
  files: DocFile[]
}

export interface GeneratedCatalog {
  /** All registered doc files */
  docFiles: DocFile[]

  /** Categories with their files */
  docCategories: DocCategory[]
}
