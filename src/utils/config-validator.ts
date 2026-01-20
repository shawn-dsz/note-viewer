/**
 * Configuration validator with helpful error messages
 */

import type { NotesViewerConfig } from '../config.js'
import path from 'path'
import fs from 'fs'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate configuration and provide helpful error messages
 */
export function validateConfigWithDetails(
  config: NotesViewerConfig,
  configPath: string
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate contentDir
  if (!config.contentDir || typeof config.contentDir !== 'string') {
    errors.push('contentDir is required and must be a string')
  } else {
    const configDir = path.dirname(configPath)
    const resolvedContentDir = path.resolve(configDir, config.contentDir)

    if (!fs.existsSync(resolvedContentDir)) {
      errors.push(`contentDir does not exist: ${resolvedContentDir}`)
      warnings.push(`Create the directory or update contentDir path`)
    } else if (!fs.statSync(resolvedContentDir).isDirectory()) {
      errors.push(`contentDir is not a directory: ${resolvedContentDir}`)
    }
  }

  // Validate patterns if provided
  if (config.patterns) {
    if (!Array.isArray(config.patterns)) {
      errors.push('patterns must be an array of glob patterns')
    } else {
      for (let i = 0; i < config.patterns.length; i++) {
        if (typeof config.patterns[i] !== 'string') {
          errors.push(`patterns[${i}] must be a string (got ${typeof config.patterns[i]})`)
        }
      }
      if (config.patterns.length === 0) {
        warnings.push('patterns array is empty - no files will be discovered')
      }
    }
  }

  // Validate ignore if provided
  if (config.ignore) {
    if (!Array.isArray(config.ignore)) {
      errors.push('ignore must be an array of directory/file patterns')
    } else {
      for (let i = 0; i < config.ignore.length; i++) {
        if (typeof config.ignore[i] !== 'string') {
          errors.push(`ignore[${i}] must be a string`)
        }
      }
    }
  }

  // Validate categories if provided
  if (config.categories) {
    if (typeof config.categories !== 'object' || Array.isArray(config.categories)) {
      errors.push('categories must be an object mapping category IDs to config')
    } else {
      for (const [categoryId, categoryConfig] of Object.entries(config.categories)) {
        if (typeof categoryConfig !== 'object' || Array.isArray(categoryConfig)) {
          errors.push(`categories.${categoryId} must be an object`)
        } else {
          if (categoryConfig.color && typeof categoryConfig.color !== 'string') {
            errors.push(`categories.${categoryId}.color must be a string`)
          }
          if (categoryConfig.label && typeof categoryConfig.label !== 'string') {
            errors.push(`categories.${categoryId}.label must be a string`)
          }
          if (categoryConfig.description && typeof categoryConfig.description !== 'string') {
            errors.push(`categories.${categoryId}.description must be a string`)
          }
        }
      }
    }
  }

  // Validate site if provided
  if (config.site) {
    if (typeof config.site !== 'object' || Array.isArray(config.site)) {
      errors.push('site must be an object with optional title and description')
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
    warnings,
  }
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(result: ValidationResult): string {
  const lines: string[] = []

  if (result.errors.length > 0) {
    lines.push('❌ Configuration Errors:')
    for (const error of result.errors) {
      lines.push(`   ${error}`)
    }
  }

  if (result.warnings.length > 0) {
    lines.push('')
    lines.push('⚠️  Configuration Warnings:')
    for (const warning of result.warnings) {
      lines.push(`   ${warning}`)
    }
  }

  if (result.valid) {
    lines.unshift('✓ Configuration is valid')
  }

  return lines.join('\n')
}
