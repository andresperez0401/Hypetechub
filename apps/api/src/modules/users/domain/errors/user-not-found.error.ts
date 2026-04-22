import { DomainException } from '../../../../core/exceptions/domain.exception';

export class UserNotFoundError extends DomainException {
  constructor(userId: string) {
    super(
      'USER_NOT_FOUND',
      `User with id ${userId} was not found`,
      404, // Not Found
    );
  }
}
