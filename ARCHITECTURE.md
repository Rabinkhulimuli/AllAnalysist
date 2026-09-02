# Clean Architecture Template

A Next.js template following **Clean Architecture** and **Domain-Driven Design (DDD)** principles. This structure ensures scalability, maintainability, and testability.

## Overview

The application is organized into four distinct layers, each with specific responsibilities:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (UI Components, Pages, Forms)        │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│       Application Layer                 │
│    (Use Cases, Business Logic)          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         Domain Layer                    │
│  (Entities, Interfaces, Business Rules) │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Infrastructure Layer               │
│  (Repositories, External Services)      │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. **Domain Layer** (`src/domain/`)
- **Purpose**: Core business entities and rules
- **Contains**:
  - Entity interfaces (User, Product, etc.)
  - Domain services interfaces
  - Business logic that doesn't depend on any framework
  - Validation rules specific to entities
- **Dependencies**: None (independent)
- **Example**: `User.ts`, `AuthService.ts`

### 2. **Application Layer** (`src/application/`)
- **Purpose**: Use cases and orchestration of business logic
- **Contains**:
  - Use case classes implementing specific features
  - Business process orchestration
  - Validation and error handling
  - Dependency injection of domain services
- **Dependencies**: Domain layer only
- **Example**: `LoginUseCase.ts`, `RegisterUseCase.ts`

### 3. **Infrastructure Layer** (`src/infrastructure/`)
- **Purpose**: Implementation details and external integrations
- **Contains**:
  - Repository implementations
  - Database access code
  - External API integrations
  - Authentication/Authorization implementations
  - Email, SMS, storage services
- **Dependencies**: Domain layer
- **Example**: `AuthRepository.ts`, `ProductRepository.ts`

### 4. **Presentation Layer** (`src/presentation/`)
- **Purpose**: User interface and API endpoints
- **Contains**:
  - React components and pages
  - Forms and UI logic
  - API routes
  - Theme providers and global state
- **Dependencies**: Application and Infrastructure layers
- **Example**: `LoginForm.tsx`, `RegisterForm.tsx`

## Directory Structure

```
src/
├── application/           # Use Cases
│   ├── auth/
│   │   ├── LoginUseCase.ts
│   │   └── RegisterUseCase.ts
│   ├── inventory/
│   ├── marketplace/
│   ├── payment/
│   └── customer/
│
├── domain/               # Entities & Interfaces
│   ├── auth/
│   │   ├── User.ts
│   │   └── AuthService.ts
│   ├── inventory/
│   │   └── Product.ts
│   ├── marketplace/
│   ├── payment/
│   └── customer/
│
├── infrastructure/       # Implementations
│   ├── auth/
│   │   └── AuthRepository.ts
│   ├── inventory/
│   │   └── ProductRepository.ts
│   ├── marketplace/
│   ├── payment/
│   └── customer/
│
└── presentation/         # UI & Components
    ├── features/         # Feature-specific components
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   ├── inventory/
    │   ├── marketplace/
    │   ├── payment/
    │   └── customer/
    ├── shared/           # Shared types & utilities
    ├── components/       # Reusable UI components
    └── providers/        # Context providers
```

## Data Flow Example: User Registration

```
1. User fills registration form
   ↓
2. RegisterForm component (Presentation)
   ↓
3. RegisterUseCase executes (Application)
   → Validates input
   → Checks business rules
   ↓
4. AuthRepository.register() (Infrastructure)
   → Saves to database
   ↓
5. Returns User entity (Domain)
   ↓
6. Update UI with success message
```

## Adding a New Feature

Follow these steps to add a new feature:

### Step 1: Define Domain Models
```typescript
// src/domain/feature/Entity.ts
export interface MyEntity {
  id: string;
  name: string;
}
```

### Step 2: Create Use Cases
```typescript
// src/application/feature/MyUseCase.ts
export class MyUseCase {
  async execute(input: MyInput): Promise<MyEntity> {
    // Business logic here
  }
}
```

### Step 3: Implement Infrastructure
```typescript
// src/infrastructure/feature/MyRepository.ts
export class MyRepository {
  async save(entity: MyEntity): Promise<MyEntity> {
    // Persistence logic here
  }
}
```

### Step 4: Create Presentation Components
```typescript
// src/presentation/features/feature/MyComponent.tsx
export function MyComponent() {
  // Use case in component
  const useCase = new MyUseCase(new MyRepository());
  // Render UI
}
```

## Benefits of This Architecture

✅ **Scalability**: Easy to add new features without affecting existing code
✅ **Testability**: Each layer can be tested independently
✅ **Maintainability**: Clear separation of concerns
✅ **Flexibility**: Easy to switch implementations (e.g., database)
✅ **Reusability**: Business logic can be reused across different interfaces
✅ **Team Collaboration**: Different teams can work on different layers

## Best Practices

1. **Keep domains independent**: Domain layer should have zero framework dependencies
2. **Use dependency injection**: Inject dependencies rather than creating them
3. **Validate at boundaries**: Validate input in use cases before processing
4. **Don't leak internals**: Use domain entities as API boundaries
5. **Handle errors properly**: Each layer should handle its own errors
6. **Test each layer**: Write unit tests for each architectural layer

## Migration Path

1. Start with this structure
2. Add your business logic to use cases
3. Implement repositories for data access
4. Create React components in the presentation layer
5. Expand with API routes as needed

## Resources

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
