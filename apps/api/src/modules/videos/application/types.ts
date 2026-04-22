/** Single video output shape — no framework dependencies. */
export interface VideoItemOutput {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  views: number;
  likes: number;
  comments: number;
  hypeScore: number;
  relativePublishedAt: string;
  isTutorial: boolean;
  commentsDisabled: boolean;
}

/** Aggregate output from GetVideosUseCase — no framework dependencies. */
export interface VideosOutput {
  items: VideoItemOutput[];
  featured: VideoItemOutput;
}
