# Check - Decentralized Age Verification System

A privacy-focused, decentralized age verification system built with Clean Architecture principles.

## 🎯 Overview

This project provides anonymous age verification without revealing sensitive personal information. It uses cryptographic proofs to verify age requirements while maintaining user privacy and anonymity.

## 🏗️ Architecture

The project follows **Clean Architecture** (Hexagonal Architecture) with clear separation of concerns:

- **Domain Layer**: Core business logic, entities, and value objects
- **Application Layer**: Use cases and application-specific business rules
- **Infrastructure Layer**: External implementations (database, crypto services)
- **Presentation Layer**: User interfaces and API controllers

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/muka-dev/check.git
cd check

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Project Structure

```
src/
├── domain/              # Domain layer (business logic)
│   ├── entities/        # Domain entities
│   ├── value-objects/   # Value objects
│   ├── repositories/    # Repository interfaces
│   └── services/        # Domain services
├── application/         # Application layer
│   ├── use-cases/       # Application use cases
│   └── dto/             # Data transfer objects
├── infrastructure/      # Infrastructure layer
│   ├── repositories/    # Repository implementations
│   ├── services/        # External service implementations
│   └── config/          # Configuration
└── presentation/        # Presentation layer
    ├── controllers/     # API controllers (to be implemented)
    └── middlewares/     # Middlewares (to be implemented)
```

## 🧪 Testing

The project includes comprehensive unit tests following clean code practices:

- Domain layer tests (pure business logic)
- Value object validation tests
- Entity behavior tests

## 🔒 Security & Privacy

This system is designed with privacy and security as core principles:

- **Anonymous Verification**: No personal information stored or transmitted
- **Cryptographic Proofs**: Age verification without revealing actual age
- **Decentralized**: No central authority controls verification
- **Zero-Knowledge Proofs**: (Mock implementation, to be replaced with actual ZKP)

## 🛠️ Technologies

- **TypeScript**: Type-safe development
- **Jest**: Testing framework
- **ESLint & Prettier**: Code quality and formatting
- **Husky & lint-staged**: Pre-commit hooks

## 📋 Code Quality

The project enforces high code quality standards:

- Strict TypeScript configuration
- ESLint with TypeScript rules
- Prettier for consistent formatting
- Pre-commit hooks for automated checks
- Comprehensive test coverage

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. Code follows the established architecture patterns
2. All tests pass
3. New features include tests
4. Code is properly formatted and linted

## 📄 License

ISC

## 🔗 Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md) - Detailed architecture guide
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - By Robert C. Martin
