# LexiconGate

[English](./README.md) · [Русский](./README.ru.md)

Библиотека модерации текста по двум спискам: запрещённому и разрешённому.
Проверяет строку, при необходимости заменяет недопустимые фрагменты и готовит
данные для административного разбора. Точка входа — `createLexiconGate` и
служба `LexiconGate`.

## Назначение

- определить наличие недопустимых слов;
- получить текст для публикации вместо исходного;
- вести списки с нормализацией написания;
- при множественных совпадениях подставить целую замену;
- сформировать тикет разбора и применить решение `allow` / `ban`;
- хранить списки в памяти или в файлах.

Доставка сообщений в мессенджер в пакет не входит.

## Установка

Внутренний пакет `@animalfox/lexicon-gate` (workspace, `file:` или git). Нужен
**Node.js ≥ 20**. После клонирования выполните `npm run build` (либо
положитесь на `prepack` при `npm pack`).

## Быстрый старт

```ts
import { createLexiconGate } from "@animalfox/lexicon-gate";

const gate = createLexiconGate({ blackList: ["мат"] });
const hit = gate.inspect("тут мат");

if (hit.isOffensive) {
  // опубликовать hit.censoredDisplayText
  // при hit.adminTicket — предложить администраторам allow / ban
}
```

Файловое хранение:

```ts
const gate = createLexiconGate({
  files: { blackPath: "./black.txt", whitePath: "./white.txt" },
});
```

### Списки

```ts
gate.banWords("слово");
gate.allowWords("исключение");
gate.blackList;
gate.whiteList;
```

### Решение администратора

```ts
const decision = gate.tryApplyAdminCallback("white спорное");
// decision?.action === "allow" | "ban"
```

### Объявления

```ts
gate.announceBan("Admin");
gate.announceAllow("Admin", "слово");
```

## Результат `inspect`

| Поле                  | Назначение                                  |
| --------------------- | ------------------------------------------- |
| `isOffensive`         | есть ли недопустимые фрагменты              |
| `originalText`        | исходная строка                             |
| `censoredDisplayText` | строка для публикации                       |
| `offensiveTokens`     | сработавшие токены                          |
| `usedMegaReplacement` | применена полная замена текста              |
| `adminTicket`         | тикет при неточном совпадении, иначе `null` |

## Публичный API

| Имя                        | Назначение                      |
| -------------------------- | ------------------------------- |
| `createLexiconGate`        | создание службы                 |
| `LexiconGate`              | служба модерации                |
| `LexiconGateOptions`       | параметры: память **или** файлы |
| `LexiconGateMemoryOptions` | вариант со списками в памяти    |
| `LexiconGateFileOptions`   | вариант с путями к файлам       |
| `LexiconInspection`        | результат `inspect`             |

Прочие модули из барреля пакета не экспортируются.

## Разработка

```bash
npm install
npm run build
npm test
npm run typecheck
npm run check
npm run check:fix
npm pack
```

После `npm install` включается `pre-commit`: форматирование и исправление
замечаний для файлов в индексе Git.

## Лицензия

Распространяется на условиях [Apache License 2.0](./LICENSE).
Уведомление об авторских правах — в файле [NOTICE](./NOTICE).
