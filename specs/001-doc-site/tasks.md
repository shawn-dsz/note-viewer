# Implementation Tasks: Documentation Website

**Feature**: Documentation Website (001-doc-site)
**Branch**: `001-doc-site`
**Date**: 2026-01-14
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Overview

This document contains all implementation tasks organized by user story to enable independent development, testing, and deployment of each feature increment.

**Total Tasks**: 42
**User Stories**: 3 (P1: Browse Files, P2: Navigate Folders, P3: Search)
**MVP Scope**: User Story 1 only (13 tasks)

---

## Task Format Legend

- `[P]` = Parallelizable (can run simultaneously with other [P] tasks)
- `[US1]` = User Story 1 (Browse Markdown Files)
- `[US2]` = User Story 2 (Navigate Folder Structure)
- `[US3]` = User Story 3 (Search Content)

---

## Phase 1: Setup

**Goal**: Initialize project structure and tooling

### Tasks

- [X] T001 Initialize Node.js project with package.json in repository root
- [X] T002 [P] Install build dependencies: vite, typescript, markdown-it, highlight.js
- [X] T003 [P] Install search dependency: flexsearch
- [X] T004 [P] Install testing dependencies: vitest, @playwright/test
- [X] T005 [P] Install styling: tailwindcss, postcss, autoprefixer
- [X] T006 [P] Create TypeScript configuration in tsconfig.json
- [X] T007 [P] Create Vite configuration in vite.config.ts
- [X] T008 [P] Create Tailwind configuration in tailwind.config.js
- [X] T009 Create project directories: src/build, src/client, src/types, src/styles, tests/unit, tests/e2e
- [X] T010 Create site configuration in src/config/site.ts with name, baseUrl, description
- [ ] T011 Create type definitions in src/types/models.ts for FileSystemNode, MarkdownFile, Heading, SearchDocument, SearchResult, Breadcrumb

**Completion Criteria**: `pnpm install` succeeds, `pnpm run build` exists (even if empty)

---

## Phase 2: Foundational Infrastructure

**Goal**: Build shared infrastructure required by all user stories

### Tasks

- [X] T012 Implement FileSystemNode interface and factory in src/build/models/file-system-node.ts
- [X] T013 [P] Implement FileScanner.scan() in src/build/filescanner.ts with directory traversal
- [X] T014 [P] Implement FileScanner.filterByExtension() in src/build/filescanner.ts
- [X] T015 [P] Implement MarkdownParser.parse() in src/build/markdown-parser.ts using markdown-it
- [X] T016 [P] Implement MarkdownParser.extractHeadings() in src/build/markdown-parser.ts
- [X] T017 [P] Implement MarkdownParser.stripMarkdown() in src/build/markdown-parser.ts for plain text extraction
- [X] T018 Create base CSS with Tailwind in src/styles/main.css
- [X] T019 Create HTML page template in src/build/templates/page-template.ts
- [X] T020 Implement BuildOrchestrator.build() orchestration in src/build/orchestrator.ts
- [X] T021 Implement BuildOrchestrator.watch() for file watching in src/build/orchestrator.ts
- [X] T022 [P] Add build script to package.json: "build": "tsx src/build/cli.ts build"
- [X] T023 [P] Add dev script to package.json: "dev": "tsx src/build/cli.ts watch"
- [X] T024 Create CLI entry point in src/build/cli.ts with build/watch commands

**Completion Criteria**: `pnpm run build` generates dist/ with files, `pnpm run dev` starts watch mode

---

## Phase 3: User Story 1 - Browse Markdown Files (P1)

**Story Goal**: Users can view a list of files/folders and click to view rendered markdown content

**Independent Test**: Navigate to website, verify file list appears, click a .md file, confirm content renders with formatting

**Acceptance Scenarios**:
1. User visits site → sees file/folder list
2. User clicks .md file → content displays with rendered markdown
3. Content contains headings/lists/code → renders correctly with styling
4. User scrolls → all content visible and readable

### Tasks

#### Models & Types

- [X] T025 [US1] Implement MarkdownFile interface in src/build/models/markdown-file.ts with content, title, headings, wordCount

#### Build System

- [X] T026 [US1] Implement PageGenerator.generatePage() in src/build/page-generator.ts for individual markdown files
- [X] T027 [US1] Implement PageGenerator.generateIndex() in src/build/page-generator.ts for file listing page
- [X] T028 [US1] Implement PageGenerator.writePage() in src/build/page-generator.ts for HTML output
- [X] T029 [US1] Create markdown rendering pipeline in src/build/renderers/markdown-renderer.ts with syntax highlighting

#### Client Components

- [X] T030 [US1] Create FileList component in src/client/components/file-list.ts to display files/folders
- [X] T031 [US1] Create MarkdownViewer component in src/client/markdown-viewer.ts to render markdown HTML
- [X] T032 [US1] Create NavigationClient in src/client/navigation.ts for URL-based file navigation

#### Styling

