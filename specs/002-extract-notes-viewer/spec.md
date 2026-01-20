# Feature Specification: Extract Notes Viewer

**Feature Branch**: `002-extract-notes-viewer`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Extract the doc-site viewer app into a dedicated `notes-viewer/` folder, making it a reusable, configurable tool that can display markdown notes from any directory."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use Notes Viewer in Current Course (Priority: P1)

A course instructor wants to use the notes viewer for their Operations Management course. After extracting the app into `notes-viewer/`, they configure it to point to the existing `weeks/`, `notes/`, and `assignments/` directories. All existing markdown files continue to display correctly with proper navigation, categorization, and styling.

**Why this priority**: This is the core migration - ensuring existing functionality continues to work after refactoring. Without this, the current course materials become inaccessible.

**Independent Test**: Can be fully tested by running `npm run dev` in the notes-viewer directory and verifying all existing course materials load at localhost:5173 with proper navigation and styling.

**Acceptance Scenarios**:

1. **Given** the notes-viewer is configured to point to the parent directory, **When** a user visits the app, **Then** all existing markdown files from `weeks/`, `notes/`, and root level are accessible
2. **Given** the app is running, **When** a user navigates the sidebar, **Then** categories appear in the correct order (weeks numerically, others alphabetically)
3. **Given** a markdown file is displayed, **When** viewing the content, **Then** KaTeX math formulas render correctly and styling matches the original

---

### User Story 2 - Configure Content Discovery Patterns (Priority: P2)

A user wants to use the notes viewer for a different project with a different directory structure. They create a `notes-viewer.config.ts` file specifying custom patterns for auto-discovery (e.g., `modules/**/*.md` instead of `weeks/**/*.md`), custom ignore patterns, and custom category definitions.

**Why this priority**: This enables reusability - the core value proposition of extracting the viewer into a separate tool.

**Independent Test**: Can be fully tested by creating a new test directory with different structure, configuring the viewer to point to it, and verifying only the specified patterns are discovered and displayed.

**Acceptance Scenarios**:

1. **Given** a configuration with custom patterns like `['modules/**/*.md', '*.md']`, **When** the catalog is generated, **Then** only files matching those patterns are included
2. **Given** a configuration with ignore patterns like `['private', 'drafts']`, **When** the catalog is generated, **Then** files in those directories are excluded
3. **Given** a configuration with custom category definitions, **When** categories are displayed, **Then** the custom colors and labels are applied

---

### User Story 3 - Publish as Open Source Tool (Priority: P3)

A developer discovers the notes-viewer on GitHub and wants to use it for their personal knowledge base. They clone the repository, install dependencies, create a minimal configuration pointing to their notes directory, and run the dev server. The app displays their notes with sensible defaults for categories and styling.

**Why this priority**: This represents the ultimate goal - a reusable tool that others can adopt. It's lower priority because the initial user (the course instructor) doesn't need this immediately.

**Independent Test**: Can be fully tested by creating a fresh clone, configuring it for a new content directory, and verifying the app runs with default settings.

**Acceptance Scenarios**:

1. **Given** a fresh clone of notes-viewer, **When** a user runs `npm install && npm run dev`, **Then** the app starts successfully with a helpful message about configuration
2. **Given** no configuration file exists, **When** the app runs, **Then** it uses sensible defaults and scans the current directory for markdown files
3. **Given** a minimal configuration, **When** viewing the documentation, **Then** the README explains configuration options clearly

---

### Edge Cases

- What happens when the configured `contentDir` does not exist?
- What happens when no markdown files are found in the configured patterns?
- What happens when category definitions reference non-existent category IDs?
- What happens when the configuration file has invalid syntax?
- What happens when a markdown file has no frontmatter and cannot be auto-categorized?
- What happens when custom category colors conflict with default themes?
- What happens when the viewer is configured to point to a directory outside the repository?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST extract all app files (src/, scripts/, public/, package.json, vite.config.ts, tsconfig.json, tailwind.config.js) into a new `notes-viewer/` directory
- **FR-002**: The system MUST create a configuration file at `notes-viewer/notes-viewer.config.ts` that defines content directory, patterns, ignore rules, categories, and site metadata
- **FR-003**: The system MUST update `scanner.ts` to read all paths from the configuration file instead of using hardcoded values
- **FR-004**: The system MUST update `vite.config.ts` to resolve paths relative to the configured content directory
- **FR-005**: The system MUST update `generate-docs-catalog.ts` to output the catalog file relative to the notes-viewer directory
- **FR-006**: The system MUST make category colors extensible through configuration, merging user-defined categories with default themes
- **FR-007**: The system MUST preserve all existing functionality for the current course (weeks, notes, assignments directories)
- **FR-008**: The system MUST support custom glob patterns for content discovery (e.g., `['docs/**/*.md', '*.md']`)
- **FR-009**: The system MUST support custom ignore patterns for directories and files
- **FR-010**: The system MUST allow custom category definitions with labels, colors, and descriptions
- **FR-011**: The system MUST validate the configuration file on startup and provide clear error messages for invalid syntax
- **FR-012**: The system MUST handle the case when configured content directory does not exist by displaying a helpful error message
- **FR-013**: The system MUST support sensible defaults when configuration options are not specified
- **FR-014**: The system MUST update the build process to work with the new directory structure
- **FR-015**: The system MUST create a README.md in the notes-viewer directory with configuration documentation

### Key Entities

- **Configuration**: Defines content directory, discovery patterns, ignore rules, category definitions, and site metadata
- **Content Directory**: The root directory containing markdown files to be displayed (configurable)
- **Category**: A grouping of documents with associated metadata (ID, label, color, description)
- **Discovery Pattern**: Glob pattern(s) used to automatically find markdown files
- **Ignore Pattern**: Directory or file patterns to exclude from scanning
- **Document**: A markdown file with optional frontmatter and auto-detected metadata
- **Catalog**: Generated index of all discovered documents organized by category

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All existing course materials load correctly after the refactor (100% of current files accessible)
- **SC-002**: The viewer can be configured to point to a different content directory within 5 minutes
- **SC-003**: Custom category definitions are applied correctly (colors, labels, descriptions match configuration)
- **SC-004**: The build completes successfully with no errors in the new directory structure
- **SC-005**: Configuration errors are detected and reported within 1 second of app startup
- **SC-006**: The notes-viewer can be published as a standalone package with clear documentation
- **SC-007**: Hot module reload continues to work for markdown file changes
- **SC-008**: All existing routes and navigation features work identically to the original app

## Assumptions

1. The user has Node.js and npm installed on their system
2. TypeScript compilation will continue to work after the file structure changes
3. The Vite build system can be configured to work with the new directory structure
4. Git will handle the file moves correctly without losing history
5. The existing markdown frontmatter format will remain unchanged
6. Users will primarily use this viewer for markdown-based documentation
7. The viewer will continue to use React and Vite as the runtime framework
