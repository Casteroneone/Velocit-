const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MySQL
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(function(err) {
    if (err) throw err;
    console.log(`Connected to database: ${process.env.DB_NAME}`);
});

app.use(express.static(path.join(__dirname, '../sec3_gr2_fe_src')));

// ── Convert Google Drive uc?id= URL to embeddable thumbnail URL ──
function fixDriveUrl(url) {
    if (!url) return null;
    // Already in correct format
    if (url.includes('thumbnail?id=')) return url;
    // Extract the file ID and reformat
    const match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    }
    return url;
}

// ── Root & Health ──────────────────────────────────────────
// Testing... GET / → serves the homepage HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../sec3_gr2_fe_src/Homepage/index.html'));
});

// Testing... GET /health → checks database connection status
app.get('/health', (req, res) => {
    db.ping((err) => {
        if (err) return res.json({ status: 'error', database: err.message });
        res.json({ status: 'ok', database: 'connected' });
    });
});

// ===========================================================
//  ADMIN ROUTES
// ===========================================================

const ADMIN_SELECT = `
    SELECT l.admin_id, l.username, l.email,
           i.first_name, i.last_name, i.role,
           i.date_of_birth, i.address
    FROM admin_login l
    LEFT JOIN admin_info i ON l.admin_id = i.admin_id
`;

// Testing... POST /api/admin/login → body: { username, password } → returns admin object or 401
// Testing... POST /api/admin/login → missing fields → returns 400 Bad Request
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = ADMIN_SELECT + ` WHERE (l.username = ? OR l.email = ?) AND l.password = ?`;
    db.query(sql, [username, username, password], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const admin = results[0];
        if (admin.date_of_birth) admin.date_of_birth = String(admin.date_of_birth);
        return res.json(admin);
    });
});

// Testing... GET /api/admin/:id → returns admin info for given admin_id
// Testing... GET /api/admin/999 → returns 404 if admin not found
app.get('/api/admin/:id', (req, res) => {
    const sql = ADMIN_SELECT + ' WHERE l.admin_id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Admin not found' });
        const admin = results[0];
        if (admin.date_of_birth) admin.date_of_birth = String(admin.date_of_birth);
        return res.json(admin);
    });
});

// Testing... PUT /api/admin/:id → body: { first_name, last_name, role, date_of_birth, address } → updates admin
// Testing... PUT /api/admin/:id → empty body → returns 400 No fields to update
app.put('/api/admin/:id', (req, res) => {
    const allowedFields = ['first_name', 'last_name', 'role', 'date_of_birth', 'address'];
    const data = {};
    for (const key of allowedFields) {
        if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(data), req.params.id];

    db.query(`UPDATE admin_info SET ${setClause} WHERE admin_id = ?`, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Admin not found' });

        db.query(ADMIN_SELECT + ' WHERE l.admin_id = ?', [req.params.id], (err2, rows) => {
            if (err2) return res.status(500).json({ error: err2.message });
            const admin = rows[0];
            if (admin && admin.date_of_birth) admin.date_of_birth = String(admin.date_of_birth);
            return res.json(admin);
        });
    });
});

// Testing... DELETE /api/admin/:id → removes admin from both admin_info and admin_login tables
// Testing... DELETE /api/admin/999 → returns 404 if admin not found
app.delete('/api/admin/:id', (req, res) => {
    db.query('DELETE FROM admin_info WHERE admin_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query('DELETE FROM admin_login WHERE admin_id = ?', [req.params.id], (err2, result) => {
            if (err2) return res.status(500).json({ error: err2.message });
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Admin not found' });
            return res.json({ message: 'Deleted', admin_id: parseInt(req.params.id) });
        });
    });
});

// ===========================================================
//  CAR ROUTES
// ===========================================================

// Testing... GET /api/cars → returns all cars with image URLs from DB
// Testing... GET /api/cars → verify image_url is a valid Google Drive thumbnail URL
app.get('/api/cars', (req, res) => {
    const sql = `
        SELECT c.*, i.url AS image_url, i.description AS image_description
        FROM car c
        LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
        ORDER BY c.vehicle_id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        results.forEach(r => { r.image_url = fixDriveUrl(r.image_url); });
        return res.json(results);
    });
});

// ── GET /api/cars/fix-image-urls ───────────────────────────
// Visit http://localhost:3030/api/cars/fix-image-urls once to fix all URLs in DB
app.get('/api/cars/fix-image-urls', (req, res) => {
    const sql = `
        UPDATE image
        SET url = CONCAT('https://drive.google.com/thumbnail?id=', SUBSTRING_INDEX(url, 'id=', -1), '&sz=w400')
        WHERE url LIKE '%drive.google.com/uc?id=%'
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({
            message: 'Image URLs fixed successfully',
            rowsUpdated: result.affectedRows
        });
    });
});

