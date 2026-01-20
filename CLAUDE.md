# Note Viewer - Project Instructions

## Project Overview

Note Viewer is a configurable static markdown documentation viewer. It can be pointed at any markdown directory to create a beautiful, browsable documentation site.

## Architecture

```
note-viewer/
├── bin/cli.ts                   # CLI: note-viewer init|dev|build|preview
├── src/
│   ├── build/scanner.ts         # Auto-discovery of markdown files
│   ├── components/              # React components
│   ├── contexts/ThemeContext.tsx
│   ├── data/
│   │   ├── defaults/            # Default emojis, tags, colors
│   │   ├── docs.ts              # Data exports
│   │   └── docs-generated.ts    # Auto-generated catalog
│   ├── pages/                   # Page components
│   ├── types/docs.ts            # TypeScript types
│   ├── config.ts                # Configuration schema
│   ├── App.tsx
│   └── main.tsx
├── templates/
│   └── note-viewer.config.ts    # Template for `init` command
├── tests/
│   ├── fixtures/sample-notes/   # Test markdown files
│   └── unit/                    # Unit tests
├── scripts/
│   └── generate-docs-catalog.ts # Catalog generator
└── note-viewer.config.ts        # Local config (Operations course)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/config.ts` | Configuration schema and loading |
| `src/build/scanner.ts` | Markdown file discovery |
| `src/data/defaults/*.ts` | Default emojis, tags, colors |
| `bin/cli.ts` | CLI commands |
| `scripts/generate-docs-catalog.ts` | Build-time catalog generation |

## Common Workflows

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server (runs catalog generator first)
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Adding New Features

When adding features that affect how markdown files are processed:
1. Modify `src/build/scanner.ts` for file discovery
2. Update `src/config.ts` for new config options
3. Update `scripts/generate-docs-catalog.ts` to include new data

When adding new UI features:
1. Check if it should be behind a feature flag in `features` config
2. Update relevant components to read from config
3. Add defaults in `src/data/defaults/`

### Configuration System

Config is loaded at build time by `scanner.ts` and baked into `docs-generated.ts`.

The config schema supports:
- `contentDir`: Directory with markdown files
- `patterns`: Glob patterns for file discovery
- `ignore`: Patterns to ignore
- `site`: Title, description, icon
- `categories`: Per-category emoji/label/color
- `tags`: Tag definitions with colors
- `tagRules`: Auto-tag detection rules
- `features`: Feature toggles (calculators, tagSidebar, darkMode)
- `theme`: Light/dark theme overrides

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run e2e tests
npm run test:e2e
```

## Publishing

The package is configured for npm publishing:
- `bin`: CLI entry point
- `files`: Include necessary files
- `exports`: ESM exports for config helpers

To publish:
```bash
npm version patch
npm publish
```
