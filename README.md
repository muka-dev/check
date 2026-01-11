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
- **Smart Contracts**: Secured by Hardhat

See [docs/technical/developer_guide.md](docs/technical/developer_guide.md) for detailed developer setup.

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
# Server runs at http://localhost:3000
# API Docs at http://localhost:3000/api/v1/docs

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

# View Database
npx prisma studio
```

## � Docker Services

The project relies on Docker for external services (Redis, PostgreSQL).

| Script | Description |
| :--- | :--- |
| `npm run services:up` | Start all required services in background (Redis, Postgres) |
| `npm run services:down` | Stop and remove service containers |
| `npm run services:logs` | View logs from running services |

These commands allow you to spin up a complete local environment quickly.

## �📦 Project Structure

```struct
prisma/                  # Database Schema & Migrations
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
│   ├── crypto/          # Cryptographic implementations (ZK)
│   │   └── circuits/    # Circom circuit definitions & artifacts
│   ├── repositories/    # Repository implementations
│   ├── services/        # External service implementations
│   └── api/             # App entry point & configuration
    ├── controllers/     # API controllers
    ├── middleware/      # Middlewares (Error handling)
    └── routes/          # API Route definitions
scripts/                 # Utility scripts (e.g., ZK verification)
docs/                    # Documentation (Architecture, Crypto)
```

## 📚 API Documentation

The project includes interactive API documentation powered by Swagger/OpenAPI.

1. Start the server (`npm run dev` or `npm start`)
2. Visit **<http://localhost:3000/api/v1/docs>**

## 🧪 Testing

The project includes comprehensive unit tests following clean code practices:

- Domain layer tests (pure business logic)
- Application Use Case tests
- Presentation Controller tests
- Value object validation tests
- Entity behavior tests

## 🔒 Security & Privacy

This system is designed with privacy and security as core principles:

- **Anonymous Verification**: No personal information stored or transmitted
- **Cryptographic Proofs**: Age verification without revealing actual age
- **Decentralized**: No central authority controls verification
- **Zero-Knowledge Proofs**: Real implementation using `snarkjs` and `circom` (Groth16)

## 🛠️ Technologies

- **TypeScript**: Type-safe development
- **SQLite, PSQL & Prisma**: Database and ORM
- **Redis**: In-memory caching for high performance
- **Circom & SnarkJS**: Zero-Knowledge Proof construction and verification
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

- [Project Status](./docs/PROJECT_STATUS.md) - Current development status
- [Architecture Documentation](./docs/ARCHITECTURE.md) - Detailed architecture guide
- [Database Guide](./docs/DATABASE.md) - Database schema and tooling
- [Cryptography Guide](./docs/CRYPTO.md) - ZK-SNARKs implementation details
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - By Robert C. Martin
