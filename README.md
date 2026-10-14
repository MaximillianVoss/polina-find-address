# React Native — Find Address

Адрес → координаты → маркер карты. Сентябрьская версия и старая fullstack — одна работа.

Маршрут: прочитать условия → установить зависимости → запустить → пройти проверки → подготовить к сдаче.

## Условия

- [assignment-original.md](docs/materials/homework-2026-09-20/docs/mobile/08-find-address/assignment-original.md)

## Запуск из чистой копии

Нужны Node.js (>=24 <25) и npm. Откройте терминал в корне этого репозитория рядом с package.json.

~~~bash
node --version
npm --version
npm install
npm start
~~~

Lock-файл отсутствует в исходном самостоятельном проекте. Первая установка создаст package-lock.json; чистая повторная установка npm ci требует отдельной проверки.

Откройте совместимый Expo Go и отсканируйте QR в той же сети либо используйте Android/iOS эмулятор. iOS Simulator требует macOS и Xcode. Геолокация, карта, контакты, SQLite и речь проверяются на реальном устройстве отдельно; браузерный экспорт этого не доказывает.

## Проверка

~~~bash
npm run typecheck
npm test
npx expo export --platform android --output-dir dist-android
npx expo export --platform ios --output-dir dist-ios
~~~

В этой упаковке установки и проверки не выполнялись. Сборка, браузер, macOS и реальное устройство имеют отдельный статус; наличие файлов не означает готовность к сдаче.

## Разбор и материалы

- [Исходное руководство приложения](docs/PROJECT-README.md)
- [MANUAL.md](docs/materials/homework-2026-09-20/docs/mobile/08-find-address/MANUAL.md)

## Предыдущие самостоятельные срезы

- [08-find-address](stages/02-08-find-address/README.md)

Каждый срез запускается из своей папки. Главная версия находится в корне.

## Зависимости и открытые проверки

- Внешний API, доступ к сети или настройки сервиса могут требоваться по исходному руководству. Доступность сервиса сейчас не проверялась.

## Объективные пробелы

- npm install; lockfile generation and clean install verification pending


## Единый запуск

```bash
bash ./build-and-run.sh --list
bash ./build-and-run.sh
```

[Запуск и перенос в свой GitHub](docs/CLIENT-HANDOFF.md).

<!-- upstream-tools:start -->
## Скачать независимую копию

В папке `delivery-tools` находятся скрипт, Python companion и каталог всех 24 проектов.
Нужны Git, Python 3.9+ и Bash 3.2+ (macOS/Linux или Windows через WSL/Git Bash).

```bash
mkdir -p "$HOME/Projects"
bash delivery-tools/export-project.sh --catalog delivery-tools/projects.tsv --project mob-address --dest "$HOME/Projects/polina-find-address" --init-git
```

Результат: отдельная папка с новым Git без исходной истории и remote. Без
`--init-git` Git metadata отсутствует. [Все параметры](delivery-tools/README.md).
Отмеченный downloader и этот блок удаляются из чистой копии автоматически.
<!-- upstream-tools:end -->
