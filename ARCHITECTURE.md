# Clean Architecture for Age Verification System

## Overview

This project follows Clean Architecture principles (also known as Hexagonal Architecture or Ports and Adapters pattern) to ensure maintainability, testability, and independence from external frameworks and technologies.

## Architecture Layers

### 1. Domain Layer (`src/domain`)

The innermost layer containing the core business logic and rules. This layer has no dependencies on other layers.

#### Components:
- **Entities** (`entities/`): Core business objects with identity
  - Represent the fundamental business concepts
  - Contain business logic and invariants
  - Independent of any external systems

- **Value Objects** (`value-objects/`): Immutable objects defined by their attributes
  - No identity, defined by their values
  - Encapsulate domain concepts (e.g., Age, Timestamp)
  - Contain validation logic

- **Repository Interfaces** (`repositories/`): Contracts for data access
  - Define what data operations are needed
  - Implementation details are in the infrastructure layer

- **Domain Services** (`services/`): Operations that don't naturally fit in entities
  - Implement complex business logic
  - Orchestrate multiple entities

### 2. Application Layer (`src/application`)

Contains application-specific business rules and use cases.

#### Components:
- **Use Cases** (`use-cases/`): Application-specific business logic
  - Orchestrate the flow of data to/from entities
  - Direct entities to use their business rules
  - One use case per user action/request

- **DTOs** (`dto/`): Data Transfer Objects
  - Define the shape of data flowing in/out of use cases
  - Decouple domain models from external interfaces

### 3. Infrastructure Layer (`src/infrastructure`)

Contains implementations of interfaces defined in domain/application layers.

#### Components:
- **Repository Implementations** (`repositories/`): Data access implementation
  - Implement domain repository interfaces
  - Handle database interactions, API calls, etc.

- **External Services** (`services/`): Third-party service integrations
  - Blockchain interactions
  - Cryptographic services
  - External APIs

- **Configuration** (`config/`): Application configuration
  - Database configuration
  - Environment variables
  - Service configurations

### 4. Presentation Layer (`src/presentation`)

Handles user interface and external communication.

#### Components:
- **Controllers** (`controllers/`): Handle HTTP requests/responses
  - Parse requests
  - Call appropriate use cases
  - Format responses

- **Middlewares** (`middlewares/`): Request/response processing
  - Authentication
  - Validation
  - Error handling
  - Logging

## Dependency Rule

The fundamental rule is that dependencies must point inward:

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

- **Domain** depends on nothing
- **Application** depends only on Domain
- **Infrastructure** depends on Application and Domain
- **Presentation** depends on Application and Domain

## Key Principles

### 1. Independence of Frameworks
Business logic doesn't depend on frameworks. Frameworks are tools, not constraints.

### 2. Testability
Business rules can be tested without UI, database, web server, or external elements.

### 3. Independence of UI
The UI can change without changing business rules.

### 4. Independence of Database
Business rules are not bound to any database.

### 5. Independence of External Agency
Business rules don't know about external interfaces.

## Data Flow

1. **Request arrives** at Presentation layer (Controller)
2. **Controller** creates a DTO and calls Application layer (Use Case)
3. **Use Case** orchestrates Domain entities and calls Repository interfaces
4. **Repository Implementation** (Infrastructure) performs actual data operations
5. **Results flow back** through the layers to the Presentation layer
6. **Controller** formats the response and returns it

## Benefits

- **Maintainability**: Changes in one layer don't affect others
- **Testability**: Easy to write unit tests for business logic
- **Flexibility**: Easy to swap implementations (e.g., change database)
- **Scalability**: Clear boundaries for growing the system
- **Team Collaboration**: Teams can work on different layers independently

## For Age Verification System

This architecture is ideal for our decentralized, anonymous age verification system because:

1. **Decentralization**: Infrastructure layer can easily integrate different blockchain solutions
2. **Privacy**: Domain layer enforces privacy rules without external dependencies
3. **Anonymity**: Business logic remains independent of identity providers
4. **Flexibility**: Can switch between different verification methods or cryptographic schemes
5. **Security**: Clear separation makes security audits easier

## Getting Started

1. Start with Domain layer - define your entities and business rules
2. Create Application use cases that orchestrate domain logic
3. Implement Infrastructure adapters for external systems
4. Build Presentation layer for user interaction

## Testing Strategy

- **Unit Tests**: Domain entities and value objects (no dependencies)
- **Integration Tests**: Use cases with mock repositories
- **E2E Tests**: Full flow through all layers
- **Contract Tests**: Verify interface implementations

## References

- Clean Architecture by Robert C. Martin
- Hexagonal Architecture by Alistair Cockburn
- Domain-Driven Design by Eric Evans
