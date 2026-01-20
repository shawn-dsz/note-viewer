/**
 * Default color palette for themes
 * Can be customized via config.theme
 */

import type { ThemeConfig } from '../../config.js'

/**
 * Default light theme colors
 */
export const DEFAULT_LIGHT_THEME: Record<string, string> = {
  '--bg-primary': '#ffffff',
  '--bg-secondary': '#f7f7f5',
  '--bg-tertiary': '#f0f0ed',
  '--text-primary': '#37352f',
  '--text-secondary': '#6b6b6b',
  '--text-muted': '#9b9b9b',
  '--border-color': '#e5e5e3',
  '--accent-color': '#2383e2',
  '--accent-hover': '#1a6bbc',
  '--link-color': '#2383e2',
  '--code-bg': '#f0f0ed',
  '--sidebar-bg': '#fbfbfa',
  '--sidebar-hover': '#f0f0ed',
  '--sidebar-active': '#e8e8e5',
}

/**
 * Default dark theme colors
 */
export const DEFAULT_DARK_THEME: Record<string, string> = {
  '--bg-primary': '#191919',
  '--bg-secondary': '#202020',
  '--bg-tertiary': '#2d2d2d',
  '--text-primary': '#e6e6e6',
  '--text-secondary': '#a0a0a0',
  '--text-muted': '#6b6b6b',
  '--border-color': '#3d3d3d',
  '--accent-color': '#5c9ce6',
  '--accent-hover': '#4a8ad4',
  '--link-color': '#5c9ce6',
  '--code-bg': '#2d2d2d',
  '--sidebar-bg': '#1e1e1e',
  '--sidebar-hover': '#2d2d2d',
  '--sidebar-active': '#3a3a3a',
}

/**
 * Get the merged light theme with user overrides
 */
export function getLightTheme(config?: { theme?: ThemeConfig }): Record<string, string> {
  return {
    ...DEFAULT_LIGHT_THEME,
    ...config?.theme?.light,
  }
}

/**
 * Get the merged dark theme with user overrides
 */
export function getDarkTheme(config?: { theme?: ThemeConfig }): Record<string, string> {
  return {
    ...DEFAULT_DARK_THEME,
    ...config?.theme?.dark,
  }
}
