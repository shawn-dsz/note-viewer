# Research: Documentation Website

**Feature**: Documentation Website (001-doc-site)
**Date**: 2026-01-14
**Purpose**: Resolve technical unknowns from Phase 0 of implementation planning

## Research Questions

From the Technical Context in plan.md, the following unknowns require research:

1. Rendering approach: Static site generator vs. dynamic server vs. client-side only
2. Markdown library: Which markdown parser/renderer to use
3. Search implementation: Client-side search index vs. server-side search
4. Deployment model: Local development server vs. static hosting
5. Framework choice: Minimal static site generator vs. full web framework

---

## Decision 1: Rendering Approach

**Question**: Should we use a static site generator, a dynamic server, or a client-side only approach?

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Static Site Generator (SSG)** | Pre-build all HTML at "compile time" from markdown files | Fastest page loads, simplest hosting, no server needed | Requires rebuild when content changes, search requires pre-built index |
| **Dynamic Server** | Server reads markdown files and renders on each request | Always shows current content, easy development | Requires server process, slower than static |
| **Client-Side Only** | Browser fetches raw markdown and renders in JavaScript | No backend needed, simple deployment | CORS issues with local files, slower initial load |

### Decision: **Static Site Generator with Watch Mode**

**Rationale**:
- Best performance meets spec requirements (<3s page load)
- Simplest deployment (can serve static files)
- Watch mode enables "live" preview during development
- Search can be pre-built as JSON index
- Industry standard for documentation sites (Jekyll, Hugo, Docusaurus, MkDocs)

**Alternatives Considered**: Dynamic server rejected for performance and complexity; client-side only rejected for CORS limitations with local file:// access.

---

## Decision 2: Markdown Library

**Question**: Which markdown parsing and rendering library should we use?

### Options Evaluated

| Option | Language | Pros | Cons |
|--------|----------|------|------|
| **markdown-it** | JavaScript | Full CommonMark + GFM compliance, extensible, fast | Requires JS build tooling |
| **marked** | JavaScript | Simple, fast, widely used | Fewer features than markdown-it |
| **remark** | JavaScript | AST-based, highly extensible | More complex for simple use cases |
| **Python-Markdown** | Python | Native Python, extensible | Slower than JS options |
| **MkDocs** | Python | Full-featured SSG built for docs | Heavy dependency, may be overkill |

### Decision: **markdown-it**

**Rationale**:
- Complete CommonMark and GitHub Flavored Markdown support
- Syntax highlighting integration via highlight.js
- Extensible plugin ecosystem
- Fast and lightweight
- Works well with both static generation and dynamic rendering

**Alternatives Considered**: MkDocs was considered as a full-featured alternative but introduces heavy dependencies for a "simple" doc site. Python-Markdown rejected for slower performance.

---

## Decision 3: Search Implementation

**Question**: Should search be client-side or server-side?

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Client-side Search Index** | Pre-build JSON search index, load in browser | Fast (<100ms), no server load, works offline | Index size grows with content, initial download |
| **Server-side Search** | Query backend API for search results | Smaller client bundle, can search full text | Requires server, network latency, <2s requirement may be tight |
| **External Search Service** | Use Algolia, Fuse.js, etc. | Full-featured, fast | External dependency, complex setup |

### Decision: **Client-side Search Index (FlexSearch)**

**Rationale**:
- Meets <2s search requirement easily (typically <100ms)
- No server required after initial build
- FlexSearch provides excellent performance and relevance
- Index size for 1,000 markdown files is manageable (<5MB compressed)
- Works with static hosting

**Alternatives Considered**: Server-side search rejected for added complexity; external services rejected for over-engineering a simple local doc site.

---

## Decision 4: Deployment Model

**Question**: Should this run as a local development server or be deployable as static hosting?

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Local Dev Server Only** | Node.js/Python server that must be running | Simple to develop, always shows current content | Requires server process, not easily shareable |
| **Static Hosting** | Pre-built HTML/CSS/JS files can be served anywhere | Deployable anywhere (GitHub Pages, Netlify, S3), fast | Requires rebuild for content changes |
| **Hybrid** | Build static files but serve with local watch mode for development | Best of both worlds | Slightly more complex setup |

### Decision: **Hybrid Approach**

**Rationale**:
- Development: Watch mode server with auto-rebuild on content changes
- Production: Static files deployable anywhere
- Provides best developer experience and deployment flexibility
- Matches how most static site generators work (Jekyll, Hugo, etc.)

**Alternatives Considered**: Local-only rejected for lack of deployment option; static-only rejected for poor development experience.

---

## Decision 5: Framework Choice

**Question**: Should we use a minimal static site generator or a full web framework?

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **Custom SSG with Vite** | Build our own SSG using Vite + markdown-it | Full control, minimal dependencies, fast builds | More initial development work |
| **VitePress** | Vue-powered SSG by Vite team | Fast, Vue-based, good for docs | Vue-specific, may be overkill |
| **Astro** | Modern SSG with framework flexibility | Very fast, framework-agnostic | Newer ecosystem |
| **Next.js** | React-based full framework | Very popular, rich ecosystem | Heavy for a simple doc site |
| **Express + Custom** | Server-side rendering with Express | Simple, flexible | More manual work for static generation |

### Decision: **Custom SSG with Vite and markdown-it**

**Rationale**:
- Vite provides fast dev server and optimized production builds
- markdown-it gives us markdown parsing control
- No opinionated UI framework - keeps it "simple" as requested
- Can use vanilla JS or lightweight framework (Alpine.js, Petite-Vue)
- Minimal dependencies, easy to understand
- Fast builds meet performance requirements

**Alternatives Considered**: VitePress and Astro rejected as overkill for "simple" requirement; Next.js rejected as too heavy; Express rejected for not being optimized for static generation.

---

## Final Technology Stack

Based on the research decisions above, the technology stack is:

**Backend/Build System**:
- Node.js 18+ (build tooling)
- Vite 5+ (dev server + build optimizer)
- TypeScript 5+ (type safety)

**Frontend**:
- Vanilla JavaScript with TypeScript (or Alpine.js if reactivity needed)
- markdown-it (markdown parsing)
- highlight.js (syntax highlighting for code blocks)
- FlexSearch (client-side search)

**Styling**:
- Tailwind CSS (via PostCSS - fast, flexible, modern)
- Or: Plain CSS with CSS variables (even simpler)

**Testing**:
- Vitest (unit tests, integrated with Vite)
- Playwright (end-to-end browser tests)

**Project Structure**:
- Single package with frontend + build scripts
- No separate backend - static files served directly
- Build script generates static HTML/CSS/JS from markdown source

---

## Performance Validation

The chosen stack validates against spec requirements:

| Requirement | Approach | Validation |
|-------------|----------|------------|
| <3s page load | Static HTML + CSS/JS | Static files load fast, Vite optimizes bundle |
| <2s search for 1,000 files | FlexSearch client-side index | Typical search: 10-100ms for 1,000 docs |
| 1,000 file support | Static generation with lazy loading | Build time scales linearly, runtime is O(1) |
| Markdown rendering | markdown-it + highlight.js | Industry standard, battle-tested |

---

## Open Questions

None - all technical unknowns from Phase 0 have been resolved.

---

## Next Steps

Proceed to Phase 1: Design & Contracts
- Generate data-model.md (entities from spec)
- Generate API contracts (internal build API, not HTTP)
- Generate quickstart.md (development setup)
