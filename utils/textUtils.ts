/** Нормализация текста для поиска: без разметки, нижний регистр */
export function cleanText(text: string): string {
  if (!text || typeof text !== "string") return "";
  const cleaned = text
    .replace(/https?:\/\/[^\s]*/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`\[\](){}<>|\\/="»«•·…—–.,:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
  return cleaned;
}