// Testing... GET /api/cars/search?brand=Ferrari&status=Available → returns only available Ferrari cars
// Testing... GET /api/cars/search?transmission=Auto&seats=4 → filters by multiple params simultaneously
// Query params: brand, model, transmission, seats, doors, status
// Must be placed BEFORE /api/cars/:id route
app.get('/api/cars/search', (req, res) => {
    const { brand, model, transmission, seats, doors, status } = req.query;

    const conditions = [];
    const values     = [];

    if (brand && brand !== 'all') {
        conditions.push('c.car_brands = ?');
        values.push(brand);
    }
    if (model && model.trim() !== '') {
        conditions.push('c.car_model LIKE ?');
        values.push(`%${model.trim()}%`);
    }
    if (transmission) {
        conditions.push('c.transmission = ?');
        values.push(transmission);
    }
    if (seats) {
        conditions.push('c.seats = ?');
        values.push(parseInt(seats));
    }
    if (doors) {
        conditions.push('c.doors = ?');
        values.push(parseInt(doors));
    }
    if (status) {
        conditions.push('c.status = ?');
        values.push(status);
    }

    const whereClause = conditions.length > 0
        ? 'WHERE ' + conditions.join(' AND ')
        : '';

    const sql = `
        SELECT c.*, i.url AS image_url, i.description AS image_description
        FROM car c
        LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
        ${whereClause}
        ORDER BY c.car_brands, c.car_model
    `;

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        results.forEach(r => { r.image_url = fixDriveUrl(r.image_url); });
        return res.json(results);
    });
});

// Testing... GET /api/cars/:id → returns single car object with image URL
// Testing... GET /api/cars/999 → returns 404 if vehicle not found
app.get('/api/cars/:id', (req, res) => {
    const sql = `
        SELECT c.*, i.url AS image_url, i.description AS image_description
        FROM car c
        LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
        WHERE c.vehicle_id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Car not found' });
        const car = results[0];
        car.image_url = fixDriveUrl(car.image_url);
        return res.json(car);
    });
});

// Testing... POST /api/cars → body with all required fields → creates new car and returns it
// Testing... POST /api/cars → missing required field (e.g. license_plate) → returns 400 Missing required fields
app.post('/api/cars', (req, res) => {
    const { car_brands, car_model, year, daily_price, license_plate,
            details, transmission, seats, doors, status } = req.body;

    if (!car_brands || !car_model || !year || !daily_price || !license_plate
        || !transmission || !seats || !doors || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = `
        INSERT INTO car (license_plate, daily_price, year, doors, seats, status,
                         transmission, car_model, car_brands, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [license_plate, daily_price, year, doors, seats,
                    status, transmission, car_model, car_brands, details || ''];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const innerSql = `
            SELECT c.*, i.url AS image_url, i.description AS image_description
            FROM car c
            LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
            WHERE c.vehicle_id = ?
        `;
        db.query(innerSql, [result.insertId], (err2, rows) => {
            if (err2) return res.status(500).json({ error: err2.message });
            const car = rows[0];
            if (car) car.image_url = fixDriveUrl(car.image_url);
            return res.status(201).json(car);
        });
    });
});

// Testing... PUT /api/cars/:id → body: { status: 'Maintenance' } → updates car status
// Testing... PUT /api/cars/:id → empty body → returns 400 No fields to update
app.put('/api/cars/:id', (req, res) => {
    const allowed = ['car_brands', 'car_model', 'year', 'daily_price',
                     'license_plate', 'details', 'transmission', 'seats', 'doors', 'status'];
    const data = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) data[key] = req.body[key];
    }

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = Object.keys(data).map(k => `${k} = ?`).join(', ');
    const values    = [...Object.values(data), req.params.id];

    db.query(`UPDATE car SET ${setClause} WHERE vehicle_id = ?`, values, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Car not found' });

        const innerSql = `
            SELECT c.*, i.url AS image_url, i.description AS image_description
            FROM car c
            LEFT JOIN image i ON c.vehicle_id = i.vehicle_id
            WHERE c.vehicle_id = ?
        `;
        db.query(innerSql, [req.params.id], (err2, rows) => {
            if (err2) return res.status(500).json({ error: err2.message });
            const car = rows[0];
            if (car) car.image_url = fixDriveUrl(car.image_url);
            return res.json(car);
        });
    });
});

// Testing... DELETE /api/cars/:id → removes car from database and returns confirmation
// Testing... DELETE /api/cars/999 → returns 404 if vehicle not found
app.delete('/api/cars/:id', (req, res) => {
    db.query('DELETE FROM car WHERE vehicle_id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Car not found' });
        return res.json({ message: 'Deleted', vehicle_id: parseInt(req.params.id) });
    });
});

// ===========================================================
//  START SERVER
// ===========================================================
const PORT = process.env.PORT || 3030;
app.listen(PORT, function() {
    console.log(`Velocita API running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});