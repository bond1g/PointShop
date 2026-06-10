# wShop

Интернет-магазин одежды: каталог с фильтрами (тип, бренд, цена), сортировка,
размеры товаров с учётом остатков на складе, корзина, оформление заказа,
онлайн-оплата (ЮKassa), промокоды и админ-панель.

## Стек

- **Клиент**: React 17, MobX, React Router, Bootstrap 5
- **Сервер**: Node.js, Express 5, Sequelize 6, PostgreSQL
- **Прочее**: JWT-аутентификация, Nodemailer (письма о заказах), ЮKassa SDK

## Структура

```
client/   — React-приложение
server/   — Express API + Sequelize модели
```

## Запуск локально

### 1. База данных

Создайте базу PostgreSQL (по умолчанию `wShop`).

### 2. Сервер

```bash
cd server
npm install
cp .env.example .env   # заполните своими значениями
npm run dev
```

Переменные окружения сервера (`server/.env`):

| Переменная | Описание |
|---|---|
| `PORT` | Порт API (по умолчанию 5000) |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` | Подключение к PostgreSQL |
| `SECRET_KEY` | Секрет для подписи JWT |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP для писем о заказах |
| `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` | Онлайн-оплата ЮKassa |
| `FRONTEND_URL` | URL фронтенда (для редиректов/CORS) |

При первом запуске Sequelize сам создаст все таблицы (`sequelize.sync()`).

### 3. Клиент

```bash
cd client
npm install
cp .env.example .env   # укажите REACT_APP_API_URL = адрес сервера
npm start
```

## Деплой (Render + Neon + Vercel)

Бесплатная связка: база данных на **Neon**, бэкенд на **Render**, фронтенд на **Vercel**.

> ⚠️ Render Free План усыпляет сервис после 15 минут бездействия (первый запрос после
> "сна" может идти ~30-60 сек), а файловая система не персистентна — загруженные через
> админку фото товаров пропадут при следующем редеплое/перезапуске.

### 1. База данных — Neon

1. Зарегистрируйтесь на [neon.tech](https://neon.tech) и создайте проект/базу.
2. В консоли Neon найдите данные подключения (Connection details): host, database,
   user, password, port (обычно `5432`).
3. Эти значения понадобятся для переменных окружения сервера на Render (см. ниже).

### 2. Сервер — Render

1. Зарегистрируйтесь на [render.com](https://render.com), New → Web Service,
   подключите репозиторий `bond1g/PointShop`.
2. Настройки сервиса:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Добавьте переменные окружения (Environment → Add Environment Variable),
   взяв значения из `.env.example` и данных Neon:

   | Переменная | Значение |
   |---|---|
   | `PORT` | `10000` (Render сам подставит свой `PORT`, но переменную можно оставить) |
   | `DB_NAME` | имя базы из Neon |
   | `DB_USER` | пользователь из Neon |
   | `DB_PASSWORD` | пароль из Neon |
   | `DB_HOST` | хост из Neon (например `ep-xxx.us-east-2.aws.neon.tech`) |
   | `DB_PORT` | `5432` |
   | `DB_SSL` | `true` (Neon требует SSL-подключение) |
   | `SECRET_KEY` | свой случайный секрет для JWT |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | данные вашей почты |
   | `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` | данные ЮKassa |
   | `FRONTEND_URL` | URL вашего сайта на Vercel (после деплоя клиента) |

4. После деплоя сервер будет доступен по адресу вида
   `https://your-service.onrender.com`. Таблицы создадутся автоматически
   при первом запуске (`sequelize.sync()`).

### 3. Клиент — Vercel

1. Зарегистрируйтесь на [vercel.com](https://vercel.com), New Project,
   подключите репозиторий `bond1g/PointShop`.
2. Настройки проекта:
   - **Root Directory**: `client`
   - **Framework Preset**: Create React App
3. Добавьте переменную окружения:

   | Переменная | Значение |
   |---|---|
   | `REACT_APP_API_URL` | URL сервера на Render, например `https://your-service.onrender.com` |

4. После деплоя обновите `FRONTEND_URL` в настройках сервера на Render
   на полученный адрес `https://your-app.vercel.app`.

### Заметки

- Файлы `.env` не попадают в git — все секреты задаются только в панели хостинга.
- При желании в будущем можно подключить Cloudinary для постоянного хранения
  изображений товаров (чтобы они не терялись при редеплое сервера).
