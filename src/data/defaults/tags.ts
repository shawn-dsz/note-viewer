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
 * Strip markdown elements that shouldn't be scanned for tags
 * Removes: fenced code blocks, URLs, HTML tags
 * KEEPS: inline backticks (for formula detection like `I = R × T`)
 */
function stripMarkdownNoise(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')           // fenced code blocks only
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // keep link text, remove URL
    .replace(/<[^>]+>/g, '')                  // HTML tags
    .replace(/https?:\/\/\S+/g, '')           // bare URLs
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Extract tags from markdown content using tagRules
 * Uses strict word boundary matching (\b)
 * Returns tags sorted by frequency (no limit - caller handles truncation)
 */
export function extractTagsFromContent(
  content: string,
  config?: PartialConfig
): string[] {
  const cleanContent = stripMarkdownNoise(content).toLowerCase()
  const detected: Map<string, number> = new Map()

  const rules = config?.tagRules || []

  for (const rule of rules) {
    for (const keyword of rule.keywords) {
      const regex = new RegExp(`\\b${escapeRegex(keyword.toLowerCase())}\\b`, 'g')
      const matches = cleanContent.match(regex)
      if (matches) {
        detected.set(rule.tag, (detected.get(rule.tag) || 0) + matches.length)
      }
    }
  }

  // Sort by frequency (descending), no truncation here
  return [...detected.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
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
 * Auto-detect tags from document title, description, and content
 * Uses tagRules from config if provided
 * Uses strict word boundary matching to prevent false positives
 */
export function autoDetectTags(
  title: string,
  description: string | undefined,
  config?: PartialConfig,
  content?: string
): string[] {
  const titleDesc = `${title} ${description || ''}`.toLowerCase()
  const detected: string[] = []

  // Use config tagRules if provided
  const rules = config?.tagRules || []

  // Check title and description first
  for (const rule of rules) {
    if (rule.keywords.some(kw => {
      const regex = new RegExp(`\\b${escapeRegex(kw.toLowerCase())}\\b`)
      return regex.test(titleDesc)
    })) {
      detected.push(rule.tag)
    }
  }

  // Also extract from content if provided
  if (content) {
    const contentTags = extractTagsFromContent(content, config)
    for (const tag of contentTags) {
      if (!detected.includes(tag)) {
        detected.push(tag)
      }
    }
  }

  // No truncation here - let caller decide max
  return [...new Set(detected)]
}
