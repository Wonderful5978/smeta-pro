# Смета-Про — сайт + PWA

Готовый к деплою сайт. Все файлы статические — не нужен сервер, БД, npm.

## Структура

```
site/
├── index.html              ← лендинг
├── download.html           ← страница скачивания
├── app/                    ← PWA-приложение
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── icons/icon.svg
├── downloads/
│   └── smeta-pro-win.zip   ← Windows-версия (готова)
└── README.md               ← этот файл
```

## Деплой на GitHub Pages (бесплатно)

1. Создай новый репозиторий на GitHub, например `smeta-pro`.
2. Залей содержимое папки `site/` в корень репозитория (не саму папку `site`, а её содержимое).
   ```bash
   cd site
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/smeta-pro.git
   git push -u origin main
   ```
3. На GitHub: **Settings → Pages → Source → Deploy from a branch → main / (root) → Save**.
4. Через 1–2 минуты сайт будет доступен по адресу:
   ```
   https://USERNAME.github.io/smeta-pro/
   ```
5. Демо-приложение: `https://USERNAME.github.io/smeta-pro/app/`

## Свой домен (опционально)

1. Купи домен (smetapro.ru, например).
2. В корень `site/` положи файл `CNAME` с содержимым `smetapro.ru`.
3. У регистратора домена в DNS добавь:
   - A-записи: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Или CNAME на `USERNAME.github.io`
4. На GitHub: **Settings → Pages → Custom domain → smetapro.ru → Save** + галочка **Enforce HTTPS**.

## APK для Android (сборка из PWA)

1. После деплоя зайди на [pwabuilder.com](https://www.pwabuilder.com/).
2. Вставь URL приложения: `https://USERNAME.github.io/smeta-pro/app/`
3. Нажми **Start** → проверь manifest и SW (должны быть зелёные).
4. Кнопка **Package For Stores → Android → Generate Package**.
5. Скачается ZIP с `.apk` (и `.aab` для Play Market, но он нам не нужен).
6. Положи `.apk` в `site/downloads/smeta-pro.apk` и закоммить.

PWABuilder сделает APK сам — Android Studio не нужна, аккаунт разработчика тоже.

## Что подправить перед запуском

В `index.html` (лендинг):
- Цена `1 990 ₽` — поставь свою
- FAQ → последний вопрос «Как происходит оплата?» — впиши свой способ (Boosty, СБП, бот и т.п.)
- Футер: email и телефон

В `download.html`:
- Когда соберёшь APK — кнопка станет рабочей сама

В `app/index.html`:
- Поправь `<title>` если хочешь другое имя в заголовке окна
- В нижней части документа можно добавить watermark «DEMO — купить за 1990 ₽» (если этот файл лежит в `/app/`, а полную версию ты продаёшь отдельно)

## Обновления

1. Меняешь файлы → `git push` → GitHub Pages обновляется автоматически через 1–2 мин.
2. **Важно для PWA:** при изменении `app/index.html` или других кэшируемых файлов **поменяй `CACHE_NAME` в `sw.js`** (например, `smeta-pro-v1` → `smeta-pro-v2`). Иначе у уже установивших приложение клиентов будет старая версия из кэша.

## Тест локально (без интернета)

ZIP `smeta-pro-win.zip` уже содержит готовое приложение с launcher.bat — можно проверить.
Для теста лендинга и сайта целиком — открой `index.html` двойным кликом
(некоторые функции PWA при этом не работают, нужен http-сервер; для лендинга это неважно).

Простейший локальный сервер (если установлен Python):
```bash
cd site
python -m http.server 8000
```
Открой `http://localhost:8000/`.
