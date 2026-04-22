import { VideoEntity } from '../entities/video.entity';

export const VIDEOS_SOURCE_PORT = Symbol('VIDEOS_SOURCE_PORT');

export interface VideosSourcePort {
  getVideos(): Promise<VideoEntity[]>;
}
