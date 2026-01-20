/**
 * Configuration system for note-viewer
 * Allows the viewer to be pointed at any markdown directory
 */

import path from 'path'
import fs from 'fs'
import { mergeCategoryThemes as mergeThemes } from './data/categoryColors.js'

export interface CategoryConfig {
  label?: string
  emoji?: string         // Per-category emoji
  color?: string
  description?: string
}

export interface SiteConfig {
  title?: string
  description?: string
  icon?: string          // Sidebar icon emoji
  favicon?: string       // Favicon path
}

export interface TagConfig {
  name: string
  bg: string
  text: string
}

export interface TagRule {
  tag: string
  keywords: string[]
}

export interface FeaturesConfig {
  calculators?: boolean   // Default: false
  tagSidebar?: boolean    // Default: true
  darkMode?: boolean      // Default: true
  search?: boolean        // Default: true
}

export interface ThemeConfig {
  light?: Record<string, string>
  dark?: Record<string, string>
}

export interface NotesViewerConfig {
  // Directory containing the markdown content (relative to this config file)
  contentDir: string

  // Auto-discovery patterns (relative to contentDir)
  patterns?: string[]

  // Directories/files to ignore
  ignore?: string[]

  // Category configuration (optional - auto-detects if not specified)
  categories?: Record<string, CategoryConfig>

  // Site metadata
  site?: SiteConfig

  // Tag definitions
  tags?: Record<string, TagConfig>

  // Auto-tag detection rules
  tagRules?: TagRule[]

  // Feature toggles
  features?: FeaturesConfig

  // Theme customization
  theme?: ThemeConfig
}

/**
 * Helper function to define configuration
 * This is exported for use in notes-viewer.config.ts
 */
export function defineConfig(config: NotesViewerConfig): NotesViewerConfig {
  return config
}

/**
 * Merge category themes from config
 * This function applies user-defined categories to the color themes
 */
export function mergeCategoryThemes(userCategories: Record<string, CategoryConfig>): void {
  mergeThemes(userCategories)
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: NotesViewerConfig = {
  contentDir: '.',
  patterns: ['**/*.md'],
  ignore: [
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
    'note-viewer',
    'src',
    'scripts',
  ],
  categories: {},
  site: {
    title: 'Notes',
    description: 'Markdown documentation viewer',
    icon: '📓',
  },
  tags: {},
  tagRules: [],
  features: {
    calculators: false,
    tagSidebar: true,
    darkMode: true,
    search: true,
  },
  theme: {},
}

/**
 * Validate configuration and return helpful errors
 */
export function validateConfig(config: NotesViewerConfig, configPath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate contentDir
  if (!config.contentDir || typeof config.contentDir !== 'string') {
    errors.push('contentDir is required and must be a string')
  } else {
    // Resolve contentDir relative to config file
    const configDir = path.dirname(configPath)
    const resolvedContentDir = path.resolve(configDir, config.contentDir)

    if (!fs.existsSync(resolvedContentDir)) {
      errors.push(`contentDir does not exist: ${resolvedContentDir}`)
    }
  }

  // Validate patterns if provided
  if (config.patterns) {
    if (!Array.isArray(config.patterns)) {
      errors.push('patterns must be an array of glob patterns')
    } else {
      for (let i = 0; i < config.patterns.length; i++) {
        if (typeof config.patterns[i] !== 'string') {
          errors.push(`patterns[${i}] must be a string`)
        }
      }
    }
  }

  // Validate ignore if provided
  if (config.ignore) {
    if (!Array.isArray(config.ignore)) {
      errors.push('ignore must be an array of patterns')
    }
  }

  // Validate categories if provided
  if (config.categories) {
    if (typeof config.categories !== 'object' || Array.isArray(config.categories)) {
      errors.push('categories must be an object mapping category IDs to config')
    }
  }

  // Validate site if provided
  if (config.site) {
    if (typeof config.site !== 'object' || Array.isArray(config.site)) {
      errors.push('site must be an object with title and description')
    } else {
      if (config.site.title && typeof config.site.title !== 'string') {
        errors.push('site.title must be a string')
      }
      if (config.site.description && typeof config.site.description !== 'string') {
        errors.push('site.description must be a string')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Load and parse configuration file
 * Returns sensible defaults if configuration file doesn't exist
 */
export async function loadConfig(configPath: string): Promise<NotesViewerConfig> {
  if (!fs.existsSync(configPath)) {
    console.warn(`Configuration file not found: ${configPath}`)
    console.warn('Using default configuration - scanning current directory for *.md files')
    return {
      ...DEFAULT_CONFIG,
      contentDir: '.',  // Scan current directory by default
      patterns: ['**/*.md'],
    }
  }

  try {
    // Use dynamic import for ESM compatibility
    const configModule = await import(configPath)
    const userConfig = configModule.default || configModule

    // Merge with defaults
    const config: NotesViewerConfig = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      categories: {
        ...DEFAULT_CONFIG.categories,
        ...userConfig.categories,
      },
      site: {
        ...DEFAULT_CONFIG.site,
        ...userConfig.site,
      },
      tags: {
        ...DEFAULT_CONFIG.tags,
        ...userConfig.tags,
      },
      tagRules: userConfig.tagRules || DEFAULT_CONFIG.tagRules,
      features: {
        ...DEFAULT_CONFIG.features,
        ...userConfig.features,
      },
      theme: {
        light: { ...DEFAULT_CONFIG.theme?.light, ...userConfig.theme?.light },
        dark: { ...DEFAULT_CONFIG.theme?.dark, ...userConfig.theme?.dark },
      },
    }

    // Validate configuration
    const validation = validateConfig(config, configPath)
    if (!validation.valid) {
      console.error(`Configuration errors in ${configPath}:`)
      for (const error of validation.errors) {
        console.error(`  - ${error}`)
      }
      throw new Error('Invalid configuration')
    }

    return config
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'MODULE_NOT_FOUND' || (error as NodeJS.ErrnoException).code === 'ERR_MODULE_NOT_FOUND') {
      console.warn(`Could not load configuration file: ${configPath}`)
      console.warn('Using default configuration.')
      return { ...DEFAULT_CONFIG }
    }
    throw error
  }
}

/**
 * Get the resolved content directory path
 */
export function getContentDir(config: NotesViewerConfig, configPath: string): string {
  const configDir = path.dirname(configPath)
  return path.resolve(configDir, config.contentDir)
}
