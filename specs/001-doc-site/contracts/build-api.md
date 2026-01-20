# API Contracts: Documentation Website Build System

**Feature**: Documentation Website (001-doc-site)
**Date**: 2026-01-14
**Purpose**: Define internal APIs for the build system (not HTTP - these are module interfaces)

## Overview

This document defines the contracts (interfaces) between build system modules. These are TypeScript/JavaScript module interfaces, not REST endpoints. The static site has no runtime backend.

---

## Contract 1: FileScanner

**Module**: `src/build/filescanner.ts`

**Purpose**: Scan repository filesystem and build FileSystemNode tree

**Interface**:

```typescript
interface FileScanner {
  /**
   * Scan the repository root and build a complete file tree
   * @param rootPath - Absolute path to repository root
   * @param options - Scan options
   * @returns Promise<FileSystemNode> - Root node with full tree
   */
  scan(
    rootPath: string,
    options?: ScanOptions
  ): Promise<FileSystemNode>;

  /**
   * Filter tree to only include specific file types
   * @param tree - Root node to filter
   * @param extensions - Array of extensions to include (e.g., ['.md'])
   * @returns Filtered FileSystemNode tree
   */
  filterByExtension(
    tree: FileSystemNode,
    extensions: string[]
  ): FileSystemNode;
}

interface ScanOptions {
  /** Ignore patterns (e.g., ['node_modules', '.git']) */
  ignore?: string[];
  /** Maximum depth to scan (0 = unlimited) */
  maxDepth?: number;
  /** Follow symbolic links */
  followSymlinks?: boolean;
}
```

**Preconditions**:
- `rootPath` must exist and be a directory
- Process must have read permissions for `rootPath`

**Postconditions**:
- Returned tree is complete snapshot at scan time
- Tree is immutable (further filesystem changes not reflected)

**Error Handling**:
- Throws `ScanError` if `rootPath` doesn't exist
- Throws `PermissionError` if lacking read permissions
- Logs warnings for individual files that cannot be read

---

## Contract 2: MarkdownParser

**Module**: `src/build/markdown-parser.ts`

**Purpose**: Parse markdown files and extract metadata

**Interface**:

```typescript
interface MarkdownParser {
  /**
   * Parse markdown content and extract metadata
   * @param content - Raw markdown string
   * @param filePath - File path for error reporting
   * @returns Parsed MarkdownFile object
   */
  parse(
    content: string,
    filePath: string
  ): MarkdownFile;

  /**
   * Extract heading hierarchy from markdown
   * @param content - Raw markdown string
   * @returns Array of top-level headings with nested children
   */
  extractHeadings(content: string): Heading[];

  /**
   * Strip markdown syntax to plain text for search
   * @param content - Raw markdown string
   * @returns Plain text content
   */
  stripMarkdown(content: string): string;
}
```

**Preconditions**:
- `content` is valid UTF-8 string
- `filePath` is valid file path (for error messages)

**Postconditions**:
- Returned `MarkdownFile` has all required fields populated
- `heading.id` values are URL-safe and unique within document
- `stripMarkdown` returns text without markdown syntax

**Error Handling**:
- Throws `ParseError` if markdown is malformed
- Logs warnings for non-standard markdown that's rendered anyway

---

## Contract 3: SearchIndexer

**Module**: `src/build/search-indexer.ts`

**Purpose**: Build search index from markdown files

**Interface**:

```typescript
interface SearchIndexer {
  /**
   * Build search index from array of markdown files
   * @param files - Array of parsed MarkdownFile objects
   * @returns Search index ready for serialization
   */
  buildIndex(files: MarkdownFile[]): SearchDocument[];

  /**
   * Serialize index to JSON file
   * @param index - Search index to serialize
   * @param outputPath - Path to write search-index.json
   * @returns Promise<void>
   */
  serialize(index: SearchDocument[], outputPath: string): Promise<void>;
}

interface SearchIndexOptions {
  /** Include frontmatter in searchable content */
  includeFrontmatter?: boolean;
  /** Boost title relevance vs content */
  titleBoost?: number;
  /** Maximum snippet length for results */
  snippetLength?: number;
}
```

**Preconditions**:
- `files` array is non-empty
- All `MarkdownFile.path` values are unique

**Postconditions**:
- Each `MarkdownFile` maps to exactly one `SearchDocument`
- Index is optimized for fast client-side querying

**Error Handling**:
- Throws `IndexError` if duplicate paths detected
- Throws `WriteError` if `outputPath` is not writable

---

## Contract 4: PageGenerator

**Module**: `src/build/page-generator.ts`

**Purpose**: Generate HTML pages from markdown content

**Interface**:

