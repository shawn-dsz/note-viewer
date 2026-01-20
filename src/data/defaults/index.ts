/**
 * Default configuration values
 * Re-exports all defaults from a single entry point
 */

export { DEFAULT_CATEGORY_EMOJIS, getCategoryEmoji, getCategoryDisplayName } from './emojis.js'
export { TAG_COLORS, getTagConfig, autoDetectTags } from './tags.js'
export {
  DEFAULT_LIGHT_THEME,
  DEFAULT_DARK_THEME,
  getLightTheme,
  getDarkTheme,
} from './colors.js'
