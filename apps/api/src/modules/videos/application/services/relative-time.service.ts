/**
 * Relative time using only native JavaScript (no moment.js, no date-fns).
 * Outputs in Spanish.
 */
export class RelativeTimeService {
  fromNow(isoDate: string, now: Date = new Date()): string {
    const published = new Date(isoDate);
    const diffMs = now.getTime() - published.getTime();

    if (Number.isNaN(published.getTime()) || diffMs < 0) {
      return 'Justo ahora';
    }

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
    if (months > 0) return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    if (days > 0) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    if (hours > 0) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    if (minutes > 0) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    return 'Hace unos segundos';
  }
}
