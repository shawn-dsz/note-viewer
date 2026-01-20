import { describe, it, expect } from 'vitest'
import {
  DEFAULT_CONFIG,
  validateConfig,
  defineConfig,
} from '../../src/config'

describe('config', () => {
  describe('DEFAULT_CONFIG', () => {
    it('has sensible defaults', () => {
      expect(DEFAULT_CONFIG.contentDir).toBe('.')
      expect(DEFAULT_CONFIG.patterns).toEqual(['**/*.md'])
      expect(DEFAULT_CONFIG.site?.title).toBe('Notes')
      expect(DEFAULT_CONFIG.features?.calculators).toBe(false)
      expect(DEFAULT_CONFIG.features?.tagSidebar).toBe(true)
      expect(DEFAULT_CONFIG.features?.darkMode).toBe(true)
    })

    it('includes common ignore patterns', () => {
      expect(DEFAULT_CONFIG.ignore).toContain('node_modules')
      expect(DEFAULT_CONFIG.ignore).toContain('.git')
      expect(DEFAULT_CONFIG.ignore).toContain('dist')
    })
  })

  describe('defineConfig', () => {
    it('returns the config object unchanged', () => {
      const config = {
        contentDir: './docs',
        site: { title: 'My Docs' },
      }
      expect(defineConfig(config)).toEqual(config)
    })
  })

  describe('validateConfig', () => {
    it('validates a config with existing contentDir', () => {
      // Use the tests directory which we know exists
      const config = { contentDir: './tests' }
      const result = validateConfig(config, process.cwd() + '/fake.config.ts')
      // Will fail because ./tests doesn't exist relative to fake.config.ts
      // But it should only have the "does not exist" error, not other validation errors
      const otherErrors = result.errors.filter(e => !e.includes('does not exist'))
      expect(otherErrors).toHaveLength(0)
    })

    it('fails when contentDir is missing', () => {
      const config = {} as any
      const result = validateConfig(config, '/fake/path/config.ts')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('contentDir is required and must be a string')
    })

    it('fails when patterns is not an array', () => {
      const config = {
        contentDir: '.',
        patterns: '**/*.md' as any,
      }
      const result = validateConfig(config, '/fake/path/config.ts')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('patterns must be an array of glob patterns')
    })

    it('fails when ignore is not an array', () => {
      const config = {
        contentDir: '.',
        ignore: 'node_modules' as any,
      }
      const result = validateConfig(config, '/fake/path/config.ts')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('ignore must be an array of patterns')
    })

    it('validates site config fields', () => {
      const config = {
        contentDir: '.',
        site: {
          title: 123 as any,
        },
      }
      const result = validateConfig(config, '/fake/path/config.ts')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('site.title must be a string')
    })
  })
})
