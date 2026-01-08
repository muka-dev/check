# Contributing to Check

Thank you for your interest in contributing to the Check project!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/check.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Before Making Changes

```bash
# Run tests to ensure everything is working
npm test

# Run linter to check code style
npm run lint

# Build the project
npm run build
```

### Making Changes

1. Follow the Clean Architecture principles outlined in [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Write tests for new functionality
3. Ensure all tests pass
4. Run linter and fix any issues
5. Update documentation if needed

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** with strict mode enabled

Run these commands to maintain code quality:

```bash
# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Commit Guidelines

- Write clear, descriptive commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference issues and pull requests where applicable
- Keep commits focused and atomic

### Pull Request Process

1. Update the README.md or documentation with details of changes if applicable
2. Ensure all tests pass and code is linted
3. Update the PR description with:
   - What changed
   - Why it changed
   - How to test it
4. Link related issues
5. Request review from maintainers

## Architecture Guidelines

### Domain Layer
- Pure business logic, no external dependencies
- Entities represent core business concepts
- Value Objects are immutable
- Repository interfaces define data contracts

### Application Layer
- Use cases orchestrate business logic
- DTOs transfer data between layers
- No direct dependencies on infrastructure

### Infrastructure Layer
- Implements domain interfaces
- Handles external services (database, APIs, etc.)
- Can depend on both domain and application layers

### Presentation Layer
- Handles user interaction
- Controllers process requests/responses
- Depends on application layer

## Naming Conventions

- **Interfaces**: Prefix with `I` (e.g., `IAgeVerificationRepository`)
- **Classes**: PascalCase (e.g., `AgeVerification`)
- **Methods/Functions**: camelCase (e.g., `validateAge`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_AGE`)
- **Files**: Match the class/interface name (e.g., `AgeVerification.ts`)

## Questions?

If you have questions, please:
1. Check existing documentation
2. Search existing issues
3. Open a new issue with your question

Thank you for contributing!
