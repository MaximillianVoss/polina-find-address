# 08 · Find the address: от начала до сдачи

[Исходное задание целиком](assignment-original.md) · [Папка готового проекта](../../../../../..)

## 1. Требования и результат

Поле адреса → кнопка Show → геокодирование → карта и маркер. Числовые строки API должны стать числами.

После ввода «Ratapihantie 13, Helsinki» и нажатия Show карта центрируется на найденном адресе; под картой видны координаты. Пустое поле, несуществующий адрес и отказ разрешения дают понятную ошибку.

Маршрут: сверить условие → открыть/создать Expo TypeScript → восстановить файлы → установить зависимости → проверить типы и логику → запустить на устройстве → пройти ручные сценарии → подготовить сдачу.

## 2. Минимум теории

Адрес — строка, координаты — пара чисел latitude/longitude. Геокодирование переводит адрес в координаты. MapView показывает карту, Marker — отдельную метку. useState хранит ввод, найденный адрес, состояние загрузки и сообщение об ошибке. Обновление state вызывает повторный рендер. В React Native применяются View/Text/TextInput и StyleSheet, а не HTML-теги и CSS-файлы.

Геокодер выбран осознанно: в исходнике geocode.maps.co и Google названы подсказками, а не обязательными сервисами. Здесь используется нативный expo-location.geocodeAsync; на Android он требует foreground-разрешение. Координаты этого метода уже number, но coordinates принимает также строки и проверяет диапазоны. У Google Maps в отдельной Android-сборке может требоваться свой API-ключ; для проверки карты в Expo Go дополнительная конфигурация Maps обычно не нужна. Это не обещание автоматической публикации приложения. См. [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/) и [MapView](https://docs.expo.dev/versions/latest/sdk/map-view/).

## 3. Среда и первый запуск на Mac

Используется согласованная связка Expo SDK 57, React 19.2.3, React Native 0.86.3, TypeScript 6.0.3; точные разрешённые версии зависимостей зафиксированы общим package-lock.json в projects/mobile. Node 24 выбран для одинакового запуска тестов, включая node:sqlite. Случайно обновлять один react-native отдельно от Expo не нужно.

Проверьте:

```bash
node --version
npm --version
# Если NVM уже установлен:
nvm install 24
nvm use 24
```

Нужен Expo Go, совместимый с SDK 57, на телефоне либо iOS Simulator (Xcode, только macOS) / Android Emulator (Android Studio). Компьютер и телефон должны видеть друг друга по сети. Готовые примеры намеренно настроены только на ios/android: браузер не является проверкой карты, GPS, SQLite и RN-персистентности Auth.

### Вариант A — весь комплект

Откройте терминал в корне нового комплекта. У всех четырёх проектов один workspace-lock, поэтому npm ci выполняется в projects/mobile:

```bash
cd projects/mobile
npm ci
cd 08-find-address
npm run typecheck
npm test
npm start
```

Отсканируйте QR в Expo Go. Для уже настроенного симулятора можно вместо последней команды выполнить npm run ios или npm run android. Не запускайте npm start одновременно в нескольких терминалах для одного проекта.

### Вариант B — только одна папка проекта

Скопируйте целиком projects/mobile/08-find-address в отдельный учебный каталог, откройте терминал внутри неё и выполните:

```bash
npm install
npm run typecheck
npm test
npm start
```

При отдельном копировании общего lock-файла нет: сначала npm install создаёт собственный package-lock.json. Команда npm ci допустима только после этого. Если уже работали в Classroom-репозитории, сначала сохраните свой исходный вариант; не заменяйте его файлы вслепую.

### Вариант C — восстановить с нуля вручную

[create-expo-app](https://docs.expo.dev/more/create-expo/) поддерживает blank-typescript и --no-install. Создавайте в новой пустой папке, не внутри существующего проекта:

```bash
npx create-expo-app@latest 08-find-address --template blank-typescript --no-install
cd 08-find-address
```

Затем замените package.json, app.json, tsconfig.json, index.ts и App.tsx полными версиями ниже, добавьте src/ и tests/, после чего npm install. Версии готового package.json возвращают пример к проверенной связке SDK57 даже если текущий шаблон уже обновился. Не переносите node_modules с Windows на Mac.

## 4. Реализация по этапам

### Этап 1. Каркас

Создайте пустой TypeScript Expo-проект или возьмите готовую папку. Восстановите package.json, app.json, tsconfig.json и index.ts по полным листингам ниже. index.ts регистрирует корневой App. В этом проекте App.tsx лежит в корне, это НЕ Vite src/App.tsx.

### Этап 2. Проверка координат

Создайте src/coordinates.ts. Прочитайте type Coordinates: у каждого объекта ровно latitude и longitude. В coordinates сначала отбрасываются null/пустые строки, затем вызывается Number, проверяется Number.isFinite и географический диапазон. Без проверки Number('') дал бы ложный ноль.

### Этап 3. Форма

Перенесите App.tsx и src/styles.ts. Свяжите value={address} с onChangeText={setAddress}. Редактирование TextInput теперь обновляет состояние, а не только нарисованный текст.

### Этап 4. Обработчик Show

showAddress обрезает пробелы, не пускает пустой ввод, блокирует повторное нажатие, запрашивает нужное разрешение, вызывает geocodeAsync. Ответ — массив: берём первый результат только после проверки, что он существует.

### Этап 5. Карта

centre выбирает результат или начальный центр Helsinki. region задаёт положение камеры, latitudeDelta/longitudeDelta — масштаб охватываемого участка. Marker рисуется только при успешном поиске; начальный Helsinki не выдаётся за найденный адрес.

### Этап 6. Проверка

Выполните команды typecheck/test, откройте приложение в телефоне или симуляторе. Сначала найдите полный адрес, затем повторите с другим городом и ошибочным вводом. Сохраните доказательство именно работающей карты.

## 5. Что использовано и почему

| Функция / приём | Что делает | Почему здесь |
|---|---|---|
| coordinates | Нормализует number/string, отбрасывает пустые и невозможные координаты. | Карта не должна получать строку, NaN или широту 999. |
| showAddress | Оркестрирует валидацию, разрешение, поиск и обновление state. | Одна точка входа для кнопки и клавиши поиска. |
| requestForegroundPermissionsAsync | Запрашивает доступ на Android перед геокодированием. | Это требование нативного геокодера Android, а не сбор фоновой истории. |
| geocodeAsync | Ищет координаты по адресу. | Не нужен ключ внешнего геокодера; отправляется введённый адрес. |
| Keyboard.dismiss | Закрывает клавиатуру после начала поиска. | Карта остаётся видимой. |
| finally | Снимает loading и при успехе, и при ошибке. | Кнопка не остаётся заблокированной после сбоя. |
| MapView / Marker | Карта и метка — разные компоненты. | Можно изменить центр карты независимо от подписи метки. |

Общие элементы: useState изменяет отображаемые данные; типы TypeScript обнаруживают несоответствия до запуска; SafeAreaView защищает содержимое от выреза экрана; StyleSheet.create описывает нативные стили; disabled не даёт отправить повторную операцию во время обработки. Promise возвращает будущий результат, поэтому нажатия вызывают void handler(), а ошибки обрабатываются внутри async-функции.

## 6. Проверка и ручные сценарии

```bash
npm run typecheck
npm test
npm run bundle:android
npm run bundle:ios
```

Экспорт создаёт JavaScript/Hermes bundle, **не APK/IPA и не готовую установку**. Он подтверждает совместимость импортов и сборки, но не работу физических датчиков/сервиса на телефоне.

4 модульных теста: числа, числовые строки, нулевые/отрицательные координаты, некорректные данные. Они не эмулируют работу настоящего геокодера и карты.

| Сценарий | Ожидаемый результат |
|---|---|
| Пустой адрес / пробелы | Ошибка Enter an address first; запрос не нужен. |
| Ratapihantie 13, Helsinki | Карта и одна метка в районе Pasila; числовые координаты. |
| Другой реальный адрес | Центр и метка меняются; название относится к последнему поиску. |
| Бессмысленный адрес | Address not found либо сообщение провайдера, без падения. |
| Android: отказ разрешения | Объяснение отказа; после включения в Settings повторить Show. |
| Медленная сеть / многократные нажатия | Пока Searching, ввод и кнопка заблокированы. |

## 7. Частые ошибки

Если белая карта: проверьте интернет и поддержку Google Play Services у Android-эмулятора. Если открыт браузер — выбрана неподдержанная цель; используйте Expo Go/нативный симулятор. Нативный геокодер зависит от ОС и доступности её сервиса, поэтому точный результат адреса проверяется на устройстве. Не вызывайте поиск на каждое нажатие клавиши.

Если «react/jsx-runtime not found»: убедитесь, что терминал открыт в нужном проекте, выполните установку зависимостей, выберите workspace TypeScript в редакторе и перезапустите TS Server. Если JSX содержит незакрытый тег — установка зависимостей это не исправит; сравните файл с полным листингом. Если Metro показывает старый вариант, остановите его Ctrl+C и выполните npm start -- --clear. Обычный Expo при Ctrl+C останавливает сервер, а не удаляет проект; старые скрипты создания здесь не используются.

## 8. Что показать при сдаче

1. Прочитать своё исходное условие и перечислить обязательные пункты.
2. Показать реальные исходники и объяснить поток данных по таблице выше.
3. Выполнить typecheck и тесты; не называть их телефонной проверкой.
4. Продемонстрировать основной сценарий и хотя бы одну обработанную ошибку на устройстве.
5. В репозиторий/архив включить исходники, конфигурацию и свой lock-файл, но не node_modules, .expo, dist и .env. Действия публикации/отправки выполняет сам ученик по правилам курса.

## 9. Полные авторские файлы

Далее приведено полное содержимое, без многоточий. package-lock.json не перепечатан: это автоматически сгенерированный файл фиксации зависимостей. Весь необходимый авторский код, конфигурация и тесты перечислены.

### package.json

```json
{
  "name": "homework-08-find-address",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "typecheck": "tsc --noEmit",
    "test": "node --experimental-strip-types --test tests/*.test.ts",
    "bundle:android": "expo export --platform android --output-dir dist-android",
    "bundle:ios": "expo export --platform ios --output-dir dist-ios"
  },
  "dependencies": {
    "expo": "~57.0.24",
    "react": "19.2.3",
    "react-native": "0.86.3",
    "react-native-safe-area-context": "~5.7.0",
    "expo-location": "~57.0.19",
    "react-native-maps": "1.27.2"
  },
  "devDependencies": {
    "@types/react": "~19.2.2",
    "typescript": "~6.0.3"
  },
  "engines": {
    "node": ">=24 <25"
  }
}
```

### app.json

```json
{
  "expo": {
    "name": "Find address",
    "slug": "homework-08-find-address",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "platforms": [
      "ios",
      "android"
    ],
    "plugins": [
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Allow this homework app to use your location while it is open."
        }
      ]
    ]
  }
}
```

### tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "customConditions": [
      "react-native"
    ],
    "allowImportingTsExtensions": true
  },
  "include": [
    "App.tsx",
    "index.ts",
    "src/**/*.ts",
    "src/**/*.tsx"
  ]
}
```

### index.ts

```ts
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

