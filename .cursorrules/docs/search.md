# Поиск

Поиск обязателен.

---

## 1. Архитектура

- Build-time индекс: `scripts/build-search-index.js` → `public/search-index.json` (prebuild/postinstall).
- В индексе по каждой записи: title, path, category, image?, nameEn?, **contentSearch** (нормализованный текст тела статьи — тот же `cleanText`, что в `utils/textUtils`).
- Поиск на клиенте: загрузка индекса разово; по вводу запроса — `cleanText(query)`, для каждой записи `searchText = cleanText(title) + cleanText(nameEn) + contentSearch`, фильтр `searchText.includes(cleanedQuery)`; сниппеты — `utils/searchUtils.findSearchSnippet(contentSearch, cleanedQuery, title, nameEn)`.
- Логика совпадает с прежним серверным поиском: поиск по полному тексту статей, тот же вывод (карточки + подсвеченные фрагменты).

---

## 2. UI

- Поле поиска в шапке на всех страницах (как на diversnotes.com).
- Результаты — в оверлее/выпадающем списке, без отдельной страницы /search.
- Минимум 2 символа, задержка 300 ms перед запросом.

---

## 3. Аналитика

Отслеживать событие:
- search_query
