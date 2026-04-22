import { VideoEntity } from '../../domain/entities/video.entity';
import { VideosSourcePort } from '../../domain/ports/videos-source.port';
import { GetVideosUseCase } from './get-videos.use-case';

describe('GetVideosUseCase', () => {
  const now = new Date('2026-04-22T10:00:00.000Z');
  let videosSource: jest.Mocked<VideosSourcePort>;
  let useCase: GetVideosUseCase;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);
    videosSource = { getVideos: jest.fn() };
    useCase = new GetVideosUseCase(videosSource);
  });

  afterEach(() => { jest.useRealTimers(); });

  it('returns items sorted by hype and featured = highest hype', async () => {
    videosSource.getVideos.mockResolvedValue([
      new VideoEntity('a', 'Video A', 'One', '2026-04-22T09:00:00.000Z', 'thumb-a.jpg', 1000, 100, 10),
      new VideoEntity('b', 'Video B', 'Two', '2026-04-21T10:00:00.000Z', 'thumb-b.jpg', 5000, 400, 50),
    ]);

    const result = await useCase.execute();
    expect(result.items).toHaveLength(2);
    // a: (100+10)/1000 = 0.11
    // b: (400+50)/5000 = 0.09
    expect(result.featured.id).toBe('a');
    expect(result.items[0].hypeScore).toBeGreaterThan(result.items[1].hypeScore);
    expect(result.items[0].relativePublishedAt).toBe('Hace 1 hora');
  });

  it('tutorial title doubles hype', async () => {
    videosSource.getVideos.mockResolvedValue([
      new VideoEntity('t', 'React Tutorial', 'Chan', '2026-04-22T09:00:00.000Z', 'thumb.jpg', 1000, 100, 10),
    ]);
    const result = await useCase.execute();
    // (100+10)/1000 = 0.11 * 2 = 0.22
    expect(result.items[0].hypeScore).toBe(0.22);
    expect(result.items[0].isTutorial).toBe(true);
  });

  it('comments disabled (comments=-1) yields hype 0', async () => {
    videosSource.getVideos.mockResolvedValue([
      new VideoEntity('d', 'Drama Video', 'Chan', '2026-04-22T09:00:00.000Z', 'thumb.jpg', 5000, 1000, -1),
    ]);
    const result = await useCase.execute();
    expect(result.items[0].hypeScore).toBe(0);
    expect(result.items[0].commentsDisabled).toBe(true);
  });

  it('zero views yields hype 0', async () => {
    videosSource.getVideos.mockResolvedValue([
      new VideoEntity('z', 'Zero Views', 'Chan', '2026-04-22T09:00:00.000Z', 'thumb.jpg', 0, 0, 0),
    ]);
    const result = await useCase.execute();
    expect(result.items[0].hypeScore).toBe(0);
  });
});