- [X] T033 [US1] Create file list styles in src/styles/file-list.css
- [X] T034 [US1] Create markdown content styles in src/styles/markdown.css with proper typography
- [X] T035 [US1] Add code block syntax highlighting styles in src/styles/code.css

#### Integration

- [X] T036 [US1] Wire FileList + MarkdownViewer in client entry point src/client/main.ts
- [X] T037 [US1] Update BuildOrchestrator to generate index page and all markdown pages in src/build/orchestrator.ts

**Completion Criteria**:
- Visit site → see list of files/folders
- Click any .md file → page loads with rendered content
- Headings, lists, code blocks render with proper styling
- No broken navigation or broken links

---

## Phase 4: User Story 2 - Navigate Folder Structure (P2)

**Story Goal**: Users can click folders to navigate, see breadcrumbs, and return to parents

**Independent Test**: Click folders, verify file list updates, use breadcrumbs to navigate back

**Acceptance Scenarios**:
1. User clicks folder → view updates to show folder contents
2. User in subdirectory → breadcrumb trail shows full path
3. User clicks breadcrumb segment → navigates to that level
4. User views file list → parent navigation available

### Tasks

#### Models & Types

- [ ] T038 [US2] Implement Breadcrumb interface in src/build/models/breadcrumb.ts with label, path, isCurrent

#### Build System

- [ ] T039 [US2] Update PageGenerator.generateIndex() to accept path parameter in src/build/page-generator.ts
- [ ] T040 [US2] Add breadcrumb generation to BuildContext in src/build/templates/page-template.ts

#### Client Components

- [ ] T041 [US2] Create Breadcrumb component in src/client/components/breadcrumb.ts
- [ ] T042 [US2] Update FileList to handle folder navigation in src/client/components/file-list.ts
- [ ] T043 [US2] Update NavigationClient to handle folder paths in src/client/navigation.ts

#### Styling

- [ ] T044 [US2] Create breadcrumb styles in src/styles/breadcrumb.css
- [ ] T045 [US2] Update file list styles for folder icons in src/styles/file-list.css

#### Integration

- [ ] T046 [US2] Wire Breadcrumb component into page template in src/build/templates/page-template.ts
- [ ] T047 [US2] Update BuildOrchestrator to generate pages for all directories in src/build/orchestrator.ts

**Completion Criteria**:
- Click folder → navigate to folder contents
- Breadcrumb shows path (e.g., Home > Week 1 > Materials)
- Click breadcrumb segment → navigate to that level
- All navigation works without page reload

---

## Phase 5: User Story 3 - Search Content (P3)

**Story Goal**: Users can search text across all markdown files and see matching results

**Independent Test**: Enter search term, verify results appear with matching files, click result to open file

**Acceptance Scenarios**:
1. User enters search term → matching files displayed
2. Results displayed → user clicks result → markdown file opens
3. No matches exist → "no results found" message shown

### Tasks

#### Models & Types

- [ ] T048 [US3] Implement SearchDocument interface in src/build/models/search-document.ts
- [ ] T049 [US3] Implement SearchResult interface in src/build/models/search-result.ts

#### Build System

- [ ] T050 [US3] Implement SearchIndexer.buildIndex() in src/build/search-indexer.ts using FlexSearch
- [ ] T051 [US3] Implement SearchIndexer.serialize() in src/build/search-indexer.ts to write search-index.json
- [ ] T052 [US3] Update BuildOrchestrator to generate search index in src/build/orchestrator.ts

#### Client Components

- [ ] T053 [US3] Implement SearchClient.init() in src/client/search.ts to load search-index.json
- [ ] T054 [US3] Implement SearchClient.search() in src/client/search.ts using FlexSearch
- [ ] T055 [US3] Create SearchBox component in src/client/components/search-box.ts
- [ ] T056 [US3] Create SearchResults component in src/client/components/search-results.ts

#### Styling

- [ ] T057 [US3] Create search box styles in src/styles/search.css
- [ ] T058 [US3] Create search results styles in src/styles/search.css

#### Integration

- [ ] T059 [US3] Wire SearchBox + SearchResults in client entry src/client/main.ts
- [ ] T060 [US3] Add search index to dist output in BuildOrchestrator

**Completion Criteria**:
- Type in search box → results appear in <2 seconds
- Results show filename and snippet
- Click result → navigate to that file
- "No results found" appears for empty queries

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Handle edge cases, optimize performance, improve UX

### Tasks

#### Edge Case Handling

- [ ] T061 Handle empty markdown files (show empty state message)
- [ ] T062 Handle folders with no markdown files (show "no files" message)
- [ ] T063 Handle special characters in filenames (URL encode/decode)
- [ ] T064 Handle broken internal links (preserve, add warning class)
- [ ] T065 Handle very large files (>1MB) - add loading indicator
- [ ] T066 Handle non-.md extensions (filter out gracefully)

#### Performance

