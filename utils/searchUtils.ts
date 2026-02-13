/**
 * Та же логика сниппетов, что в серверном поиске — для идентичного вывода при client-side поиске.
 * Ищет в нормализованном тексте контента, возвращает before / match / after.
 */
export function findSearchSnippet(
  contentSearch: string,
  cleanedQuery: string,
  title: string,
  titleEn: string
): { before: string; match: string; after: string } {
  const words = contentSearch.split(" ").filter(Boolean);
  const queryWords = cleanedQuery.split(" ").filter(Boolean);
  const queryJoined = queryWords.join(" ");

  if (
    title.toLowerCase().includes(cleanedQuery) ||
    (titleEn && titleEn.toLowerCase().includes(cleanedQuery))
  ) {
    return { before: "", match: title, after: "" };
  }

  for (let i = 0; i < words.length; i++) {
    const slice = words.slice(i, i + queryWords.length).join(" ");
    if (slice.includes(queryJoined)) {
      return {
        before: words.slice(Math.max(0, i - 5), i).join(" "),
        match: slice,
        after: words.slice(i + queryWords.length, i + queryWords.length + 5).join(" "),
      };
    }
  }

  return { before: "", match: cleanedQuery, after: "" };
}
