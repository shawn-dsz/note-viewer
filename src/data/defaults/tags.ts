/**
 * Default tag configuration
 * Tags are entirely opt-in via config - no defaults are applied
 */

import type { TagConfig, TagRule } from '../../config.js'

// Partial config type for helper functions
interface PartialConfig {
  tags?: Record<string, TagConfig>
  tagRules?: TagRule[]
}

/**
 * Default tag color palette
 * Warm, Notion-style colors - soft pastels that don't overpower
 */
export const TAG_COLORS = {
  // Warm earth tones
  cream: { bg: '#FAF3DD', text: '#8B7355' },
  peach: { bg: '#FFE5D9', text: '#9C6644' },
  coral: { bg: '#FFD7C4', text: '#B85C38' },
  sand: { bg: '#F5E6CA', text: '#8B7355' },

  // Soft pastels
  lavender: { bg: '#E8DEF8', text: '#6B5B95' },
  mint: { bg: '#D4EDDA', text: '#4A7C59' },
  sky: { bg: '#D6EAF8', text: '#5D6D7E' },
  blush: { bg: '#FCE4EC', text: '#AD5D6E' },

  // Muted tones
  sage: { bg: '#E8F0E4', text: '#5F7161' },
  dustyRose: { bg: '#F4E1E6', text: '#9E6B7D' },
  warmGray: { bg: '#EDEBE8', text: '#6B6B6B' },
  butter: { bg: '#FFF8DC', text: '#9C8B4A' },
} as const

/**
 * Get tag configuration by tag name
 * Checks config first, then returns a default warm gray tag
 */
export function getTagConfig(tag: string, config?: PartialConfig): TagConfig {
  const normalized = tag.toLowerCase().replace(/\s+/g, '-')

  // Check user-defined tags in config
  if (config?.tags?.[normalized]) {
    return config.tags[normalized]
  }

  // Return default warm gray tag
  return {
    name: tag,
    ...TAG_COLORS.warmGray
  }
}

/**
 * Auto-detect tags from document title and description
 * Uses tagRules from config if provided
 */
export function autoDetectTags(
  title: string,
  description: string | undefined,
  config?: PartialConfig
): string[] {
  const text = `${title} ${description || ''}`.toLowerCase()
  const detected: string[] = []

  // Use config tagRules if provided
  const rules = config?.tagRules || []

  for (const rule of rules) {
    if (rule.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      detected.push(rule.tag)
    }
  }

  return [...new Set(detected)].slice(0, 3) // Max 3 tags
}