```typescript
interface PageGenerator {
  /**
   * Generate HTML for a single markdown file
   * @param markdownFile - Parsed markdown file
   * @param context - Build context for template rendering
   * @returns Generated HTML string
   */
  generatePage(
    markdownFile: MarkdownFile,
    context: BuildContext
  ): Promise<string>;

  /**
   * Generate index page (file listing)
   * @param fileTree - FileSystemNode tree
   * @param context - Build context
   * @returns Generated HTML string
   */
  generateIndex(
    fileTree: FileSystemNode,
    context: BuildContext
  ): Promise<string>;

  /**
   * Write HTML file to output directory
   * @param html - HTML content
   * @param outputPath - Relative output path
   * @returns Promise<void>
   */
  writePage(html: string, outputPath: string): Promise<void>;
}

interface BuildContext {
  /** Site title */
  siteName: string;
  /** Base URL for links */
  baseUrl: string;
  /** Breadcrumb path for current page */
  breadcrumb?: Breadcrumb[];
  /** Related pages for navigation */
  related?: RelatedPages;
}
```

**Preconditions**:
- Output directory exists and is writable
- Template assets are available

**Postconditions**:
- Generated HTML is valid and complete
- Internal links are relative and correct
- Assets (CSS, JS) are referenced correctly

**Error Handling**:
- Throws `RenderError` if template rendering fails
- Throws `WriteError` if output file cannot be written

---

## Contract 5: BuildOrchestrator

**Module**: `src/build/orchestrator.ts`

**Purpose**: Coordinate the entire build process

**Interface**:

```typescript
interface BuildOrchestrator {
  /**
   * Run full build process
   * @param config - Build configuration
   * @returns Promise<BuildResult>
   */
  build(config: BuildConfig): Promise<BuildResult>;

  /**
   * Run watch mode (rebuild on changes)
   * @param config - Build configuration
   * @returns Promise<WatchHandle> - Call close() to stop watching
   */
  watch(config: BuildConfig): Promise<WatchHandle>;
}

interface BuildConfig {
  /** Source directory (repository root) */
  inputDir: string;
  /** Output directory for generated site */
  outputDir: string;
  /** Site metadata */
  siteName: string;
  baseUrl: string;
  /** File extensions to include */
  includeExtensions: string[];
}

interface BuildResult {
  /** Number of pages generated */
  pagesGenerated: number;
  /** Number of files indexed for search */
  filesIndexed: number;
  /** Build duration in milliseconds */
  duration: number;
  /** Output directory path */
  outputPath: string;
}

interface WatchHandle {
  /** Stop watching and close */
  close(): Promise<void>;
}
```

**Preconditions**:
- `inputDir` exists and is readable
- `outputDir` is writable (created if doesn't exist)

**Postconditions**:
- `outputDir` contains complete static site
- Search index exists at `outputDir/search-index.json`
- All HTML pages are generated and linked correctly

**Error Handling**:
- Throws `ConfigError` if config is invalid
- Throws `BuildError` if build fails partially (reports what succeeded)

---

## Contract 6: DevServer

**Module**: `src/dev/server.ts`

**Purpose**: Development server with hot reload

**Interface**:

```typescript
interface DevServer {
  /**
   * Start development server
   * @param options - Server options
   * @returns Promise<ServerHandle>
   */
  start(options: DevServerOptions): Promise<ServerHandle>;
}

interface DevServerOptions {
  /** Port to listen on */
  port: number;
  /** Output directory to serve */
  outputDir: string;
  /** Enable hot module replacement */
  hmr?: boolean;
  /** Open browser automatically */
  open?: boolean;
}

interface ServerHandle {
  /** Server URL */
  url: string;
  /** Stop the server */
  close(): Promise<void>;
}
```

**Preconditions**:
- `outputDir` exists and contains built site
- `port` is available (not in use)

**Postconditions**:
- Server is listening on `http://localhost:port`
- Browser opens if `open: true`
- Changes trigger rebuild and page refresh if `hmr: true`

**Error Handling**:
- Throws `PortInUseError` if port is occupied
- Throws `ServerError` if server fails to start

---

## Client-Side Contracts

These are browser APIs, not build modules.

### Contract 7: SearchClient

**Module**: `src/client/search.ts`

**Interface**:

```typescript
interface SearchClient {
  /**
   * Initialize search index
   * @param indexUrl - URL to search-index.json
   */
  init(indexUrl: string): Promise<void>;

  /**
   * Search for query term
   * @param query - Search query string
   * @returns Array of search results sorted by relevance
   */
  search(query: string): SearchResult[];
}
```

---

### Contract 8: NavigationClient

**Module**: `src/client/navigation.ts`

**Interface**:

```typescript
interface NavigationClient {
  /**
   * Get current path from URL
   * @returns Current file path or empty string for index
   */
  getCurrentPath(): string;

  /**
   * Navigate to a file or folder
   * @param path - Relative path to navigate to
   */
  navigate(path: string): void;
}
```

---

## Testing Contracts

### Contract 9: Test Fixtures

**Module**: `tests/fixtures/index.ts`

**Interface**:

```typescript
interface TestFixtures {
  /** Get mock FileSystemNode for testing */
  mockFileTree(): FileSystemNode;

  /** Get mock MarkdownFile for testing */
  mockMarkdownFile(overrides?: Partial<MarkdownFile>): MarkdownFile;

  /** Get sample markdown content */
  sampleMarkdown(): string;
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-14 | Initial contracts for documentation website |
