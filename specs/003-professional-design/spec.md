# Feature Specification: Professional Design Refresh

**Feature Branch**: `003-professional-design`
**Created**: 2026-01-15
**Status**: Draft
**Input**: User description: "Make the notes-viewer site look more professional based on Gemini's recommendations: Inter/JetBrains Mono fonts, Slate/Gray neutral palette with Indigo accent, refined sidebar with subtle active states and border-left indicators, improved markdown typography, professional scrollbar styling, and updated dark mode theme."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean Professional Appearance (Priority: P1)

A user visits the notes-viewer site and immediately perceives it as a professional, academic documentation tool similar to Stripe Docs, Linear, or Notion - rather than a custom/gaming aesthetic.

**Why this priority**: First impressions matter. The overall professional appearance is the core value proposition of this redesign.

**Independent Test**: Can be fully tested by visually comparing before/after screenshots and verifying the site feels "academic minimalist" rather than "neon/gamer".

**Acceptance Scenarios**:

1. **Given** a user visits the site, **When** the page loads, **Then** they see a clean Slate/Gray color scheme with Indigo accents instead of vibrant gradients and glows
2. **Given** a user views the site on desktop, **When** they read any content, **Then** the Inter font family renders clearly with proper anti-aliasing
3. **Given** a user views the site in dark mode, **When** they scan the page, **Then** the colors feel professional (Slate-800/900) not pure black (#0a0a0a)

---

### User Story 2 - Refined Sidebar Navigation (Priority: P1)

A user navigates through the sidebar and experiences a subtle, professional interaction pattern with clear visual feedback for active states.

**Why this priority**: The sidebar is the primary navigation mechanism and is always visible - its polish directly impacts perceived quality.

**Independent Test**: Can be tested by clicking through sidebar items and verifying border-left indicators appear, active states use subtle tints instead of solid colors.

**Acceptance Scenarios**:

1. **Given** a user hovers over a sidebar link, **When** they see the hover state, **Then** it shows a subtle background tint (not a color fill)
2. **Given** a user clicks on a document, **When** the link becomes active, **Then** it shows a border-left indicator in Indigo and subtle background tint
3. **Given** a user views category headers, **When** they expand/collapse, **Then** the headers appear as subtle uppercase text (not gradient text)

---

### User Story 3 - Readable Markdown Content (Priority: P2)

A user reads markdown documentation and experiences excellent typography with proper heading hierarchy, readable body text, and professional code blocks.

**Why this priority**: The content area is where users spend most of their time - good typography aids comprehension.

**Independent Test**: Can be tested by opening any markdown document and verifying headings have clear hierarchy without gradients, code uses JetBrains Mono, and text feels readable.

**Acceptance Scenarios**:

1. **Given** a user views a document with headings, **When** they scan the page, **Then** h1 is 2.25rem bold without gradient, h2 has subtle border-bottom, h3 is Indigo-colored
2. **Given** a user views inline code, **When** they read it, **Then** it renders in JetBrains Mono with subtle background and Indigo text
3. **Given** a user views a code block, **When** they see the block, **Then** it has minimal styling without box-shadow glows

---

### User Story 4 - Consistent Light/Dark Mode (Priority: P2)

A user toggles between light and dark mode and experiences consistent, professional theming in both modes.

**Why this priority**: Many users prefer light mode - both themes must feel equally polished.

**Independent Test**: Can be tested by toggling theme and verifying both modes use the Slate color scale appropriately.

**Acceptance Scenarios**:

1. **Given** a user is in light mode, **When** they view the sidebar, **Then** it uses Slate-50/100 backgrounds with Slate-900 text
2. **Given** a user is in dark mode, **When** they view the sidebar, **Then** it uses Slate-800/900 backgrounds with Slate-50 text
3. **Given** a user toggles theme, **When** the theme changes, **Then** the Indigo accent remains consistent across modes

---

### User Story 5 - Professional Calculator Styling (Priority: P2)

A user uses the calculators page and experiences the same professional design as the rest of the site.

**Why this priority**: Inconsistent styling degrades overall perceived quality.

**Independent Test**: Can be tested by visiting /calculators and verifying it uses Slate/Indigo theme.

**Acceptance Scenarios**:

1. **Given** a user visits the calculators page, **When** they view calculator cards, **Then** they see Indigo accents instead of orange/red
2. **Given** a user interacts with calculator inputs, **When** they focus an input, **Then** the focus ring uses Indigo color

---

### User Story 6 - Mobile Navigation (Priority: P2)

A user on a mobile device can navigate the site using a hamburger menu that opens a drawer overlay.

**Why this priority**: Mobile usability is essential for professional documentation sites.

**Independent Test**: Can be tested by resizing browser to < 768px and verifying hamburger menu appears.

**Acceptance Scenarios**:

1. **Given** a user is on mobile (< 768px), **When** the page loads, **Then** they see a hamburger menu icon instead of full sidebar
2. **Given** a user taps the hamburger menu, **When** the drawer opens, **Then** they see the same navigation items as desktop

---

### Edge Cases

- What happens with very long sidebar item names? (Should truncate with ellipsis)
- How does the site handle system preference for prefers-color-scheme?
- What if fonts fail to load? (Should fallback to system-ui)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST self-host Inter and JetBrains Mono fonts via @fontsource npm packages
- **FR-002**: System MUST use CSS custom properties (variables) for all theme colors
- **FR-003**: System MUST support both light and dark themes using Slate color scale
- **FR-004**: Sidebar links MUST show border-left indicator (3px Indigo) when active
- **FR-005**: Sidebar links MUST NOT use solid background fills for active states
- **FR-006**: Heading elements MUST NOT use gradient text effects
- **FR-007**: Code elements MUST use JetBrains Mono font family
- **FR-008**: System MUST NOT use box-shadow glow effects on any element
- **FR-009**: Scrollbars MUST be styled with minimal 6px width and subtle colors
- **FR-010**: CalculatorsPage and CalculatorCard MUST use Indigo accent colors (not orange/red)
- **FR-011**: Mobile viewport (< 768px) MUST show hamburger menu that opens a drawer overlay

### Design Tokens

- **Primary Brand**: Indigo-600 (#4f46e5) light / Indigo-400 (#818cf8) dark
- **Brand Surface**: Indigo-50 (#eef2ff) light / rgba(79, 70, 229, 0.1) dark
- **Backgrounds**: Slate scale (50, 100, 800, 900)
- **Text**: Slate-900, Slate-600, Slate-400 (light) / Slate-50, Slate-400, Slate-500 (dark)
- **Borders**: Slate-200 light / Slate-700 dark

### Key Entities

- **Theme Context**: Manages light/dark mode state
- **CSS Variables**: Centralized color tokens in :root and [data-theme]
- **Typography System**: Font families, sizes, and weights

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero CSS gradient text effects remain in the codebase after implementation
- **SC-002**: Zero box-shadow glow effects remain in the codebase after implementation
- **SC-003**: All color values use CSS custom properties (no hardcoded hex in components)
- **SC-004**: Lighthouse accessibility score remains >= 90
- **SC-005**: Font files (Inter, JetBrains Mono) load successfully with proper fallbacks
