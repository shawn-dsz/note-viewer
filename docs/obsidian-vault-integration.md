# Plan: Obsidian Vault Web Viewer

## Overview

Use the general-purpose `note-viewer` app to view the Obsidian vault at `/Users/shawn/Documents/Obsidian Vault`.

The note-viewer is designed to work with **any** markdown folder - configuration lives in the target folder, not in note-viewer itself. The main work involves:
1. Creating a `note-viewer.config.ts` in the Obsidian vault folder
2. Enhancing note-viewer to handle Obsidian-specific features (wiki-links, folder structure)
3. Optimizing for the vault's scale (~4,000 markdown files)

---

## Architecture Decision

**Approach**: Configuration file lives in the Obsidian vault folder. Run note-viewer from within that folder.

**Why this approach**:
- note-viewer remains general-purpose and reusable
- Each content folder has its own configuration
- Same pattern as other "serve this folder" tools (e.g., `npx serve`)
- Changes in Obsidian are immediately visible

**Usage pattern**:
```bash
cd "/Users/shawn/Documents/Obsidian Vault"
npx note-viewer dev
# or: note-viewer dev (if globally installed)
```

---

## Implementation Plan

### Phase 1: Configuration Setup

**File**: `<vault-folder>/note-viewer.config.ts`

Create config in the vault folder:
```typescript
import { defineConfig } from 'note-viewer'

export default defineConfig({
  contentDir: './Notes',  // Relative to config file location
  patterns: ['**/*.md'],
  ignore: [
    'node_modules', '.git', '.obsidian', '.claude', '.specify',
    'Archive'  // Skip archived content initially
  ],
  site: {
    title: 'Obsidian Vault',
    description: 'Personal Knowledge Base',
    icon: '🧠'
  },
  categories: {
    // Map vault folders to display names and emojis
    'Daily': { label: 'Daily Notes', emoji: '📅' },
    'Inbox': { label: 'Inbox', emoji: '📥' },
    'Work': { label: 'Work', emoji: '💼' },
    'Learning': { label: 'Learning', emoji: '📚' },
    'Content': { label: 'Content', emoji: '✍️' },
    'Resources': { label: 'Resources', emoji: '🔗' },
    'Personal': { label: 'Personal', emoji: '👤' },
    'People': { label: 'People', emoji: '👥' },
    'Projects': { label: 'Projects', emoji: '🎯' },
    'Reference': { label: 'Reference', emoji: '📖' },
    'Tasks': { label: 'Tasks', emoji: '✅' }
  },
  features: {
    tagSidebar: true,
    darkMode: true,
    search: true,
    calculators: false
  }
})
```

### Phase 2: Scanner Enhancements

**Files to modify**:
- `src/build/scanner.ts` - Enhance category inference for nested folders

**Changes needed**:

1. **Better category inference** - Use first-level folder under content dir as category:
   ```typescript
   // Current: inferCategory uses week-N pattern
   // New: Use top-level folder name (Daily, Work, Learning, etc.)
   ```

2. **Skip `published` requirement** - Many vaults don't use `published: true` frontmatter. Modify `extractMetadata` to include all files in auto-discovered mode.

3. **Handle large file counts** - Add pagination or lazy loading for categories with 400+ files.

### Phase 3: Wiki-Link Support

**File**: `src/components/MarkdownRenderer.tsx`

Add Obsidian wiki-link transformation:
```typescript
// Transform [[Link]] to internal app links
// Transform [[Link|Display Text]] to links with custom text
// Add remark plugin or pre-process content
```

**Implementation approach**:
- Create a custom remark plugin `remark-wiki-links.ts`
- Transform `[[Note Name]]` → `[Note Name](/doc/note-name)`
- Handle aliased links `[[Note Name|Display]]` → `[Display](/doc/note-name)`
- Build a lookup table from the catalog for link resolution

### Phase 4: Frontmatter Display Enhancement

**File**: `src/pages/DocPage.tsx`

Enhance to display common frontmatter fields:
- `type` badge (Page, DailyNote, Meeting, etc.)
- `date` field formatted appropriately
- `source`/`url` as clickable links
- `tags` array (already supported)

### Phase 5: Navigation Optimization

**Files**:
- `src/components/Sidebar.tsx` - Handle deep nesting (e.g., Work/Belong/Meetings)
- `src/pages/HomePage.tsx` - Show category cards with file counts

**Changes**:
1. Support full path hierarchy (Work → Belong → Meetings → etc.)
2. Add file count badges to categories
3. Implement virtual scrolling for large lists (400+ files)
4. Collapsible tree structure in sidebar for deep hierarchies

---

## File Changes Summary

### In target folder (e.g., Obsidian Vault)
| File | Action | Description |
|------|--------|-------------|
| `note-viewer.config.ts` | Create | Configuration for this folder |

### In note-viewer app
| File | Action | Description |
|------|--------|-------------|
| `src/build/scanner.ts` | Modify | Category inference for folder hierarchies, remove published requirement |
| `src/components/MarkdownRenderer.tsx` | Modify | Add wiki-link support |
| `src/utils/wikiLinks.ts` | Create | Wiki-link transformation utilities |
| `src/pages/DocPage.tsx` | Modify | Display common frontmatter fields (type, date, source) |
| `src/components/Sidebar.tsx` | Modify | Handle nested categories with collapsible tree |

---

## Verification Plan

1. **Configuration validation**:
   ```bash
   cd "<target-folder>"
   npx note-viewer generate:catalog
   # Should output file count
   ```

2. **Dev server test**:
   ```bash
   cd "<target-folder>"
   npx note-viewer dev
   # Open http://localhost:5173
   # Verify: Categories appear in sidebar
   # Verify: Can navigate to notes
   # Verify: Wiki-links are clickable
   ```

3. **Content rendering checks**:
   - Open a note with frontmatter → verify metadata displays
   - Open a note with wiki-links → verify links resolve
   - Search for a term → verify search works

4. **Performance validation**:
   - Sidebar loads without lag
   - Large categories scroll smoothly
   - Search returns results quickly

---

## Design Decisions

1. **Media handling**: Display images inline for full visual experience
2. **Archive content**: Skip `Archive/` folder initially to focus on active content
3. **Deep nesting**: Show full path hierarchy for precise navigation

---

## Alternative Approaches Considered

1. **Config in note-viewer**: Put vault-specific config in the note-viewer project
   - ❌ Couples note-viewer to a specific use case
   - ❌ Makes note-viewer less reusable

2. **Copy/sync approach**: Copy vault contents to note-viewer/docs
   - ❌ Creates duplication and sync problems
   - ❌ Breaks existing file management

3. **API backend**: Add Express server to serve content
   - ❌ More complex than needed
   - ❌ Unnecessary given Vite's static file serving

**Chosen**: Config lives in target folder. note-viewer reads from current directory. This follows the pattern of tools like `vite`, `next`, `serve` etc.