### App.tsx

```tsx
import { useState } from 'react';
import { Button, Keyboard, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { coordinates, type Coordinates } from './src/coordinates';
import { styles } from './src/styles';

const HELSINKI: Coordinates = { latitude: 60.1699, longitude: 24.9384 };

export default function App() {
  const [address, setAddress] = useState('Ratapihantie 13, Helsinki');
  const [result, setResult] = useState<(Coordinates & { address: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function showAddress() {
    const query = address.trim();
    if (!query) {
      setError('Enter an address first.');
      return;
    }
    if (loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    Keyboard.dismiss();
    try {
      // Android requires foreground permission even for address geocoding.
      if (Platform.OS === 'android') {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          throw new Error('Location permission was denied. Enable it in device settings.');
        }
      }
      const matches = await Location.geocodeAsync(query);
      const first = matches[0];
      if (!first) throw new Error('Address not found. Add a city or country and try again.');
      setResult({ ...coordinates(first.latitude, first.longitude), address: query });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not find the address.');
    } finally {
      setLoading(false);
    }
  }

  const centre = result ?? HELSINKI;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Find the address</Text>
          <Text style={styles.hint}>Type a full address, then press Show.</Text>
          <TextInput
            accessibilityLabel="Address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            editable={!loading}
            returnKeyType="search"
            onSubmitEditing={() => { void showAddress(); }}
          />
          <Button title={loading ? 'Searching…' : 'Show'} disabled={loading}
            onPress={() => { void showAddress(); }} />
          {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <MapView
            style={styles.map}
            region={{ latitude: centre.latitude, longitude: centre.longitude,
              latitudeDelta: 0.012, longitudeDelta: 0.012 }}
          >
            {result && <Marker coordinate={result} title={result.address} />}
          </MapView>
          {result && <Text style={styles.hint}>
            {result.address}: {result.latitude.toFixed(5)}, {result.longitude.toFixed(5)}
          </Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

### .gitignore

```text
node_modules/
.expo/
dist*/
.env
.env.*
!.env.example
.DS_Store
```

### .nvmrc

```text
24
```

### src/coordinates.ts

```ts
export type Coordinates = { latitude: number; longitude: number };

