тоді даю **готовий зміст для `docs/AGENT_CONTEXT.md`** — вставляєш як є. Він стислий, але покриває прод-рівень (мульти-тенант, білінг/підписки, календар/пости, інтеграції, джоби, безпека) і чіткі правила для self-driving агента.

---

# SMM Planner — Agent Context (v1.0)

## 🎯 Призначення

Цей файл — **єдине джерело правди** для агента. Працюємо в режимі *self-driving*: агент пропонує кроки → чекає `✅ Approve` → виконує код/міграції/коміти → звітує diff.

---

## 1) Цілі продукту (MVP)

* **Workspaces (multi-tenant)** з ролями: `Owner`, `Admin`, `Editor`, `Viewer`.
* **Posts/Drafts** + **Calendar** з drag-&-drop, фільтрами, статусами: `draft`, `scheduled`, `approved`, `published`.
* **Brand Kit** (логотип, кольори, шрифти), **Templates**.
* **Publishing v1**: Telegram (Bot API). Метадані для Meta (FB/IG) — підготовити структуру.
* **Subscriptions**: Stripe (Free/Starter/Pro/Business) з **entitlements** і **usage limits**.
* **Scheduler/Jobs** для відкладених публікацій, ретраї.
* **Audits/Activity log**.
* **Legal**: `/legal/{privacy,terms}`.
* **Готовність до продакшн-деплою** (Vercel + Neon + Upstash + Stripe).

---

## 2) Технічний стек

* **Next.js 16 (App Router) + TypeScript strict**, **Tailwind v4 (dark)**.
* **DB**: Postgres (Neon/Supabase) + **Prisma**.
* **Auth**: Clerk **або** Auth.js (один варіант; за замовчуванням — Clerk).
* **Payments**: Stripe (Checkout + Billing Portal, webhooks).
* **Queue / Cron**: Upstash QStash або Vercel Cron + fetcher.
* **Storage**: Cloudflare R2/S3 (медіа/лого) — пізніше.
* **Деплой**: Vercel (web), Neon (DB), Upstash (jobs), Stripe.
* **Тест/якість**: ESLint, Prettier, basic vitest (опц.).

---

## 3) Структура репозиторію (target)

```
/app
  /(public)            # маркетинг/легал
  /(app)               # захищена зона
    /dashboard         # "/"
    /posts             # список/таблиця/фільтри
      /_components     # Filters.tsx, PostsTable.tsx
      /_data           # mock.ts (до API)
    /calendar
    /brand-kit
    /integrations
    /billing
  layout.tsx
  page.tsx
/lib
  db.ts                # prisma
  auth.ts              # clerk/auth.js helpers
  entitlements.ts
  utils.ts
  types.ts
/prisma
  schema.prisma
/public
/styles
  app/globals.css
/docs
  AGENT_CONTEXT.md
  TICKETS.md           # backlog (список задач)
```

---

## 4) ENV (мінімум)

```
DATABASE_URL=postgres://...
NEXT_PUBLIC_APP_URL=http://localhost:3021
# Auth (обери стек та використай відповідні ключі)
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
# Telegram
TELEGRAM_BOT_TOKEN=...
# QStash / Cron (якщо QStash)
QSTASH_URL=...
QSTASH_CURRENT_SIGNING_KEY=...
QSTASH_NEXT_SIGNING_KEY=...
```

---

## 5) Дані/моделі (Prisma – концепт)

* **User** (id, email, name)
* **Workspace** (id, name, ownerId)
* **Member** (userId, workspaceId, role)
* **BrandKit** (workspaceId, logoUrl, colors[], fonts[])
* **SocialConnection** (workspaceId, platform, externalId, accessToken, refreshToken, meta, revokedAt)
* **Post** (workspaceId, title, body, platform, tags[], status, scheduledAt, publishedAt, authorId, createdAt)
* **Schedule** (postId, runAt, status, attempts, lastError)
* **Plan** (code, name, priceCents, period) — сидовані
* **Entitlement** (planCode, key, limit)
* **Subscription** (workspaceId, planCode, stripeCustomerId, status, currentPeriodEnd, trialEnd)
* **UsageCounter** (workspaceId, key, month, used)
* **AuditLog** (workspaceId, actorId, action, entity, entityId, meta, createdAt)

**Entitlement keys (приклад):**
`max_members`, `max_connected_accounts`, `max_posts_per_month`, `templates_enabled`, `calendar_enabled`, `approvals_enabled`.

---

## 6) Роути/сторінки