- [ ] T067 Optimize search index size (compress, lazy load)
- [ ] T068 Add loading indicators for page transitions
- [ ] T069 Implement code splitting for large markdown bundles

#### UX Improvements

- [ ] T070 Add 404 page for missing files
- [ ] T071 Add keyboard navigation (arrow keys, enter)
- [ ] T072 Add scroll-to-top button
- [ ] T073 Add dark mode toggle (optional)
- [ ] T074 Add print styles

#### Documentation

- [ ] T075 Update README.md with usage instructions
- [ ] T076 Update quickstart.md with any deviations from plan
- [ ] T077 Add CONTRIBUTING.md if open sourcing

---

## Dependencies & Execution Order

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1: Browse Files) ← MVP COMPLETE
    ↓
Phase 4 (US2: Navigate Folders)
    ↓
Phase 5 (US3: Search)
    ↓
Phase 6 (Polish)
```

**User Story Dependencies**:
- US2 depends on US1 (needs file list and markdown viewing)
- US3 is independent of US2 (search works without folder navigation)
- All stories depend on Phase 2 (foundational infrastructure)

---

## Parallel Execution Opportunities

### Phase 1 (Setup)
- T002, T003, T004, T005 can run in parallel (independent package installs)
- T006, T007, T008 can run in parallel (independent config files)

### Phase 2 (Foundational)
- T013-T017 can run in parallel (independent module implementations)
- T022, T023 can run in parallel (independent npm scripts)

### Phase 3 (US1)
- T030, T031 can run in parallel (independent components)
- T033-T035 can run in parallel (independent styles)

### Phase 4 (US2)
- T041, T042 can run in parallel (independent components)
- T044, T045 can run in parallel (independent styles)

### Phase 5 (US3)
- T055, T056 can run in parallel (independent components)
- T057, T058 can run in parallel (independent styles)

---

## MVP Scope (Minimum Viable Product)

**Suggested MVP**: Phase 1 + Phase 2 + Phase 3 (US1 only)

**Rationale**:
- US1 delivers core value: view markdown files in browser
- 25 tasks total (manageable for initial release)
- Independently testable and deployable
- Validates core technology choices

**MVP Task List**: T001-T037

**MVP Excludes**:
- Folder navigation (US2) - users can still access root-level files
- Search (US3) - users can still browse manually
- Polish phase - can be added incrementally

---

## Incremental Delivery Strategy

### Release 1: MVP (US1 only)
- Deliver basic markdown viewer
- Get user feedback on rendering quality
- Validate performance assumptions

### Release 2: Add Navigation (US1 + US2)
- Add folder navigation
- Improve browsing experience
- Test with nested folder structures

### Release 3: Full Feature (US1 + US2 + US3)
- Add search functionality
- Complete all user stories
- Polish edge cases

### Release 4: Production Ready
- Complete Phase 6 polish
- Performance optimization
- Documentation completion

---

## Testing Strategy

**Note**: Tests were not explicitly requested in the feature specification. To add tests:

1. **Unit Tests**: Add after each implementation task
   - Test file naming: `<module>.test.ts`
   - Run with: `pnpm run test`

2. **E2E Tests**: Add after each user story completion
   - Test file naming: `<story>.spec.ts`
   - Run with: `pnpm run test:e2e`

3. **Test Tasks to Add** (if TDD approach desired):
   - After T025: Add MarkdownFile model tests
   - After T037: Add US1 e2e tests
   - After T047: Add US2 e2e tests
   - After T060: Add US3 e2e tests

---

## Task Summary

| Phase | Tasks | Description | Estimated Tasks |
|-------|-------|-------------|-----------------|
| Phase 1 | T001-T011 | Setup & Tooling | 11 |
| Phase 2 | T012-T024 | Foundational Infrastructure | 13 |
| Phase 3 | T025-T037 | US1: Browse Markdown Files | 13 |
| Phase 4 | T038-T047 | US2: Navigate Folder Structure | 10 |
| Phase 5 | T048-T060 | US3: Search Content | 13 |
| Phase 6 | T061-T077 | Polish & Cross-Cutting | 17 |
| **Total** | **77 tasks** | **All implementation work** | 77 |

**MVP (Phases 1-3)**: 37 tasks

**Note**: Task count may vary based on implementation discoveries. Update this document as new tasks emerge or tasks become unnecessary.

---

## Next Steps

1. **Start MVP**: Begin with T001 (initialize project)
2. **Track Progress**: Check off tasks as completed
3. **Test Each Phase**: Verify completion criteria before proceeding
4. **Get Feedback**: Demo MVP after Phase 3 before continuing

**Resources**:
- [Spec](spec.md) - Feature requirements and acceptance criteria
- [Plan](plan.md) - Technical decisions and architecture
- [Research](research.md) - Technology stack rationale
- [Data Model](data-model.md) - Entity definitions
- [Contracts](contracts/build-api.md) - Module interfaces
- [Quickstart](quickstart.md) - Developer setup guide
