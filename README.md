# Velocità – Luxury Car Rental Web Application

A full-stack luxury car rental platform built with **Node.js / Express** (backend) and **Vanilla HTML/CSS/JS** (frontend), connected to a **MySQL** database.

---

## Project Structure

```
Velocit-/
├── sec3_gr2_fe_src/          # Frontend source (HTML, CSS, JS pages)
│   ├── Homepage/
│   ├── Searchpage/
│   ├── CarFleets/
│   ├── Team/
│   ├── Loginpage/
│   ├── Adminpage/
│   ├── Admin_edit/
│   ├── Fleets/
│   ├── global.css
│   └── nav.js
├── sec3_gr2_ws_src/          # Backend web service source
│   ├── back.js               # Express API server
│   ├── package.json
│   └── .env.example          # Rename to .env and fill in your credentials
└── sec3_gr2_database.sql     # MySQL database schema + seed data
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- [MySQL](https://www.mysql.com/) 8.x
- A terminal (PowerShell, CMD, or Bash)

---

## 1. Database Setup

1. Open MySQL Workbench (or your preferred MySQL client).
2. Import the SQL file (it creates the database automatically):
   ```bash
   mysql -u root -p < sec3_gr2_database.sql
   ```
   Or import via MySQL Workbench: **Server → Data Import → Import from Self-Contained File** → select `sec3_gr2_database.sql`.

---

## 2. Backend Setup (Web Service)

```bash
# Go to the web service folder
cd sec3_gr2_ws_src

# Install dependencies
npm install

# Copy the example env file and fill in your DB credentials
copy .env.example .env     # Windows
# cp .env.example .env     # Mac/Linux
```

Edit `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=velocita_db
PORT=3030
```

Start the server:
```bash
node back.js
```

The API will be available at: `http://localhost:3030`  
Health check: `http://localhost:3030/health`

---

## 3. Frontend Setup

The frontend is purely static HTML/CSS/JS — no build step required.

Open `sec3_gr2_fe_src/Homepage/index.html` in your browser, **or** let the backend serve it:

```bash
# The backend already serves static files from the frontend folder
# Just run the backend and visit:
http://localhost:3030
```

---

## 4. API Endpoints

### Admin Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login (body: `{ username, password }`) |
| GET | `/api/admin/:id` | Get admin by ID |
| PUT | `/api/admin/:id` | Update admin info |
| DELETE | `/api/admin/:id` | Delete admin |

### Car Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cars` | Get all cars |
| GET | `/api/cars/search` | Search cars (params: brand, model, transmission, seats, doors, status) |
| GET | `/api/cars/:id` | Get car by ID |
| POST | `/api/cars` | Add new car |
| PUT | `/api/cars/:id` | Update car |
| DELETE | `/api/cars/:id` | Delete car |

---

## 5. Team

| Name | Student ID |
|------|------------|
| Tinna M. | 6788063 |
| Woraneti P. | 6788087 |
| Traiwit C. | 6788015 |
| Madhuri S. | 6788106 |
