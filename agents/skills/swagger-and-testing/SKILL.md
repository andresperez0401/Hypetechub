# Skill: Swagger and Testing

## Purpose
Configure Swagger (OpenAPI) documentation in NestJS and establish testing patterns for both backend (Jest) and frontend (React Testing Library).

## When to apply
- Adding Swagger to a new or existing NestJS module
- Writing tests for use cases, repositories, or controllers
- Setting up the frontend testing baseline

---

## Part 1: Swagger

### Decorator patterns

#### Controller level
```typescript
@ApiTags('auth')
@Controller('auth')
export class AuthController {}
```

#### Endpoint level
```typescript
@ApiOperation({ summary: 'Login with email and password' })
@ApiBody({ type: LoginDto })
@ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
@ApiResponse({ status: 401, description: 'Invalid credentials' })
@ApiResponse({ status: 400, description: 'Turnstile validation failed' })
@Post('login')
login(@Body() dto: LoginDto) {}
```

#### Protected endpoint
```typescript
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Get('me')
getMe() {}
```

#### DTO
```typescript
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Cloudflare Turnstile token' })
  @IsString()
  turnstileToken: string;
}
```

---

## Part 2: Backend Testing

### Unit test — use case
```typescript
// application/use-cases/__tests__/login.use-case.spec.ts
describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authRepo: jest.Mocked<AuthRepositoryPort>;
  let turnstile: jest.Mocked<TurnstileService>;

  beforeEach(() => {
    authRepo = {
      findByEmail: jest.fn(),
      updateRefreshToken: jest.fn(),
    };
    turnstile = { verify: jest.fn() };
    useCase = new LoginUseCase(authRepo, turnstile);
  });

  it('throws if turnstile invalid', async () => {
    turnstile.verify.mockResolvedValue(false);
    await expect(
      useCase.execute({ email: 'a@b.com', password: '123', turnstileToken: 'bad' }),
    ).rejects.toThrow(TurnstileFailedError);
  });

  it('throws if user not found', async () => {
    turnstile.verify.mockResolvedValue(true);
    authRepo.findByEmail.mockResolvedValue(null);
    await expect(
      useCase.execute({ email: 'a@b.com', password: '123', turnstileToken: 'ok' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
```

### Integration test — controller
```typescript
// http/__tests__/auth.controller.spec.ts
describe('POST /api/auth/login', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('returns 401 with wrong password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrong', turnstileToken: 'test' })
      .expect(401);
  });
});
```

---

## Part 3: Frontend Testing

### Component test
```typescript
// features/auth/components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('shows validation error when email is empty', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
});
```

## Coverage thresholds (jest.config.js)
```javascript
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Validation checklist
- [ ] All public endpoints have `@ApiTags`, `@ApiOperation`, `@ApiResponse`
- [ ] All DTOs have `@ApiProperty` on every field
- [ ] Protected endpoints have `@ApiBearerAuth`
- [ ] Use case unit tests cover happy path + each error branch
- [ ] Integration tests cover each HTTP status code documented in Swagger
- [ ] Coverage thresholds configured and passing
