import GithubSlugger from "github-slugger";

/**
 * Извлечение оглавления из сырого markdown (тело поста без frontmatter).
 * id через github-slugger — как в rehype-slug, чтобы якоря совпадали.
 */
export type TocItem = { level: 2 | 3; text: string; id: string };

export function getTableOfContents(markdownBody: string): TocItem[] {
  const toc: TocItem[] = [];
  const slugger = new GithubSlugger();
  const re = /^(#{2,3})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdownBody)) !== null) {
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    const id = slugger.slug(text);
    if (id) toc.push({ level, text, id });
  }
  return toc;
}
