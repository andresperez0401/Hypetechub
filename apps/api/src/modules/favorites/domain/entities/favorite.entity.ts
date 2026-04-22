export class FavoriteEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly videoId: string,
    public readonly createdAt: Date,
  ) {}
}
