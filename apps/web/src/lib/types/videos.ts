export interface VideoItem {
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

export interface VideosResponse {
  items: VideoItem[];
  featured: VideoItem;
}
