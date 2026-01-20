import { describe, it, expect } from 'vitest'
import {
  getCategoryEmoji,
  getCategoryDisplayName,
  DEFAULT_CATEGORY_EMOJIS,
} from '../../src/data/defaults/emojis'
import {
  getTagConfig,
  autoDetectTags,
  TAG_COLORS,
} from '../../src/data/defaults/tags'

describe('default emojis', () => {
  describe('DEFAULT_CATEGORY_EMOJIS', () => {
    it('has common category emojis', () => {
      expect(DEFAULT_CATEGORY_EMOJIS['docs']).toBe('📖')
      expect(DEFAULT_CATEGORY_EMOJIS['reference']).toBe('📚')
      expect(DEFAULT_CATEGORY_EMOJIS['default']).toBe('📁')
    })
  })

  describe('getCategoryEmoji', () => {
    it('returns default emoji for unknown category', () => {
      expect(getCategoryEmoji('unknown-category')).toBe('📁')
    })

    it('returns emoji from defaults', () => {
      expect(getCategoryEmoji('reference')).toBe('📚')
      expect(getCategoryEmoji('docs')).toBe('📖')
    })

    it('uses config override when provided', () => {
      const config = {
        categories: {
          'my-category': { emoji: '🎉' },
        },
      }
      expect(getCategoryEmoji('my-category', config)).toBe('🎉')
    })

    it('falls back to default if config has no emoji', () => {
      const config = {
        categories: {
          'my-category': { label: 'My Category' },
        },
      }
      expect(getCategoryEmoji('my-category', config)).toBe('📁')
    })
  })

  describe('getCategoryDisplayName', () => {
    it('returns fallback for unknown category', () => {
      expect(getCategoryDisplayName('unknown', 'Unknown Category')).toBe('Unknown Category')
    })

    it('uses config label when provided', () => {
      const config = {
        categories: {
          'my-category': { label: 'Custom Label' },
        },
      }
      expect(getCategoryDisplayName('my-category', 'Fallback', config)).toBe('Custom Label')
    })
  })
})

describe('default tags', () => {
  describe('TAG_COLORS', () => {
    it('has color palette', () => {
      expect(TAG_COLORS.cream).toBeDefined()
      expect(TAG_COLORS.cream.bg).toMatch(/^#[0-9A-F]{6}$/i)
      expect(TAG_COLORS.cream.text).toMatch(/^#[0-9A-F]{6}$/i)
    })
  })

  describe('getTagConfig', () => {
    it('returns default warm gray for unknown tag', () => {
      const config = getTagConfig('unknown-tag')
      expect(config.name).toBe('unknown-tag')
      expect(config.bg).toBe(TAG_COLORS.warmGray.bg)
      expect(config.text).toBe(TAG_COLORS.warmGray.text)
    })

    it('uses config tag when provided', () => {
      const config = {
        tags: {
          'important': { name: 'Important!', bg: '#FF0000', text: '#FFFFFF' },
        },
      }
      const result = getTagConfig('important', config)
      expect(result.name).toBe('Important!')
      expect(result.bg).toBe('#FF0000')
    })
  })

  describe('autoDetectTags', () => {
    it('returns empty array with no rules', () => {
      expect(autoDetectTags('Test Title', 'Test description')).toEqual([])
    })

    it('detects tags based on rules', () => {
      const config = {
        tagRules: [
          { tag: 'important', keywords: ['urgent', 'critical'] },
          { tag: 'draft', keywords: ['draft', 'wip'] },
        ],
      }
      const result = autoDetectTags('Urgent: Fix the bug', 'This is critical', config)
      expect(result).toContain('important')
    })

    it('limits to max 3 tags', () => {
      const config = {
        tagRules: [
          { tag: 'tag1', keywords: ['keyword1'] },
          { tag: 'tag2', keywords: ['keyword2'] },
          { tag: 'tag3', keywords: ['keyword3'] },
          { tag: 'tag4', keywords: ['keyword4'] },
        ],
      }
      const result = autoDetectTags(
        'keyword1 keyword2 keyword3 keyword4',
        undefined,
        config
      )
      expect(result).toHaveLength(3)
    })
  })
})
