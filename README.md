# Note Viewer

A beautiful, configurable static documentation viewer for markdown files. Point it at any directory and get a polished, browsable documentation site.

## Features

- **Automatic discovery** - Scans directories for markdown files
- **Category organization** - Groups files by folder structure
- **Tag system** - Auto-detect or define custom tags
- **Dark mode** - Built-in light/dark theme toggle
- **Responsive** - Works on desktop and mobile
- **Fast** - Static site generation with Vite

## Quick Start

### 1. Install

```bash
npm install note-viewer
```

### 2. Initialize

```bash
npx note-viewer init
```

This creates a `note-viewer.config.ts` in your project.

### 3. Configure

Edit the config file to point to your markdown files:

```typescript
import { defineConfig } from 'note-viewer'

export default defineConfig({
  contentDir: './docs',  // Directory with your markdown files
  site: {
    title: 'My Documentation',
    description: 'Project documentation',
  },
})
```

### 4. Run

```bash
npx note-viewer dev     # Start development server
npx note-viewer build   # Build for production
npx note-viewer preview # Preview production build
```

## Configuration

### Basic Options

```typescript
export default defineConfig({
  // Required: Directory containing markdown files
  contentDir: '.',

  // File patterns to include (default: ['**/*.md'])
  patterns: ['**/*.md', 'docs/**/*.mdx'],

  // Directories to ignore
  ignore: ['node_modules', 'dist', '.git'],

  // Site metadata
  site: {
    title: 'My Notes',
    description: 'Personal knowledge base',
    icon: '📓',  // Sidebar icon
  },
})
```

### Category Configuration

Categories are auto-detected from folder names. Customize them:

```typescript
categories: {
  'my-folder': {
    label: 'Custom Label',
    emoji: '🎉',
    description: 'Optional description',
  },
}
```

### Tag System

Define custom tags with colors:

```typescript
tags: {
  'important': { name: 'Important', bg: '#FFE5D9', text: '#9C6644' },
  'draft': { name: 'Draft', bg: '#E8DEF8', text: '#6B5B95' },
},

// Auto-detect tags based on keywords
tagRules: [
  { tag: 'important', keywords: ['urgent', 'critical'] },
],
```

### Feature Toggles

```typescript
features: {
  calculators: false,  // Custom calculator widgets
  tagSidebar: true,    // Tag search sidebar
  darkMode: true,      // Dark mode toggle
  search: true,        // Search functionality
},
```

### Theme Customization

Override CSS variables for light/dark themes:

```typescript
theme: {
  light: {
    '--accent-color': '#2383e2',
    '--bg-primary': '#ffffff',
  },
  dark: {
    '--accent-color': '#5c9ce6',
    '--bg-primary': '#191919',
  },
},
```

## Markdown Frontmatter

Add frontmatter to customize individual files:

```markdown
---
title: Custom Title
description: File description
category: my-category
tags:
  - important
  - reference
order: 1
draft: false
---

# My Document
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `note-viewer init` | Create config file |
| `note-viewer dev` | Start dev server |
| `note-viewer build` | Build for production |
| `note-viewer preview` | Preview production build |

### Options

```bash
note-viewer dev --port 3000 --host  # Custom port, expose to network
note-viewer build --outDir ./build  # Custom output directory
note-viewer init --force            # Overwrite existing config
```

## Project Structure

When deployed, your project should look like:

```
my-project/
├── docs/                      # Your markdown files
│   ├── getting-started.md
│   └── api/
│       └── reference.md
├── note-viewer.config.ts      # Configuration
└── package.json               # devDependency: note-viewer
```

## License

MIT
