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
- tags: string[]

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
- latinName: string
- slug: string
- description: string

Опционально:

- depthRange: string
- locations: string[]
- images: string[]
- tags: string[]
- draft: boolean

---

## 3. Правила

- slug должен быть уникальным.
- draft страницы не попадают в продакшн.
- alt-тексты обязательны для изображений.
- нельзя публиковать контент без description.