* `/` → Dashboard: KPI-картки + «Сьогодні».
* `/posts` → список (таблиця) + **Filters**: `q`, `platform`, `status`, `tags`, `page`, синхронізація з **URL**.
* `/calendar` → тиждень/місяць, drag-&-drop (MVP: лише перегляд + перенос scheduled).
* `/posts/new` → редактор поста (platform, text, media placeholder).
* `/integrations` → підключення Telegram (збереження токена), стан конекшнів.
* `/billing` → Pricing + Checkout + Customer Portal (Stripe).
* `/brand-kit` → лого/кольори/шрифти.
* `/legal/{privacy,terms}`.

---

## 7) Публікація/джоби

* **Telegram**: `POST /api/publish/telegram` робить відправку.
* **Scheduler**: періодично бере з `schedules` записи з `runAt <= now()` зі статусом `pending`, робить публікацію, оновлює `posts.status=published`/`lastError`, 3 ретраї.
* **Cron**: кожні 1–5 хвилин.

---

## 8) Тарифи (дефолт)

* **Free**: `max_members=1`, `max_connected_accounts=1`, `max_posts_per_month=30`.
* **Starter ($9)**: `3, 3, 200`, + templates.
* **Pro ($29)**: `10, 10, 1000`, + calendar, approvals.
* **Business ($79)**: високі ліміти, аудит, пріоритет.

---

## 9) Безпека/правила

* Зберігати токени **шифровано** (at rest) і ротути за можливості.
* Перевірка доступів: кожен запит має workspace scope.
* Rate-limits на API публікацій.
* Логи аудиту для критичних дій.
* Легалка доступна публічно, cookie-банер (якщо потрібно).

---

## 10) Definition of Done (MVP)

* `npm run dev:3021` → UI без помилок, лінтер чистий.
* `/posts` → фільтри працюють + URL sync; таблиця з пагінацією.
* Telegram publish працює (manual + scheduled).
* Stripe: Checkout + Webhook → `subscriptions` оновлюються; `/billing` показує активний план.
* Entitlements застосовуються (UI/дії блокуються при перевищенні).
* Prod deploy: Vercel (веб), Neon (DB), Upstash/cron, Stripe webhooks.

---

## 11) Робочий процес агента (Self-Driving)

1. На початку кожного великого кроку надсилай: **“Plan: Step 1..3”** (🔹 що, 🔹 файли, 🔹 очікуваний результат).
2. Чекай `✅ Approve` / `❌ Reject` / `✏️ Modify`.
3. Після виконання — **diff/список файлів** + короткий тест-гайд (як перевірити).
4. Один логічний крок = один коміт. Коміти у форматі **Conventional** (`feat(scope): msg`).
5. Де можливо — **писати тести** (мінімально).

---

## 12) Початковий беклог (у такому порядку)

1. **Init DB (Prisma)**: schema для users/workspaces/members/posts/schedules/plans/entitlements/subscriptions/usage/audit; `db push`; сид для `plans`/`entitlements`.
   *Commit:* `feat(db): init prisma schema with plans & entitlements seed`.
2. **Auth + Tenant**: інтеграція Clerk/Auth.js; middleware; автоспейс на signup; `/dashboard`.
   *Commit:* `feat(auth): clerk + workspace bootstrap`.
3. **Billing**: `/billing` (Pricing) + `POST /api/billing/checkout` + `POST /api/stripe/webhook` + показ активного плану.
   *Commit:* `feat(billing): stripe checkout & webhook`.
4. **Entitlements Guard**: хелпер `canUse(workspaceId, key)` + middleware UI блокувань; лічильник постів/місяць.
   *Commit:* `feat(core): entitlements & usage counters`.
5. **Posts + Filters + Table**: `/posts` із мок-даними → потім з БД; URL-sync; пагінація.
   *Commit:* `feat(posts): filters, table, url state`.
6. **Calendar**: базовий UI (перегляд/drag) з даними з `posts`.
   *Commit:* `feat(calendar): weekly view + drag`.
7. **Integrations: Telegram**: підключення токена, тест-пост.
   *Commit:* `feat(integrations): telegram connect & test`.
8. **Scheduler/Jobs**: cron/worker, ретраї, логи.
   *Commit:* `feat(jobs): scheduler for scheduled posts`.
9. **Brand Kit / Templates** (MVP).
   *Commit:* `feat(brand): kit & templates`.
10. **Legal & Polish**: сторінки legal, пусті стани, лоадери, трекінг.
    *Commit:* `chore(app): legal pages & polish`.

---

## 13) Скрипти npm

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:3021": "next dev -p 3021",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "prisma:push": "prisma db push",
    "prisma:studio": "prisma studio",
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 14) Підказки для агента (копіюй у чат при старті)


