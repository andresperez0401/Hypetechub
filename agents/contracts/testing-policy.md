# Contract: Testing Policy

## Purpose
Define what must be tested, at what level, and with what minimum coverage. All agents producing code must satisfy this policy. QA Reviewer validates it.

---

## Testing layers

### 1. Unit tests (mandatory for use cases and domain)
- **What:** Use cases, domain entities, value objects, domain services
- **Tools:** Jest
- **Dependencies:** All mocked (no real DB, no real HTTP)
- **Location:** `__tests__/` next to the file being tested, or `.spec.ts` suffix
- **Coverage target:** 80% lines/functions for application and domain layers

**Rule:** Every use case must have unit tests covering:
- Happy path (success)
- Each error branch (domain error thrown)
- Boundary conditions (empty input, null, edge values)

### 2. Integration tests (mandatory for controllers)
- **What:** NestJS controllers tested via HTTP (supertest)
- **Tools:** Jest + supertest + `@nestjs/testing`
- **Dependencies:** Real DB (test DB) or in-memory DB for fast tests
- **Location:** `http/__tests__/<feature>.controller.spec.ts`
- **Coverage target:** Each documented HTTP status code must have at least one test

**Rule:** Every controller endpoint must have integration tests covering:
- Successful response (correct status + response shape)
- Unauthorized access (401 where guard applies)
- Validation failure (400 with invalid input)
- Not found (404 where applicable)

### 3. Component tests (mandatory for forms and interactive components)
- **What:** React components with user interaction (forms, buttons, state changes)
- **Tools:** Jest + React Testing Library
- **Location:** `__tests__/` next to the component
- **Coverage target:** All user interactions that trigger validation or API calls

**Rule:** Every form component must have tests covering:
- Shows validation errors for invalid input
- Calls the expected handler on valid submit
- Shows loading state while submitting
- Shows error message on API failure

### 4. E2E tests (optional for MVP, required for release)
- **What:** Full user flows (login → navigate → action → logout)
- **Tools:** Playwright (add when MVP is stable)
- **Coverage:** Critical paths only — login, core feature CRUD, logout

---

## Coverage thresholds

### Backend
```javascript
// jest.config.js
coverageThreshold: {
  './src/modules/*/domain/**': {
    lines: 80,
    functions: 80,
  },
  './src/modules/*/application/**': {
    lines: 80,
    functions: 80,
  },
}
```

### Frontend
```javascript
// jest.config.js
coverageThreshold: {
  './src/features/**': {
    lines: 70,
    functions: 75,
  },
}
```

---

## What does NOT need tests
- NestJS controllers with pure delegation (no conditional logic) — covered by integration tests
- Prisma repository implementations — tested via integration tests with real DB
- Simple UI components with no logic (Button, Input) — visual, no behavior to test
- Configuration files, constants, type definitions

---

## Test naming convention
```typescript
describe('<ClassName>', () => {
  describe('<methodName>', () => {
    it('returns X when Y', () => {});
    it('throws <ErrorName> when Z', () => {});
  });
});
```

---

## Forbidden in tests
- `jest.setTimeout()` set globally to avoid slow test warnings — fix the slow test instead
- `.only` left in committed code
- `.skip` without a `// TODO:` comment explaining when it will be unskipped
- Testing implementation details (private methods, internal state)
- Assertions on exact error messages that may change (assert on error class, not message string)
- Snapshot tests for non-visual components (they break on irrelevant changes)

---

## Running tests
```bash
# Unit tests only (from any workspace or root)
npm test

# With coverage
npm run test:cov

# Watch mode
npm run test:watch

# E2E (backend)
npm run test:e2e
```
