# Техническое улучшение проекта — что сделано и что осталось

## ✅ Что уже сделано автоматически

| # | Задача | Детали |
|---|--------|--------|
| 1 | **ESLint + Prettier** | Созданы `eslint.config.js` и `.prettierrc`. Скрипты: `npm run lint`, `npm run format`. |
| 2 | **Цены как числа** | `priceEstimate` в `src/data/galleryData.ts` теперь `number` (UZS). Форматирование при отображении через `formatPrice()` из `src/utils/format.ts` (`Intl.NumberFormat`). |
| 3 | **Вынос логики из App.tsx** | Созданы хуки: `src/hooks/useGallery.ts` (фильтры, поиск, сортировка, избранное), `src/hooks/useTheme.ts`, `src/hooks/useShare.ts`. `App.tsx` сокращён с 330 до ~180 строк. |
| 4 | **Оптимизация изображений** | Скрипт `scripts/optimize-images.mjs` (sharp): `npm run optimize:images`. Все 310 изображений в `public/product/` сжаты: **131.4 MB → 40.6 MB (−69%)**. Оригинал сохранён в `public/product-backup/` (в gitignore). |
| 5 | **Исправлены lint-ошибки** | Лишние escape, пустой интерфейс, неиспользуемые переменные, `__dirname` → `import.meta.dirname` в vite.config.ts. |
| 6 | **TypeScript 5.9.3** | Понижен с 7.0.2 (dev-зависимость, код не тронут) — чтобы typescript-eslint работал. `tsc --noEmit` и сборка проходят чисто. |

---

## 📋 Что нужно сделать вручную

### 1. Husky + pre-commit хуки (автопроверка перед коммитом)

Цель: `tsc` и `eslint` запускаются автоматически перед каждым `git commit`.

```bash
npm install -D husky lint-staged --legacy-peer-deps
npx husky init
```

В `.husky/pre-commit` (создаётся командой выше) вписать:

```bash
npx lint-staged
```

В `package.json` добавить секцию:

```json
"lint-staged": {
  "src/**/*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "src/**/*.css": ["prettier --write"]
}
```

Проверка: `git commit -m "test"` — хук должен запуститься.

---

### 2. CI/CD — GitHub Actions

Создать `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm run build
```

Деплой (например, на Vercel/Netlify) подключается через их дашборды — они сами подхватят `npm run build` и `dist/`.

---

### 3. WebP/AVIF конвертация (дополнительная экономия ~30%)

Сейчас изображения — оптимизированные JPEG. Для дальнейшей экономии:

```bash
npm install -D sharp --legacy-peer-deps
```

Расширить `scripts/optimize-images.mjs`: для каждого `*.jpeg` генерировать `*.webp` (quality 75) рядом с оригиналом, затем в `galleryData.ts` менять пути `image`/`interiorPreviewImage` на `.webp`.

Альтернатива (проще): в `LotCard.tsx` и `LotDetailModal.tsx` использовать `<picture>` с `<source type="image/webp">` + fallback `<img>`.

---

### 4. Адаптивные изображения (srcset)

Сейчас грузится один размер на все экраны. План:

1. В скрипте оптимизации генерировать 3 размера: `480w`, `960w`, `1600w` (например, в подпапку `public/product-sizes/`).
2. В `LotCard.tsx` заменить `<img src={lot.image}>` на:

```tsx
<img
  src={lot.image}
  srcSet={`${lot.image.replace('/product/', '/product-sizes/480/')},
          ${lot.image.replace('/product/', '/product-sizes/960/')} 960w,
          ${lot.image.replace('/product/', '/product-sizes/1600/')} 1600w`}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
/>
```

---

### 5. Виртуализация списка (при росте каталога)

Сейчас рендерятся все карточки сразу (155 лотов — ещё терпимо). При 300+ лотах:

```bash
npm install react-virtuoso --legacy-peer-deps
```

В `App.tsx` заменить `filteredLots.map(...)` внутри `.art-grid-container` на `<VirtuosoGrid>` из `react-virtuoso`. ВНИМАНИЕ: CSS-grid в `index.css` придётся убрать в пользу layout-параметров Virtuoso.

---

### 6. Headless CMS (удаление данных из кода)

`src/data/galleryData.ts` (3480 строк) — главный кандидат на вынос. Варианты:

- **Стартовый (без бэкенда)**: перенести данные в `public/data/lots.json`, грузить через `fetch` в `useGallery.ts` (lazy, с кэшем в `localStorage`). Бандл JS станет меньше на ~150 KB.
- **Полный (Strapi / Sanity / Payload)**:
  1. Поднять CMS (Docker: `docker run strapi/strapi`).
  2. Создать content-type `Lot` с полями из `src/types.ts` (LotItem).
  3. В `useGallery.ts` заменить `INITIAL_LOTS` на `fetch('/api/lots')`.
  4. Загрузить текущие данные импортом (JSON).

Плюс: контент-менеджер сможет менять лоты без перекомпиляции.

---

### 7. Тесты (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom --legacy-peer-deps
```

В `vite.config.ts` добавить:

```ts
/// <reference types="vitest" />
// ...
test: {
  environment: 'jsdom',
  globals: true,
},
```

Минимальный набор тестов:
- `src/utils/__tests__/format.test.ts` — `formatPrice(3000000)` → `'3 000 000 сум'`
- `src/hooks/__tests__/useGallery.test.ts` — фильтрация по категории/поиску/сортировке
- `src/components/__tests__/LotCard.test.ts` — рендер и клик по карточке

Скрипт: `"test": "vitest"`.

---

### 8. OG-изображения для соцсетей (автоматизация)

При шеринге лота в Telegram/WhatsApp сейчас нет превью. План:

1. Скрипт `scripts/generate-og.mjs` (sharp): для каждого лота рендерить PNG 1200×630 (фон + картинка лота + название + цена).
2. В `index.html` добавить `<meta property="og:image">` (для главной).
3. Для отдельных лотов — генерировать URL вида `/og/lot-042.png` и передавать в `navigator.share` через `files` (где поддерживается).

---

### 9. Мелочи (по желанию)

- **PWA**: `npm i -D vite-plugin-pwa` — офлайн-кэш галереи для мобильных.
- **Аналитика**: добавить счётчик реальных просмотров (сейчас `viewsCount` статичный в данных).
- **Скорость LCP**: первые 6–8 карточек рендерить без `loading="lazy"` (или добавить `fetchpriority="high"` для первой).
- **Доступность**: у `LotCard` кликабельные `<h2>` и `<div>` — лучше обернуть в `<button>`/`<a>` для клавиатурной навигации.

---

## Порядок действий (рекомендуемый)

1. Husky + pre-commit (10 мин) — сразу защищает код
2. GitHub Actions CI (15 мин) — защита на уровне репозитория
3. WebP конвертация (30 мин) — ещё −30% к весу картинок
4. Тесты Vitest (1–2 ч) — базовая безопасность
5. srcset адаптивные изображения (1 ч)
6. Headless CMS (1–2 дня) — когда каталог начнёт активно меняться
7. Виртуализация — только когда лотов станет 300+
