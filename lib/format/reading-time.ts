/** Оценка времени чтения по тексту (без разметки). ~200 слов/мин, минимум 1 мин. */
export function getReadingTimeMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
