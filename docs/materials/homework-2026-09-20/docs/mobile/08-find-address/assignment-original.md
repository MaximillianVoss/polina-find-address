# Assignment 8 (Find the address)

Источник: [скриншот задания](../../../sources/mobile/Screenshot 2026-09-18 at 14.11.21.png). Ниже полностью переписан видимый текст задания; интерфейс Moodle «To do: Make a submission» не является отдельным требованием к коду.

## Original assignment — English

Create an app, where you can type an address and when you press the 'Show'- button, a typed address is shown on the map.

Hints:
- You can use the free Geocoding API to transfer address to coordinates: https://geocode.maps.co
  - Note: The API returns coordinates as strings
- You can also use Google geocoding API to transfer address to coordinates (But that needs registration with billing info): https://developers.google.com/maps/documentation/geocoding/intro

See react-native-map documentation: https://github.com/react-native-community/react-native-maps

## Что требуется

1. Поле ввода адреса.
2. Кнопка Show, запускающая поиск.
3. Преобразовать адрес в широту и долготу.
4. Показать найденную точку на карте с маркером.
5. Если координаты API приходят строками, преобразовать их в числа перед передачей карте.

На изображении пример: Ratapihantie 13, карта района Pasila и маркер. Это иллюстрация, не требование использовать именно этот адрес.

## Граница требования и выбранное решение

Внешние сервисы названы как **Hints / You can use**, то есть подсказки. Готовый проект использует нативный `expo-location.geocodeAsync`, чтобы не требовать регистрации в сервисе из подсказки. Он возвращает числа. Функция `coordinates` также корректно принимает числовые строки: можно подключить другой геокодер без ошибки типов карты. Если преподаватель отдельно требует именно внешний API, это нужно согласовать; исходный скриншот такого ограничения не содержит.

Нумерация курса — **8**, не внутренний номер старого учебного комплекта. Это новая адаптация уже знакомой задачи Find Address.

[Подробное решение](MANUAL.md) · [Код](../../../../../..)
