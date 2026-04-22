import { UserAuthProvider, UserEntity } from '../../../domain/entities/user.entity';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import type { UsersRepositoryPort } from '../../../domain/ports/users-repository.port';
import { GetMyProfileUseCase } from '../get-my-profile.use-case';

const makeUser = (): UserEntity =>
  new UserEntity('user-1', 'test@example.com', UserAuthProvider.Local, 'Test User', null);

describe('GetMyProfileUseCase', () => {
  let repo: jest.Mocked<UsersRepositoryPort>;
  let useCase: GetMyProfileUseCase;

  beforeEach(() => {
    repo = { findById: jest.fn() };
    useCase = new GetMyProfileUseCase(repo);
  });

  it('returns user profile when user exists', async () => {
    repo.findById.mockResolvedValue(makeUser());

    const result = await useCase.execute('user-1');

    expect(result.id).toBe('user-1');
    expect(result.email).toBe('test@example.com');
    expect(result.provider).toBe('LOCAL');
    expect(result.displayName).toBe('Test User');
  });

  it('throws UserNotFoundError when user does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing-id')).rejects.toThrow(UserNotFoundError);
  });

  it('UserNotFoundError has correct HTTP status 404', async () => {
    repo.findById.mockResolvedValue(null);

    try {
      await useCase.execute('missing-id');
    } catch (error) {
      expect((error as UserNotFoundError).httpStatus).toBe(404);
      expect((error as UserNotFoundError).code).toBe('USER_NOT_FOUND');
    }
  });
});
