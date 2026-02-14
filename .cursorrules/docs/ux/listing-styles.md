# Listing Styles

## Page header
- title (H1): 32/40 (desktop), 26/34 (mobile)
- intro text: 16/26, max-width 720, margin-top 12

## Search bar
- height: 44
- padding: 10 12
- radius: 12
- border: 1px border
- icon size: 18
- gap icon/text: 8

## Filter chips (TagChip)
- height: 32–36
- padding: 6 10
- radius: 999
- font: 14/20
- gap between chips: 8
- active: bg-elevated + border accent-weak

## Variant A — Dense List Row
Row:
- min-height: 56 (mobile), 64 (desktop)
- padding: 12 0
- border-bottom: 1px border
- layout: metric | title+desc | meta

Title:
- 18/26 (desktop), 16/24 (mobile)
- max 2 lines, overflow hidden
Desc:
- 14/20, text-muted, max 1 line

Metric pill (optional):
- font: 12/16
- padding: 4 8
- radius: 999
- border: 1px border

Hover:
- background: bg-elevated (или row highlight)
- title underline on hover

## Variant B — Grid Card
Grid:
- gap: 16 (mobile), 20–24 (desktop)

Card:
- padding: 16–20
- radius: 16
- border: 1px border
- min-height: 160–200 (в зависимости от наличия image)

Cover image:
- ratio: 16:9
- radius: 12
- margin-bottom: 12

Title:
- 18/26, max 2 lines
Desc:
- 14/22, max 2 lines, margin-top 8

Meta row:
- margin-top: 12
- font: 12–14
- gap: 12
- tags wrap allowed

Hover:
- translateY: 1–2
- outline/border accent-weak
