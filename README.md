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

## Деплой

- Сервер можно развернуть на любом хостинге с Node.js + PostgreSQL (Render, Railway, VPS и т.д.)
- Клиент собирается командой `npm run build` в папке `client` и раздаётся как статика
  (Vercel, Netlify, Nginx и т.д.)
- Не забудьте указать актуальные `REACT_APP_API_URL` (клиент) и `FRONTEND_URL` (сервер)
  для продакшен-доменов, а также прописать реальные секреты в `.env` на сервере хостинга
  (файлы `.env` не попадают в git).
