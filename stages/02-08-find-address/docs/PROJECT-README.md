# Find Address

## Условие и результат

**Original:** find an address with geocoding and display it on a map.  
**Перевод:** найти адрес через геокодирование и показать его на карте.

Клиент вызывает `https://geocode.maps.co/search` с параметрами `q` и `api_key`. После успешного ответа приложение преобразует координаты в числа, проверяет диапазоны широты и долготы и передаёт их в `MapView region` и `Marker`.

## Установка на macOS

Скопировать `.env.example` в `.env` и добавить личный учебный ключ, не сохраняя этот файл в Git. Выполнить `npm ci`, `npm run typecheck`, `npm test -- --runInBand`, `npx expo-doctor`, `npx expo export --platform android`, затем `npx expo start`. Web export для этой работы не заявлен: `react-native-maps` требует нативную карту и не даёт равноценного Expo-web результата.

## Безопасность и реализация

Значение `EXPO_PUBLIC_` видно в клиентском bundle; в production ключ должен быть на backend/proxy. `src/geocoding.ts` принимает внедряемый `fetchImpl`, поэтому Jest подменяет каждую сеть. `parseCoordinates` принимает числовые строки API и числа, но отвергает пустые/нечисловые строки, boolean, `null`, массивы, объекты и значения вне допустимых диапазонов до передачи данных карте. Загрузка объявляется через polite live region, ошибки — как alert. Ошибочный последующий поиск не убирает предыдущий маркер. Экран находится в `App.tsx`.

## Ручная проверка и защита

Проверить пустой адрес, Moscow, отсутствие результатов, неверный ключ/сеть и (в моках) некорректные координаты. На Android проверить, что видны MapView и один Marker.

Вопрос: «Почему нельзя передать API-строки прямо MapView?» Ответ: карта ожидает числа, а `Number` с проверкой finite/range предотвращает некорректную region.  
Question: “Why retain a marker?” Answer: the last useful result remains visible after a retryable failure.

## Сдача

Не коммитить `.env`; повторить команды проверки и продемонстрировать поиск адреса на поддерживаемом Android-устройстве.
