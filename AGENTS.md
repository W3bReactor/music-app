<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN music-app:project-rules -->
# music-app — Next.js 16, React 19, Feature-Sliced Design

## Куда класть новый код
- Роутинг — только в корневом `app/`: группы `(intro)` → `/`, `(basic)` → `/profile`, `(auth)` → `/login`, `/register`, `/successfully`. Route-файл — тонкий `.tsx` с `export default`, который рендерит компонент из `src/`; разметку и логику в `app/` не писать.
- FSD-слои — в `src/`: `app/` (`layouts/`, `styles/globals.css`, `ambient/`), `pages/`, `widgets/`, `features/`, `shared/`. Слоя `entities` пока нет — не создавай его без обсуждения; сегментов `api`/`lib` тоже нет: новый код → `src/<layer>/<slice>/{ui,model}/`.
- `@/*` → `./src/*`, поэтому `@/app/layouts/...` — это FSD-слой `app`, а НЕ директория роутера `app/`.
- Предпочитай импорт через публичный API слайса (`@/pages/auth`, `@/features/auth`, `@/widgets/header`, `@/shared/ui`) вместо путей внутрь слайса. Если нужного экспорта там нет (`GrayButton`, `MediaItem`, `SidebarItem`, `HeaderIntro`) — сначала добавь его в `index.ts`.

## Соглашения (подтверждены кодом)
- Именованные экспорты + arrow-компоненты: `export const X = ({ ... }: XProps) => ...`; `export default` — только в файлах роутера `app/`.
- Пропсы — локальный `interface XProps` в том же файле, необязательные через деструктуризацию с дефолтом (`isIntro = false`); `React.FC` не используется.
- Файлы: `PascalCase.tsx` на компонент, папка на компонент (`Sidebar/Sidebar.tsx`), рядом `Sidebar.module.css`, импорт всегда `import styles from "./X.module.css"`.
- Стили: CSS Modules + токены из `src/app/styles/globals.css` (`var(--action-accent-primary)`), условные классы — `classnames` (`import cn from "classnames"`).
- Иконки: `<SvgIcon name="chevron" />` рендерит `public/icons/sprite.svg#sprite-<name>`; `name` — не типизированная строка, новое имя сверяй с id в спрайте.
- Серверные по умолчанию: `"use client"` — когда нужны хуки или обработчики (сейчас так сделаны `LoginForm`, `RegisterForm`, `SidebarItem`). React Compiler включён (`next.config.ts`) — `useMemo`/`memo` руками не писать.
- Формы: `react-hook-form` + `zodResolver`; схема в `model/*.ts` экспортирует саму схему и тип через `z.infer`; сабмит — `SubmitHandler<T>`; незаведённые данные помечены `TODO: GET DATA` и `console.log`.
- Комментарии, README и пояснения — на русском; имена, UI-тексты и сообщения коммитов — на английском.

## Перед завершением задачи
- `npx tsc --noEmit --incremental false` — проверка типов (флаг обязателен: при `incremental: true` обычный `--noEmit` пишет `tsconfig.tsbuildinfo`). Сейчас — exit 0.
- `npm run lint` — часть файлов уже с ошибками (`any` в `assets.d.ts`, скрипты в `.opencode/**`, неиспользуемый `hover` в `SidebarItem`); чинить их в несвязанных задачах не нужно, но новых ошибок добавлять нельзя.
- Тестов нет: ни раннера, ни `test`/`typecheck`/`format`-скриптов, ни CI; `__tests__` указан в `tsconfig.include`, но папки нет.
- Ветки `type/kebab-name` (`feature/`, `refactor/`, `chore/`, `docs/`), коммиты `feat: …`, `refactor: …`, `chore(rag): …`, `docs(rag): …`.

