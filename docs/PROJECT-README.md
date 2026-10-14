# 08 · Find the address

Поле адреса → кнопка Show → геокодирование → карта и маркер. Числовые строки API должны стать числами.

- [Исходное задание](materials/homework-2026-09-20/docs/mobile/08-find-address/assignment-original.md)
- [Полная инструкция, теория, листинги, проверки](materials/homework-2026-09-20/docs/mobile/08-find-address/MANUAL.md)

Это Expo TypeScript, запуск на телефоне/нативном симуляторе, не Vite и не обычная web-страница.

Если взят весь комплект: `cd projects/mobile && npm ci`, затем `cd 08-find-address`.
Если скопирована только эта папка: `npm install` (создаст локальный lock).

```bash
npm run typecheck
npm test
npm start
```

Для Android/iOS bundle: npm run bundle:android / npm run bundle:ios. Это не APK/IPA.
