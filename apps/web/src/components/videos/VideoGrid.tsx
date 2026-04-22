import type { VideoItem } from '@/lib/types/videos';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: VideoItem[];
}

export function VideoGrid({ videos }: VideoGridProps): JSX.Element {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </section>
  );
}