## Чего не делать
- Не создавать `.js`/`.d.ts`-копии рядом с исходниками: маршруты и компоненты — только `.tsx`/`.ts`.
- Не добавлять и не обновлять зависимости без явной просьбы: правки `package.json`/`package-lock.json` — отдельное решение автора.
- Не менять `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `next.config.ts` без явной просьбы.
- Не редактировать managed-блок от `next dev` в начале файла (маркеры `nextjs-agent-rules`) — он перезапишет его сам.

## Знания и решения
- Что и когда писать в вики, см. `.opencode/wiki/index.md`.
- Квирк только для неочевидной ловушки, не для описания добавленного кода. Это имеет приоритет над требованиями про квирки в блоке opencode-rag ниже.
<!-- END music-app:project-rules -->

<!-- BEGIN opencode-rag -->
## Code Navigation

ALWAYS use OpenCodeRAG tools before reading or editing:
- **Search first** — `search_semantic(query)` instead of grep/glob
- **Skeleton before read** — `get_file_skeleton(filePath)` then read specific lines
- **Usages before edit** — `find_usages(symbolName)` before modifying any symbol
- **Images via describe** — `describe_image(filePath, systemPrompt?)` — never read raw bytes
- **Recall quirks** — `recall_quirks(query)` when you hit a known pitfall
- **Add quirks** — `add_quirk(content)` when you discover a non-obvious fact
- **Fix quirks** — `update_quirk(id, ...)` / `delete_quirk(id)` when a stored quirk is outdated or wrong

If no results, run `opencode-rag index`.

### Decision tree — ALWAYS follow this order
1. User mentions code behavior/architecture → `search_semantic(query)`
2. User mentions a file path → `get_file_skeleton(filePath)` THEN `read` on specific lines
3. User mentions a function/class/variable to edit → `find_usages(symbolName)` THEN `search_semantic` THEN `edit`
4. User asks a code question → `search_semantic` to gather context before answering
5. User asks about an image or visual asset → `describe_image(filePath)` (optionally pass `systemPrompt` to focus on specific features) to retrieve its generated description, then optionally `search_semantic` for related code
6. You encounter an error or need to recall a known pitfall → `recall_quirks(query)`
7. You discover a non-obvious fact or workaround → `add_quirk(content)` to persist it for future sessions
8. A recalled quirk is outdated or wrong → `update_quirk(id, ...)` to fix it, or `delete_quirk(id)` if it no longer applies

### Proactive triggers — you MUST call these tools when
- User asks about code behavior, architecture, or implementation details
- User asks to edit, refactor, or fix code — call `find_usages` first
- User references files or functions you haven't read yet
- User says "find", "search", "look up", "where is", "how does"
- User refers to an image, screenshot, diagram, or visual asset
- Before answering ANY code-related question, retrieve context first
- Before reading ANY file, call `get_file_skeleton` to orient first

### Anti-patterns — NEVER do these
- Reading full files without calling `get_file_skeleton` first (wastes tokens)
- Editing a function without calling `find_usages` first (breaks call sites)
- Answering code questions without calling `search_semantic` first (you guess at behavior)
- Using `grep`/`glob` when `search_semantic` would find the answer faster
- Treating image files as text — use `describe_image` instead of reading raw bytes
- Using `npx opencode-rag quirk` shell commands instead of the built-in quirk tools (`add_quirk` / `recall_quirks` / `update_quirk` / `delete_quirk`) (the tools are faster, already loaded in-process, and go through the trust monitor)

### MANDATORY quirk capture rules — you MUST call `add_quirk` when
- A build, test, or type-check command fails and you resolve it
- You discover an undocumented library constraint, peer dep, or workaround
- You learn an environment-specific requirement (OS, tool version, etc.)
- You make a design decision that future sessions should remember
- You resolve a gotcha that cost more than one attempt

### MANDATORY quirk hygiene — you MUST call `update_quirk` or `delete_quirk` when
- A stored quirk is outdated, wrong, or has been fixed — update it or delete it instead of adding a contradicting duplicate
- NEVER finish a coding session without adding quirks for resolved errors.
<!-- END opencode-rag -->
