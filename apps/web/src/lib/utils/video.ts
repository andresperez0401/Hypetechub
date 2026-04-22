export function formatHypeScore(score: number): string {
  if (score === 0) return '0';
  if (score >= 1) return score.toFixed(2);
  return score.toFixed(4);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('es-ES');
}
