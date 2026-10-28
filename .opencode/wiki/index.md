# Wiki index

Knowledge base for this workspace. Pages are interlinked with `[[wiki/...]]` links.

## Когда писать в вики

Пиши, только если выполняется хотя бы одно:
- решение неочевидно из кода и его нельзя восстановить, прочитав код
  (почему выбрано именно так, какая альтернатива отвергнута);
- найдена ловушка, на которой уже споткнулись или которая стоила больше одной попытки;
- изменилась архитектура: новый слой, слайс-паттерн, правило импортов.

Не пиши:
- что добавлен обычный компонент, схема или страница, это видно из git и кода;
- пересказ кода и перечни файлов;
- запись в `log.md` за каждую задачу (только за значимые решения).

Обычная задача (новый компонент, правка стилей, багфикс) не требует ни новой страницы,
ни квирка. Если сомневаешься, не пиши.

## Формат
- Фронтматтер: `title`, `tags`, `sourceRefs`, `lastReviewed`.
- `entities/` — компоненты и модули, `concepts/` — паттерны, решения и ловушки, `sources/` — внешние материалы.
- Ссылки между страницами — `[[wiki/...]]`; новая страница сразу попадает в каталог ниже.
- Значимое решение — одна запись в `log.md`, без пересказа задачи.

## Entities

| Page | Summary |
|---|---|
| [[wiki/entities/sidebar]] | `shared/ui/Sidebar` + `SidebarItem`: the left nav rail, its items, props and CSS variants |
| [[wiki/entities/svg-icon]] | `shared/ui/SvgIcon`: the sprite-based icon primitive, its available ids and the sprite-only rule (the old JSX `icons.tsx` is gone) |
| [[wiki/entities/opencode-rag-plugin]] | The OpenCodeRAG plugin wired into this repo: server plugin + TUI plugin, config, index status |

## Concepts

| Page | Summary |
|---|---|
| [[wiki/concepts/opencode-rag-local-patches]] | The workspace fix set for the installed plugin: 4 patched files, `@opentui/solid`, re-apply script |
| [[wiki/concepts/opencode-rag-tui-sidebar]] | Where the RAG sidebar panel lives, how to open it, and how the `@opentui/solid` load failure was fixed |
| [[wiki/concepts/opencode-rag-tooling-notes]] | Field notes: which RAG tools pay off, measured failure modes (before/after the patches), working rules |
| [[wiki/concepts/opencode-config-locations]] | Where OpenCode stores config/state on this machine (`~/.config/opencode` vs legacy `~/.opencode`), and the broken `nextjs-mcp` cleanup |
| [[wiki/concepts/music-app-fsd-nextjs]] | The app itself: stack, FSD layers + App Router routing, public API, server/client split, measured command results, gaps |

## Sources

_(none yet)_