// APIs can supply numbers or numeric strings; the native map needs numbers.
export function coordinates(latitude: unknown, longitude: unknown): Coordinates {
  const read = (value: unknown): number => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error('The geocoder returned invalid coordinates.');
    }
    if (typeof value === 'string' && value.trim() === '') {
      throw new Error('The geocoder returned empty coordinates.');
    }
    return Number(value);
  };
  const lat = read(latitude);
  const lon = read(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('The geocoder returned coordinates outside the allowed range.');
  }
  return { latitude: lat, longitude: lon };
}
```

### src/styles.ts

```ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f7fb' },
  content: { padding: 20, gap: 14, flex: 1 },
  title: { fontSize: 26, fontWeight: '700', color: '#14243b' },
  hint: { fontSize: 14, color: '#475569', lineHeight: 21 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#8a9cb4', borderRadius: 8, padding: 12, fontSize: 17 },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: 10, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  label: { fontSize: 17, color: '#14243b', flexShrink: 1 },
  strong: { fontSize: 17, fontWeight: '700', color: '#14243b' },
  error: { color: '#a21b24', fontSize: 15, lineHeight: 21 },
  link: { color: '#1256aa', fontSize: 17, padding: 10 },
  map: { flex: 1, minHeight: 250, borderRadius: 12 },
});
```

### tests/coordinates.test.ts

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { coordinates } from '../src/coordinates.ts';

test('accepts the native geocoder numeric coordinates', () => {
  assert.deepEqual(coordinates(60.2, 24.9), { latitude: 60.2, longitude: 24.9 });
});
test('converts API strings into numbers', () => {
  assert.deepEqual(coordinates(' 60.2 ', '24.9'), { latitude: 60.2, longitude: 24.9 });
});
test('allows zero and negative coordinates', () => {
  assert.deepEqual(coordinates(0, -180), { latitude: 0, longitude: -180 });
});
test('rejects absent, nonnumeric, infinite and out-of-range coordinates', () => {
  for (const pair of [[null, 20], ['', 20], ['north', 20], [91, 20], [20, 181], [Infinity, 0]]) {
    assert.throws(() => coordinates(pair[0], pair[1]));
  }
});
```
