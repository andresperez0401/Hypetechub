export class VideoEntity {
  public readonly commentsDisabled: boolean;
  public readonly isTutorial: boolean;

  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly channelName: string,
    public readonly publishedAt: string,
    public readonly thumbnailUrl: string,
    public readonly views: number,
    public readonly likes: number,
    public readonly comments: number,
  ) {
    this.commentsDisabled = comments < 0;
    this.isTutorial = /tutorial/i.test(title);
  }
}
