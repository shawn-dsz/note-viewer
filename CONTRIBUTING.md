# Contributing to Notes Viewer

Thank you for your interest in contributing to Notes Viewer! This document provides guidelines for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/my-feature`

## Development

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Run `npm run type-check` before committing

## Project Structure

```
notes-viewer/
├── src/
│   ├── build/          # Build scripts and catalog generation
│   ├── components/     # React components
│   ├── contexts/       # React contexts
│   ├── data/           # Data files and types
│   ├── pages/          # Page components
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── scripts/            # Build and generation scripts
├── public/             # Static assets
└── notes-viewer.config.ts  # Configuration file
```

## Making Changes

### Bug Fixes

1. Create an issue describing the bug
2. Create a branch: `bugfix/issue-number-description`
3. Fix the bug
4. Add tests if appropriate
5. Submit a pull request

### New Features

1. Discuss the feature in an issue first
2. Create a branch: `feature/feature-name`
3. Implement the feature
4. Update documentation
5. Submit a pull request

### Configuration Changes

When modifying the configuration system:
1. Update `src/config.ts` for type definitions
2. Update `notes-viewer.config.ts` for the default config
3. Update `README.md` with new configuration options
4. Add examples to the README

## Pull Request Guidelines

### PR Title

Use a clear, descriptive title:
- `fix: correct category color merging`
- `feat: add dark mode toggle`
- `docs: update configuration examples`

### PR Description

Include:
- What changes were made and why
- Any breaking changes
- How to test the changes
- Related issue numbers

### Checklist

- [ ] Code follows the project style
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Type checking passes

## Questions?

Feel free to open an issue for questions or discussion about potential contributions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
