# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-11

### Added

- **Quantum-Safe Authentication**:
  - Implemented **NIST FIPS 204 (ML-DSA-65 / Dilithium)** Challenge-Response authentication.
  - Replaced traditional password auth with Zero-Knowledge PQC Key Pairs.
  - Server stores only Public Keys; Private Keys never leave the client.
  - Uses `@noble/post-quantum` for crypto primitives.
- **Security Hardening**:
  - **Token Rotation**: Implemented Access (15m) and Refresh (7d) token pairs with reuse detection.
  - **Rate Limiting**: Distributed Sliding Window rate limiter using Redis (`redis.incr`).
  - Strict linting rules enforced for all controller methods.
- **Infrastructure**:
  - Redis integration for Rate Limiting and Token Blacklisting.
  - Docker Compose updated with Redis service.

## [1.1.0] - 2026-01-10

### Added there

- **Blockchain Integration**:
  - `BlockchainService` implementation interacting with local Hardhat node.
  - Smart Contract deployment scripts fixed for ESM.
  - Environment configuration for Blockchain Registry address.
  - Dependency Injection of `BlockchainService` into Application layer.
- **Integration Testing**:
  - `OnlineShopScenario` test suite simulating a full user purchase flow.
  - `supertest` setup for end-to-end API testing.

### Changed

- **Module System Migration**:
  - Migrated project to Native ESM (`"type": "module"` in `package.json`).
  - Updated Jest configuration (`jest.config.cjs`) to support ESM and `ts-jest`.
  - Updated Swagger configuration to use `createRequire` for JSON imports.
- **Database**:
  - Synced Prisma schema with local SQLite database for integration testing.

## [1.0.0] - 2026-01-06

### Added here

- Initial project setup with Clean Architecture
- Domain layer with entities, value objects, and services
- Application layer with use cases and DTOs
- Infrastructure layer with in-memory repository and mock cryptographic service
- TypeScript configuration with strict mode
- ESLint and Prettier for code quality
- Jest testing framework with sample tests
- Husky and lint-staged for pre-commit hooks
- Comprehensive documentation (README, ARCHITECTURE, CONTRIBUTING, SECURITY)
- Example application demonstrating age verification flow
- Build and development scripts

### Architecture

- Clean Architecture pattern implementation
- Domain-Driven Design principles
- Dependency injection ready
- Repository pattern for data access
- Use case pattern for business logic

### Documentation

- Project README with usage instructions
- Architecture documentation explaining layers
- Contributing guidelines
- Security policy
- Code of Conduct
- Environment variable examples

### Developer Experience

- Hot reload development mode
- Comprehensive test suite
- Automated code formatting
- Linting with auto-fix
- Pre-commit hooks for quality checks
