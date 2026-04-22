/** Output shape returned by users use cases — no framework dependencies. */
export interface UserProfileOutput {
  id: string;
  email: string;
  provider: string;
  displayName: string | null;
  avatarUrl: string | null;
}
