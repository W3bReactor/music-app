---
title: Player store (entities/player)
tags: [player, zustand, audio, state, entities, feature-sliced]
sourceRefs: [src/entities/player/index.ts, src/entities/player/model/player.store.ts, src/entities/player/model/audio.ts, src/entities/player/model/player.selectors.ts, src/features/play-track/ui/PlayBtn.tsx, src/features/pause-player/ui/PausePlayer.tsx, src/widgets/player/ui/Player.tsx, src/widgets/player/ui/PlayerProgress/PlayerProgress.tsx, src/app/layouts/AuthLayout/AuthLayout.tsx, src/shared/libs/mockAudio.ts]
lastReviewed: 2026-11-12
---

# Player store (entities/player)

Общий аудио-стейт приложения: что играет, играет ли, громкость, позиция в очереди, длительность.
Живёт в `entities/player` (synthetic frontend entity) и переиспользуется в `features/play-track`,
`features/pause-player` и `widgets/player`. Архитектурный контекст — [[wiki/concepts/music-app-fsd-nextjs]].

## Почему Zustand (решение из issue)

React Context живёт только в React-дереве, а состояние должно управлять `HTMLAudioElement` и переживать
размонтирование UI; разбиение на контексты дало бы десяток провайдеров. Redux Toolkit отвергнут из-за
избыточной архитектуры и размера бандла. Выбран `zustand` (`^5.1.0`, в `dependencies`).

## Из чего состоит слайс

| Файл | Роль |
|---|---|
| `model/player.store.ts` | `usePlayerStore` (`create<PlayerState>()`): состояние + действия. Единственное место, где пишется стейт плеера |
| `model/audio.ts` | Модульный синглтон `HTMLAudioElement` (`new Audio()`), «знает про store»: слушает `play`/`pause`/`ended`/`volumechange`/`durationchange` и зеркалит их в store через `setState` |
| `model/player.selectors.ts` | По селектору на каждое поле и действие (`selectIsPlaying`, `selectPlay`, …) |
| `index.ts` | Публичный API: `usePlayerStore`, `QueueItem`, все селекторы, `subscribeToTime` |

`PlayerState`: `isPlaying`, `tracksQueue: QueueItem[]`, `currentQueueIndex`, `volume`, `savedVolume`,
`duration` + действия `play`, `playQueue`, `pause`, `prev`, `next`, `toggleMute`, `setVolume`, `seek`.

## Источник правды — сам `<audio>`

- `isPlaying` не выставляется оптимистично: его выставляют события `play`/`pause` элемента. Поэтому кнопки
  показывают реальное состояние, даже если `play()` отклонён (autoplay-политика) или прерван.
- `volume` и `duration` тоже приходят из `volumechange`/`durationchange`, а не из аргументов действий.
- `currentTime` в стор не попадает специально: `subscribeToTime(cb)` вешает `timeupdate` напрямую и отдаёт
  время в локальный `useState` строки прогресса (`PlayerProgress`). Иначе дерево перерендеривалось бы
  несколько раз в секунду.
- `play()` ставит `src` только если он пуст (`isHaveAudioSrc()`), и ловит ошибку: `AbortError` игнорируется,
  остальные — `console.error`.

## Очередь

- `QueueItem = { id, audioUrl? }`; `id` — идентификатор трека, по нему `PlayBtn` решает «этот трек или другой».
- `playQueue(items, index)` **заменяет** очередь переданным массивом — это осознанное предсказуемое поведение
  (клик по карточке играет только её). Цена: после клика по карточке `next()` крутит один трек.
- `next`/`prev` при выходе за границы сбрасывают индекс в `0` (без `repeat`/`shuffle`).

## Кто и когда ставит паузу

Паузу по размонтированию UI **никто** не ставит: `audio` — синглтон вне React, поэтому уход со страницы
не должен глушить музыку. Раньше в `Player` был `useEffect(() => () => pause())`, из-за него звук глох при
любом unmount (переход на `(auth)`, StrictMode, Fast Refresh). Cleanup удалён.

Явная пауза по месту — `features/pause-player`: `PausePlayer` рендерит `null` и гасит воспроизведение при
монтировании. Сейчас он вставлен в `src/app/layouts/AuthLayout/AuthLayout.tsx`, поэтому музыка не играет на
`/login`, `/register`, `/successfully`, а внутри `(basic)` (`/`, `/profile`, `/music/[id]`) `Player` не
перемонтируется и трек не прерывается.

## Карточки и кнопка Play

`PlayBtn` (`features/play-track`) не знает, где стоит: он получает `item: QueueItem` и два слота иконок.
Логика: если `currentQueueItem.id === item.id` — toggle `play`/`pause`, иначе `playQueue([item], 0)`.

В `TrackCard` (entity) кнопка приходит как `playSlot` (паттерн как у `TrackInfo`) — слоем выше её подставляет
`pages/intro`, поэтому entity не импортирует feature. Разметка карточки: `<Link>` — только обложка/текст,
кнопка — соседний элемент с `position: absolute` (вложенный в ссылку `<button>` — невалидный HTML и ломает
клавиатурную навигацию). Стили кнопки — `IntroPage.module.css`, позиционирование — `TrackCard.module.css`.

## Ловушки

- **Циклический импорт** `player.store.ts ↔ audio.ts`. Работает только потому, что все обращения идут из
  функций, вызываемых позже (события, действия). Не добавляй между ними вызовы на уровне модуля.
- **Мок-URL создаётся только на клиенте.** `createMockAudioUrl` на сервере возвращает `""` (защита от
  гидратации), поэтому URL нельзя вычислять в серверном компоненте и передавать в клиентский как проп —
  в RSC-payload попадёт `""`. `getMockAudioUrl(seconds)` кэширует один `Blob` URL на длительность и
  вызывается только из клиентского кода (store, `useState` в `TrackPage`).
- `QueueItem.audioUrl` пока необязателен: `resolveAudioUrl` в сторе подставляет мок (помечено `TODO`).
  Настоящие URL появятся с TanStack Query.
- Присвоение `audio.src` перезапускает воспроизведение с нуля — поэтому `play()` проверяет, что `src` уже есть.
- `savedVolume` запоминается только в `toggleMute`; `setVolume` его не обновляет, так что unmute возвращает
  громкость на момент mute, а не последнюю ненулевую. Известное поведение, отдельным issue.
- React Compiler включён — `useMemo`/`memo` вокруг селекторов не нужны; подписка через селектор уже узкая.

## Related

- [[wiki/concepts/music-app-fsd-nextjs]]
- [[wiki/entities/svg-icon]]
