export type VideoItem = {
  id: string;
  title: string;
  channelName: string;
  views: number;
  likes: number;
  comments: number;
  hypeScore: number;
  relativePublishedAt: string;
};

export type VideosResponse = {
  items: VideoItem[];
  featured: VideoItem;
};
