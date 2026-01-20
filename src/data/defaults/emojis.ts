/**
 * Default emoji mappings for categories
 * These are generic defaults that work for any notes collection
 */

import type { CategoryConfig } from '../../config.js'

// Partial config type for helper functions
interface PartialConfig {
  categories?: Record<string, CategoryConfig>
}

/**
 * Default emojis for common category patterns
 * Users can override these in their config
 */
export const DEFAULT_CATEGORY_EMOJIS: Record<string, string> = {
  // Folder/file defaults
  'default': '📁',
  'file': '📄',

  // Common category names
  'reference': '📚',
  'misc': '📋',
  'uncategorized': '📋',
  'docs': '📖',
  'documentation': '📖',
  'notes': '📝',
  'readme': '📖',
  'index': '🏠',
  'home': '🏠',
  'getting-started': '🚀',
  'guide': '📘',
  'tutorial': '🎓',
  'api': '⚡',
  'config': '⚙️',
  'configuration': '⚙️',
  'setup': '🔧',
  'install': '📦',
  'examples': '💡',
  'faq': '❓',
  'changelog': '📋',
  'contributing': '🤝',
  'license': '📜',
}

/**
 * Get emoji for a category ID
 * Checks config first, then falls back to defaults
 */
export function getCategoryEmoji(categoryId: string, config?: PartialConfig): string {
  // Check user-defined category emoji in config
  if (config?.categories?.[categoryId]?.emoji) {
    return config.categories[categoryId].emoji!
  }

  // Check default emojis
  const normalizedId = categoryId.toLowerCase()
  if (DEFAULT_CATEGORY_EMOJIS[normalizedId]) {
    return DEFAULT_CATEGORY_EMOJIS[normalizedId]
  }

  // Return default folder emoji
  return DEFAULT_CATEGORY_EMOJIS['default']
}

/**
 * Get display name for a category ID
 * Checks config first, then falls back to titlecase
 */
export function getCategoryDisplayName(
  categoryId: string,
  fallback: string,
  config?: PartialConfig
): string {
  // Check user-defined label in config
  if (config?.categories?.[categoryId]?.label) {
    return config.categories[categoryId].label!
  }

  // Use the provided fallback (usually the auto-detected name)
  return fallback
}
