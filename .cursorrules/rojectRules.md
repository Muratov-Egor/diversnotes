# DiversNotes — Project Rules (.cursorrules)

This project is a complete greenfield rewrite of DiversNotes.
We are building a long-term, minimal, fast, SEO-structured personal diving journal.

Primary language: RU (no prefix).
EN disabled for now, but architecture must support future re-enable.

Old version site https://www.diversnotes.com/ 
Old version github project - https://github.com/Muratov-Egor/blog

---

# 1. Core Principles

1. Build clean architecture from scratch (no legacy hacks).
2. Prioritize performance, readability, and long-term maintainability.
3. Minimalism over visual noise.
4. Mobile performance > visual effects.
5. Every SEO-related change must include canonical + metadata consistency.
6. One-person maintainable system. Avoid overengineering.

---

# 2. Tech Stack

- Next.js 14+ (App Router)
- TypeScript (strict)
- MDX for content
- Tailwind for styling
- Mostly Static Generation (SSG)
- next/image with AVIF/WebP
- Build-time content validation (zod or equivalent)

No CMS.
Content stored in Git.

---

# 3. Canonical URL Structure

RU (default, no prefix):

/  
/blog/[slug]  
/marine-life/[slug]  
/map  
/about  
/tags/[slug]  
/rss.xml  
/sitemap.xml  

If EN returns later:
- /en/... mirrored structure
- add hreflang + language switcher

---

# 4. SEO Requirements (Mandatory)

All pages:
- unique title
- unique description
- canonical
- OpenGraph
- proper robots meta

Articles:
- JSON-LD: Article
- JSON-LD: BreadcrumbList
- FAQ schema if FAQ block exists
- VideoObject schema if YouTube present

Global:
- sitemap.xml
- RSS feed
- robots.txt (prod vs preview aware)

No duplicate URLs.
Always preserve indexability unless explicitly removed.

---

# 5. Migration Rules (Critical)

Before launch:
1. Collect all old URLs.
2. Create redirect map: old → new.
3. Implement 301 redirects.
4. Redirect /en/* to RU equivalent or /.
5. Ensure no important 404s.

SEO loss is unacceptable.

Detailed migration rules:
→ see `/docs/migration.md`

---

# 6. Content Model

All MDX must be validated at build time.

Blog Post required fields:
- title
- description
- slug
- date (ISO)
- tags
Optional:
- updatedAt
- cover
- series
- draft

Marine Life required:
- title
- latinName
- slug
- description
Optional:
- depthRange
- locations
- images
- tags
- draft

Details:
→ see `/docs/content-model.md`

---

# 7. Search (Mandatory)

- Local search only (no paid services).
- Build-time generated index.
- Index blog + marine-life.
- Search box in header (on every page); results in overlay/dropdown — no dedicated /search page.
- Minimal JS footprint.

Details:
→ see `/docs/search.md`

---

# 8. UX Requirements

Must include:
- Dark theme
- Sticky TOC (desktop)
- Sharing buttons (copy link + social)
- “Related posts”
- Tags
- Large responsive images
- Max readable width ~70–75ch

Minimalist layout.
Typography-focused.

---

# 9. Marine Life Strategy

Marine Life is a structured knowledge base and SEO driver.
It must:
- support filtering
- support search
- link from blog articles
- have proper metadata

Details:
→ see `/docs/marine-life.md`

---

# 10. Analytics

Minimum:
- Vercel Analytics
- Google Search Console

Track:
- scroll_50
- scroll_90
- search_query
- outbound clicks
- subscribe (if exists)

Details:
→ see `/docs/analytics.md`

---

# 11. Code Standards

- TypeScript strict mode.
- No unnecessary client components.
- Avoid heavy libraries.
- Server Components by default.
- Validate content at build.
- No silent SEO regressions.

If forced to choose:
Simplicity > Cleverness.

---

# 12. Definition of Done

Project is complete when:

- RU works without prefix.
- Blog + Marine Life fully MDX-driven.
- SEO base implemented (schema + canonical + sitemap + rss).
- Search works.
- Dark theme works.
- Redirects correctly configured.
- Mobile performance strong.
- Architecture clean and extensible.

---

# Documentation References

Detailed documents are located in:

/docs/architecture.md  
/docs/content-model.md  
/docs/tags.md  
/docs/seo.md  
/docs/search.md  
/docs/migration.md  
/docs/marine-life.md  
/docs/analytics.md  
/docs/roadmap.md  
/docs/post-deploy.md  

Cursor must follow .cursorrules as the source of truth.
