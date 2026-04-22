import { DomainException } from '../../../../core/exceptions/domain.exception';

export class FavoriteAlreadyExistsError extends DomainException {
  constructor(userId: string, videoId: string) {
    super(
      'FAVORITE_ALREADY_EXISTS',
      `Favorite already exists for user ${userId} and video ${videoId}`,
      409, // Conflict
    );
  }
}
