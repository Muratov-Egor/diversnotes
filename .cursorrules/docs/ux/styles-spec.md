# Styles Spec (Concrete)

Цель: единая система размеров/типографики/отступов для listing + article.
Все значения в px (можно перевести в rem при реализации).

---

## 1) Breakpoints

- sm: 640
- md: 768
- lg: 1024
- xl: 1280
- 2xl: 1536

---

## 2) Containers

### Page padding
- mobile (<768): 16
- tablet (768–1023): 24
- desktop (>=1024): 32

### Content widths
- Reading container (article text): max-width 720
- Listing container: max-width 1120
- Breakout wide (images/tables): max-width 1120–1200
- Full bleed (редко): 100vw (с ограничением по высоте/CLS)

---

## 3) Spacing scale (8pt)

Используем только:
4, 8, 12, 16, 24, 32, 48, 64, 96

---

## 4) Typography

### Font stacks
- UI sans: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif
- Editorial serif (опционально для body): "Source Serif 4", Georgia, serif
- Mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

### Base sizes
- Body desktop: 18 / line-height 30
- Body mobile: 16 / line-height 28

### Heading scale (desktop / mobile)
- H1: 40/48  | 28/36
- H2: 28/36  | 24/32
- H3: 22/30  | 20/28
- H4: 18/26  | 18/26

### Meta
- meta/small: 14/20
- label: 12/16 (капсом НЕ делать, лучше normal)

### Letter spacing
- headings: -0.01em (минимально)
- body: normal

---

## 5) Colors (tokens, без конкретных hex)

Обязательные токены:
- bg
- bg-elevated
- text
- text-muted
- border
- link
- link-hover
- accent
- accent-weak
- code-bg
- selection

Правила:
- В статье ссылки: underline ALWAYS, hover = underline thickness/opacity change
- Контраст: минимум WCAG AA

---

## 6) Radius / Borders / Shadows

- radius-sm: 10
- radius-md: 12
- radius-lg: 16

Borders:
- 1px border по умолчанию у карточек/инпутов

Shadows:
- по умолчанию none
- на hover: легкая тень или outline (лучше outline)

---

## 7) Interactive states

### Focus-visible
- outline: 2px solid accent
- outline-offset: 2

### Hover (cards/rows)
- background: bg-elevated
- translateY: 1–2 (только grid cards)
- transition: 150–200ms ease-out

### Tap targets
- min height: 44
- icon buttons: 40–44

---

## 8) Global elements

### Links
- article body: underline, thickness 1px, underline-offset 2–3
- nav/listing: underline only on hover

### Horizontal rule
- margin: 32 0
- border: 1px border

### Selection
- background: accent-weak
