/**
 * Category theme configuration
 * Simplified to use single Indigo accent color (professional design)
 */

import type { CategoryConfig } from '../config.js'

export interface CategoryTheme {
  id: string
  name: string
  gradient: string
  solid: string
  glow: string
  from: string
  to: string
}

// Professional Indigo theme (used for all categories)
const INDIGO_THEME: CategoryTheme = {
  id: 'default',
  name: 'Default',
  gradient: 'none', // No gradients in professional design
  solid: 'var(--brand-primary)',
  glow: 'none', // No glows in professional design
  from: '#4f46e5',
  to: '#4f46e5',
}

// Runtime cache of merged themes (maintains interface for backward compatibility)
let categoryThemes: Record<string, CategoryTheme> = {}

/**
 * Merge user-defined categories with default themes
 * This should be called at startup with the configuration
 */
export function mergeCategoryThemes(userCategories: Record<string, CategoryConfig>): void {
  categoryThemes = {}

  for (const [categoryId, config] of Object.entries(userCategories)) {
    const label = config.label || categoryId

    // All categories use the same Indigo theme
    categoryThemes[categoryId] = {
      ...INDIGO_THEME,
      id: categoryId,
      name: label,
    }
  }
}

/**
 * Export the themes for backward compatibility
 * @deprecated Use getCategoryTheme() instead
 */
export { categoryThemes }

export function getCategoryTheme(_categoryId: string): CategoryTheme {
  // Return the same Indigo theme for all categories
  return INDIGO_THEME
}
