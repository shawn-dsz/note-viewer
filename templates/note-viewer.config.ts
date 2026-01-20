/**
 * note-viewer configuration
 * @see https://github.com/note-viewer/note-viewer
 */
export default {
  // Directory containing your markdown files (relative to this config file)
  contentDir: '.',

  // File patterns to include
  patterns: ['**/*.md'],

  // Directories to ignore
  ignore: ['node_modules', 'dist', '.git'],

  // Site metadata
  site: {
    title: 'My Notes',
    description: 'Personal knowledge base',
    icon: '📓',
  },

  // Feature toggles
  features: {
    calculators: false,  // Enable calculator widgets
    tagSidebar: true,    // Enable tag search sidebar
    darkMode: true,      // Enable dark mode toggle
    search: true,        // Enable search (coming soon)
  },

  // Category configuration (optional)
  // Map category IDs (derived from folder names) to display settings
  // categories: {
  //   'my-category': {
  //     label: 'My Category',
  //     emoji: '📁',
  //     description: 'Description of this category',
  //   }
  // },

  // Tag definitions (optional)
  // Define custom tags with colors
  // tags: {
  //   'important': { name: 'Important', bg: '#FFE5D9', text: '#9C6644' },
  //   'draft': { name: 'Draft', bg: '#E8DEF8', text: '#6B5B95' },
  // },

  // Auto-tag detection rules (optional)
  // Automatically apply tags based on keywords in titles/descriptions
  // tagRules: [
  //   { tag: 'important', keywords: ['urgent', 'critical', 'important'] },
  //   { tag: 'draft', keywords: ['draft', 'wip', 'work in progress'] },
  // ],

  // Theme customization (optional)
  // Override CSS variables for light/dark themes
  // theme: {
  //   light: {
  //     '--accent-color': '#2383e2',
  //   },
  //   dark: {
  //     '--accent-color': '#5c9ce6',
  //   },
  // },
}
