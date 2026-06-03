const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Позволява на frontend-а да "вижда" сървъра
app.use(bodyParser.json());

// Връзка с базата данни
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Твоят MySQL user
    password: '',      // Твоята парола (остави празно, ако нямаш)
    database: 'store_db'
});

db.connect(err => {
    if (err) {
        console.error('Грешка при свързване с DB:', err);
    } else {
        console.log('Успешна връзка с MySQL базата данни!');
    }
});

// --- API ROUTES (Според изискванията на заданието) ---

// 1. GET /products - Взима всички записи (с опция за limit) [cite: 85, 87]
app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    const limit = parseInt(req.query.limit);

    if (limit) {
        sql += ` LIMIT ${limit}`; // Реализация на изискването за лимит [cite: 110]
    }

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "DB error" });
        }
        res.json(results);
    });
});

// 2. GET /products/:id - Взима един запис [cite: 88]
app.get('/products/:id', (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found" }); // Изискване за 404 [cite: 90, 105]
        }
        res.json(results[0]);
    });
});

// 3. POST /products - Създава нов запис [cite: 91]
app.post('/products', (req, res) => {
    const { title, price, description, category, image } = req.body;

    // Валидация [cite: 94]
    if (!title || !price) {
        return res.status(400).json({ error: "Invalid body. Title and Price are required." });
    }

    const sql = 'INSERT INTO products (title, price, description, category, image) VALUES (?, ?, ?, ?, ?)';
    // Ако няма картинка, слагаме default
    const imgUrl = image || 'https://placehold.co/600x400';
    
    db.query(sql, [title, price, description, category, imgUrl], (err, result) => {
        if (err) return res.status(500).json({ error: "DB error" });
        
        res.status(201).json({ id: result.insertId, title, price }); // Статус 201 Created [cite: 105]
    });
});

// 4. PUT /products/:id - Редакция [cite: 95]
app.put('/products/:id', (req, res) => {
    const { title, price, description, category } = req.body;
    const id = req.params.id;

    // Първо проверяваме дали съществува
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (results.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        const sql = 'UPDATE products SET title = ?, price = ?, description = ?, category = ? WHERE id = ?';
        db.query(sql, [title, price, description, category, id], (err, result) => {
            if (err) return res.status(500).json({ error: "DB error" });
            res.json({ message: "Updated successfully" });
        });
    });
});

// 5. DELETE /products/:id - Изтриване [cite: 99]
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: "DB error" });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" }); // [cite: 102]
        }
        res.json({ message: "Deleted successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});