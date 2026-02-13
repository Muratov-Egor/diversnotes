# Модель контента

Контент хранится в MDX.
Весь frontmatter валидируется на этапе сборки (zod или аналог).

---

## 1. Blog Post

Обязательные поля:

- title: string
- description: string
- slug: string
- date: ISO string
- tags: string[] — значения из **content/tags.json** (поле `ru`). См. `/docs/tags.md`

Опционально:

- updatedAt: ISO string
- cover: string (URL)
- series: string
- draft: boolean

readingTime вычисляется автоматически.

---

## 2. Marine Life

Обязательные:

- title: string
- nameEn: string — английское название (часто используется в руссокоговорящей среде вместе с русским)
- slug: string
- description: string

Опционально:

- latinName: string — латинское (научное) название, если известно
- depthRange: string
- locations: string[]
- images: string[]
- tags: string[] — из content/tags.json (см. `/docs/tags.md`)
- draft: boolean

---

## 3. Правила

- slug должен быть уникальным.
- draft страницы не попадают в продакшн.
- теги в постах и Marine Life — только из content/tags.json (см. docs/tags.md).
- alt-тексты обязательны для изображений.
- нельзя публиковать контент без description.
