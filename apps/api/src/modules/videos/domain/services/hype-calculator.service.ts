import { VideoEntity } from '../entities/video.entity';

/**
 * Hype calculation per challenge spec:
 * Base hype = (likes + comments) / views
 *
 * Business rules:
 * 1. If title contains "Tutorial" (case-insensitive) → multiply hype by 2
 * 2. If commentCount is missing (commentsDisabled) → hype = 0
 * 3. If viewCount is 0 → hype = 0 (avoid division by zero)
 */
export class HypeCalculatorService {
  calculate(video: VideoEntity): number {
    if (video.commentsDisabled) return 0;
    if (video.views === 0) return 0;

    let hype = (video.likes + video.comments) / video.views;

    if (video.isTutorial) {
      hype *= 2;
    }

    return Math.round(hype * 10000) / 10000;
  }
}
