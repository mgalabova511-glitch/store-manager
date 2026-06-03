# 🛒 Store Manager

Уеб приложение за управление на продукти с REST API backend и HTML/CSS/JS frontend.
Поддържа пълен CRUD – преглед, добавяне, редакция и изтриване на продукти,
съхранявани в MySQL база данни.

---

## Структура на проекта

```
store-manager/
├── backend.js       # Express REST API сървър
├── database.sql     # SQL схема и тестови данни
├── index.html       # Frontend интерфейс
├── script.js        # JavaScript логика (Fetch API)
├── style.css        # CSS стилове
├── package.json     # Node.js зависимости
└── README.md        # Този файл
```

---

## Изисквания

- Node.js 18+
- MySQL (XAMPP, WAMP или самостоятелна инсталация)

---

## Инсталация и стартиране

**1. Инсталирайте зависимостите:**
```bash
npm install
```

**2. Създайте базата данни** – отворете MySQL и изпълнете:
```bash
mysql -u root -p < database.sql
```
или отворете `database.sql` в phpMyAdmin и го изпълнете.

**3. Конфигурирайте връзката с DB** в `backend.js`:
```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',        // вашата парола
    database: 'store_db'
});
```

**4. Стартирайте сървъра:**
```bash
node backend.js
```

**5. Отворете `index.html`** в браузър – директно или през Live Server.

> Сървърът работи на **http://localhost:3000**

---

## REST API маршрути

| Метод    | Маршрут           | Описание                          |
|----------|-------------------|-----------------------------------|
| `GET`    | `/products`       | Всички продукти                   |
| `GET`    | `/products?limit=5` | С лимит на резултатите          |
| `GET`    | `/products/:id`   | Един продукт по ID                |
| `POST`   | `/products`       | Създаване на нов продукт          |
| `PUT`    | `/products/:id`   | Редакция на продукт               |
| `DELETE` | `/products/:id`   | Изтриване на продукт              |

**POST / PUT – очакван JSON body:**
```json
{
  "title": "Smart Watch",
  "price": 199.99,
  "description": "Описание на продукта",
  "category": "Electronics",
  "image": "https://placehold.co/600x400"
}
```

**HTTP статус кодове:**

| Код | Значение                        |
|-----|---------------------------------|
| 200 | Успех                           |
| 201 | Успешно създаден                |
| 400 | Невалидни данни (липсва title/price) |
| 404 | Продуктът не е намерен          |
| 500 | Грешка в базата данни           |

---

## База данни

Таблица `products` в база `store_db`:

| Поле          | Тип              | Описание                            |
|---------------|------------------|-------------------------------------|
| `id`          | INT AUTO_INCREMENT PK | Уникален идентификатор         |
| `title`       | VARCHAR(255) NOT NULL | Заглавие на продукта           |
| `price`       | DECIMAL(10,2) NOT NULL | Цена                          |
| `description` | TEXT             | Описание                            |
| `category`    | VARCHAR(100)     | Категория                           |
| `image`       | VARCHAR(255)     | URL на снимка (default placeholder) |

---

## Технологии

| Технология  | Версия   | Роля                          |
|-------------|----------|-------------------------------|
| Node.js     | 18+      | Runtime среда                 |
| Express     | 5.2.1    | REST API сървър               |
| mysql2      | 3.16.1   | Връзка с MySQL                |
| cors        | 2.8.6    | Cross-origin заявки           |
| body-parser | 2.2.2    | Парсване на JSON заявки       |
| HTML/CSS/JS | –        | Frontend интерфейс            |
