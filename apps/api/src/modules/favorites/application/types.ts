/** Input for the AddFavorite use case — no framework dependencies. */
export interface AddFavoriteInput {
  videoId: string;
}

/** Output shape returned by favorites use cases — no framework dependencies. */
export interface FavoriteOutput {
  id: string;
  userId: string;
  videoId: string;
  createdAt: string;
}
