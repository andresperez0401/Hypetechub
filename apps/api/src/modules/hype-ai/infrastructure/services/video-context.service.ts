import { Injectable } from '@nestjs/common';
import { GetVideosUseCase } from '../../../videos/application/use-cases/get-videos.use-case';

@Injectable()
export class VideoContextService {
  constructor(private readonly getVideosUseCase: GetVideosUseCase) {}

  async buildContext(): Promise<string> {
    try {
      const videosData = await this.getVideosUseCase.execute();
      const lines: string[] = [];

      lines.push(`🏆 Joya de la Corona (mayor hype): "${videosData.featured.title}" por ${videosData.featured.channelName}`);
      lines.push(`   Hype Score: ${videosData.featured.hypeScore} | Vistas: ${videosData.featured.views.toLocaleString()} | Likes: ${videosData.featured.likes.toLocaleString()} | Comentarios: ${videosData.featured.comments.toLocaleString()} | ${videosData.featured.relativePublishedAt}`);
      lines.push(`   Es tutorial: ${videosData.featured.isTutorial ? 'Sí (x2 hype)' : 'No'} | Comentarios desactivados: ${videosData.featured.commentsDisabled ? 'Sí' : 'No'}`);
      lines.push('');
      lines.push('Todos los videos ordenados por hype (de mayor a menor):');
      lines.push('');

      for (const video of videosData.items) {
        const tutorialTag = video.isTutorial ? ' [TUTORIAL x2]' : '';
        const commentsTag = video.commentsDisabled ? ' [SIN COMENTARIOS → hype=0]' : '';
        const viewsZeroTag = video.views === 0 ? ' [0 VISTAS → hype=0]' : '';
        lines.push(`- "${video.title}" por ${video.channelName}${tutorialTag}${commentsTag}${viewsZeroTag}`);
        lines.push(`  Hype: ${video.hypeScore} | Vistas: ${video.views.toLocaleString()} | Likes: ${video.likes.toLocaleString()} | Comentarios: ${video.comments} | ${video.relativePublishedAt}`);
      }

      return lines.join('\n');
    } catch {
      return 'Los datos de videos no están disponibles en este momento.';
    }
  }
}
