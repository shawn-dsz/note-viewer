# Tasks: Extract Notes Viewer

**Input**: Design documents from `/specs/002-extract-notes-viewer/`
**Prerequisites**: spec.md (user stories), implementation plan from refactoring plan

**Tests**: No test tasks included - tests were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **notes-viewer/**: New extracted viewer application
- Root repository contains content directories (weeks/, notes/, assignments/)

---

## Phase 1: Setup (Create notes-viewer Directory Structure)

**Purpose**: Create the new notes-viewer directory and move all app files

- [x] T001 Create notes-viewer/ directory at repository root
- [x] T002 [P] Move src/ to notes-viewer/src/
- [x] T003 [P] Move scripts/ to notes-viewer/scripts/
- [x] T004 [P] Move public/ to notes-viewer/public/
- [x] T005 [P] Move package.json to notes-viewer/package.json
- [x] T006 [P] Move vite.config.ts to notes-viewer/vite.config.ts
- [x] T007 [P] Move tsconfig.json to notes-viewer/tsconfig.json
- [x] T008 [P] Move tsconfig.node.json to notes-viewer/tsconfig.node.json
- [x] T009 [P] Move tailwind.config.js to notes-viewer/tailwind.config.js
- [x] T010 [P] Move index.html to notes-viewer/index.html
- [x] T011 Delete moved files from repository root (keeping weeks/, notes/, assignments/, and content files)

**Checkpoint**: notes-viewer directory exists with all app files moved

---

## Phase 2: Foundational (Configuration System)

**Purpose**: Create the configuration infrastructure that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T012 Create notes-viewer/src/config.ts with Configuration type definitions and loader function
- [x] T013 Create notes-viewer/notes-viewer.config.ts with default configuration pointing to parent directory (../)
- [x] T014 Create notes-viewer/src/utils/config-validator.ts for configuration validation with helpful error messages
- [x] T015 Update notes-viewer/src/build/scanner.ts to import and use configuration for all paths (remove hardcoded values)
- [x] T016 Update notes-viewer/vite.config.ts to resolve paths relative to configured content directory
- [x] T017 Update notes-viewer/scripts/generate-docs-catalog.ts to output to notes-viewer/src/data/docs-generated.ts

**Checkpoint**: Configuration system complete - user story implementation can now begin

---

## Phase 3: User Story 1 - Use Notes Viewer in Current Course (Priority: P1) 🎯 MVP

**Goal**: Ensure all existing course materials load correctly after the refactor

**Independent Test**: Run `npm run dev` in notes-viewer directory and verify all course materials load at localhost:5173

### Implementation for User Story 1

- [x] T018 [P] [US1] Update IGNORE_DIRECTORIES in notes-viewer/src/build/scanner.ts to read from config.ignore
- [x] T019 [P] [US1] Update IGNORE_FILES in notes-viewer/src/build/scanner.ts to read from config.ignore
- [x] T020 [P] [US1] Update isAutoDiscoveredLocation() in notes-viewer/src/build/scanner.ts to use config.patterns
- [x] T021 [P] [US1] Update inferCategory() in notes-viewer/src/build/scanner.ts to preserve existing week-N-* pattern detection
- [x] T022 [US1] Update getCategoryDisplayName() in notes-viewer/src/build/scanner.ts to work with configurable categories
- [x] T023 [US1] Update getCategoryDescription() in notes-viewer/src/build/scanner.ts to work with configurable categories
- [x] T024 [US1] Update category sorting logic in notes-viewer/src/build/scanner.ts to preserve numeric week ordering
- [x] T025 [P] [US1] Update notes-viewer/src/data/categoryColors.ts to merge user-defined categories with default themes
- [x] T026 [P] [US1] Update notes-viewer/vite.config.ts markdown watcher to use config.contentDir
- [x] T027 [US1] Update notes-viewer/vite.config.ts markdown copy plugin to skip directories from config.ignore
- [x] T028 [US1] Update TypeScript path aliases in notes-viewer/tsconfig.json (preserve @/* pointing to ./src)
- [x] T029 [US1] Update Tailwind content paths in notes-viewer/tailwind.config.js to point to ./src
- [x] T030 [P] [US1] Update notes-viewer/src/App.tsx routes to preserve /calculators route
- [x] T031 [P] [US1] Update notes-viewer/src/components/Sidebar.tsx to preserve calculators link styling
- [x] T032 [US1] Update notes-viewer/package.json scripts to work from notes-viewer directory
- [x] T033 [US1] Update notes-viewer/.gitignore to exclude dist/, node_modules/, and other build artifacts

**Checkpoint**: User Story 1 complete - existing course materials should load correctly

---

## Phase 4: User Story 2 - Configure Content Discovery Patterns (Priority: P2)

**Goal**: Enable users to configure custom patterns, ignore rules, and category definitions

**Independent Test**: Create test directory with different structure, configure viewer, verify only specified patterns are discovered

### Implementation for User Story 2

- [x] T034 [P] [US2] Implement glob pattern matching in notes-viewer/src/build/scanner.ts using config.patterns
- [x] T035 [P] [US2] Implement ignore pattern matching in notes-viewer/src/build/scanner.ts for directories from config.ignore
- [x] T036 [P] [US2] Implement ignore pattern matching in notes-viewer/src/build/scanner.ts for files from config.ignore
- [x] T037 [US2] Update notes-viewer/src/data/categoryColors.ts getCategoryTheme() to merge config.categories with defaults
- [x] T038 [US2] Add configuration schema documentation to notes-viewer/README.md explaining patterns, ignore, and categories options
- [x] T039 [US2] Add example configurations to notes-viewer/README.md for different directory structures

**Checkpoint**: User Story 2 complete - custom patterns and categories supported

---

## Phase 5: User Story 3 - Publish as Open Source Tool (Priority: P3)

**Goal**: Enable external developers to use notes-viewer for their own projects

**Independent Test**: Clone notes-viewer fresh, configure for new content directory, verify app runs

### Implementation for User Story 3

- [x] T040 [P] [US3] Implement sensible defaults in notes-viewer/src/config.ts when configuration file doesn't exist (scan current directory for *.md)
- [ ] T041 [P] [US3] Implement helpful startup message in notes-viewer/src/main.tsx when configuration is missing or invalid
- [ ] T042 [P] [US3] Implement error display in notes-viewer/App.tsx when configured contentDir doesn't exist
- [x] T043 [US3] Implement empty state handling in notes-viewer/src/build/scanner.ts when no markdown files are found
- [x] T044 [US3] Create comprehensive notes-viewer/README.md with quick start guide, configuration reference, and examples
- [x] T045 [P] [US3] Create notes-viewer/LICENSE file for open source licensing
- [ ] T046 [US3] Add CONTRIBUTING.md to notes-viewer/ with guidelines for external contributors
- [ ] T047 [US3] Verify notes-viewer works as standalone package (no dependencies on parent repository structure)

**Checkpoint**: User Story 3 complete - notes-viewer is publishable as open source tool

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

- [x] T048 [P] Update root repository .gitignore to exclude notes-viewer/dist/, notes-viewer/node_modules/
- [x] T049 [P] Update root repository README.md to reference notes-viewer/ directory for running the app
- [x] T050 Run npm install in notes-viewer/ and verify all dependencies install correctly
- [x] T051 Run npm run build in notes-viewer/ and verify production build succeeds
- [ ] T052 Verify hot module reload works for markdown file changes in notes-viewer/
- [ ] T053 Test all acceptance scenarios from spec.md for User Story 1
- [ ] T054 Test all acceptance scenarios from spec.md for User Story 2 (optional - can be skipped if US2 not implemented)
- [ ] T055 Test all acceptance scenarios from spec.md for User Story 3 (optional - can be skipped if US3 not implemented)
- [ ] T056 [P] Create changelog entry documenting the refactor and how to use the new notes-viewer

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - creates directory structure
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - Core migration (P1)
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion - Configurability (P2)
- **User Story 3 (Phase 5)**: Depends on User Story 2 completion - Open source ready (P3)
- **Polish (Phase 6)**: Depends on implemented user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 - Builds on configuration system
- **User Story 3 (P3)**: Depends on User Story 2 - Builds on configurability for defaults

### Within Each User Story

- Tasks marked [P] can run in parallel (different files, no dependencies)
- Tasks without [P] have dependencies within the story
- Complete all tasks in a story before moving to the next priority

### Parallel Opportunities

- **Phase 1**: All tasks T002-T011 can run in parallel (moving different files)
- **Phase 2**: T012-T014 are independent and can run in parallel
- **User Story 1**: Tasks T018, T019, T020, T021, T025, T026, T030, T031 can run in parallel
- **User Story 2**: Tasks T034, T035, T036, T037, T038 can run in parallel
- **User Story 3**: Tasks T040, T041, T042, T043, T045, T046 can run in parallel
- **Polish Phase**: Tasks T048, T049 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all configuration updates for User Story 1 together:
Task T018: "Update IGNORE_DIRECTORIES in notes-viewer/src/build/scanner.ts to read from config.ignore"
Task T019: "Update IGNORE_FILES in notes-viewer/src/build/scanner.ts to read from config.ignore"
Task T020: "Update isAutoDiscoveredLocation() in notes-viewer/src/build/scanner.ts to use config.patterns"

# Launch all styling updates together:
Task T025: "Update notes-viewer/src/data/categoryColors.ts to merge user-defined categories"
Task T026: "Update notes-viewer/vite.config.ts markdown watcher to use config.contentDir"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only - Recommended)

1. Complete Phase 1: Setup (T001-T011)
2. Complete Phase 2: Foundational (T012-T017) - CRITICAL
3. Complete Phase 3: User Story 1 (T018-T033)
4. **STOP and VALIDATE**: Run `cd notes-viewer && npm run dev`, verify all course materials load
5. Test all acceptance scenarios for User Story 1

**This delivers a working notes viewer that preserves existing functionality.**

### Incremental Delivery

1. Complete Setup + Foundational → Configuration system ready
2. Add User Story 1 → Test independently → MVP complete!
3. Add User Story 2 → Test independently → Custom patterns supported
4. Add User Story 3 → Test independently → Open source ready
5. Polish → Documentation and validation

Each story adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup (Phase 1) and Foundational (Phase 2) together
2. Once Foundational is done:
   - Developer A: User Story 1 (core migration)
   - Developer B: User Story 2 (configurability) - can start once US1 is partially done
   - Developer C: User Story 3 (open source prep) - can start once US2 is partially done
3. Stories complete and integrate incrementally

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The MVP (User Story 1 only) delivers significant value - can stop there if needed
- Avoid: vague tasks, modifying the same file in parallel tasks, skipping foundational phase

---

## Summary

- **Total Tasks**: 56
- **Setup Phase**: 11 tasks (T001-T011)
- **Foundational Phase**: 6 tasks (T012-T017)
- **User Story 1**: 16 tasks (T018-T033)
- **User Story 2**: 6 tasks (T034-T039)
- **User Story 3**: 8 tasks (T040-T047)
- **Polish Phase**: 9 tasks (T048-T056)

**Parallel Opportunities**: 30+ tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-3 (Tasks T001-T033) deliver a fully functional notes viewer with existing course materials
