# Velocità – Luxury Car Rental Web Application

A full-stack luxury car rental platform built with **Node.js / Express** (backend) and **Vanilla HTML/CSS/JS** (frontend), connected to a **MySQL** database.

The frontend and backend run on **separate web servers**:
- **Frontend server** → `http://localhost:3000`
- **Backend API server** → `http://localhost:3030`

---

## Features

### Public Pages
- **Homepage** — Brand overview, embedded Google Maps location, animated hero section
- **Car Fleets (by brand)** — Browse all cars for a selected brand with status badges (Available / Rented / Maintenance)
- **Car Detail** — Full car specs, live currency conversion (THB → USD / EUR / GBP / JPY) via [fawazahmed0/currency-api](https://github.com/fawazahmed0/exchange-api)
- **Search** — Filter cars by brand, model, transmission, seats, doors, and status
- **Our Team** — Team member profiles

### Admin Pages (login required)
- **Login** — Admin authentication with password visibility toggle and Forgot Password popup
- **Fleets Management** — Add, edit, and delete cars from the fleet with status management
- **Admin Profile** — View admin info with one-click ID copy
- **Admin Edit** — Edit admin profile details (name, role, date of birth, address)

---

## Project Structure

```
Velocit-/
├── sec3_gr2_fe_src/          # Frontend source (HTML, CSS, JS pages)
│   ├── Homepage/
│   ├── Searchpage/
│   ├── CarFleets/            # Brand listing + car detail pages
│   ├── Team/
│   ├── Loginpage/
│   ├── Adminpage/
│   ├── Admin_edit/
│   ├── Fleets/               # Fleets management (admin only)
│   ├── global.css
│   ├── nav.js
│   ├── server.js             # Frontend web server (port 3000)
│   └── package.json
├── sec3_gr2_ws_src/          # Backend web service source
│   ├── back.js               # Express API server (port 3030)
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

## 2. Backend Setup (Web Service Server — port 3030)

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
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=velocita_db
PORT=3030
```

Start the backend server:
```bash
npm start
```

The API will be available at: `http://localhost:3030`  
Health check: `http://localhost:3030/health`

---

## 3. Frontend Setup (Frontend Server — port 3000)

```bash
# Open a NEW terminal tab, go to the frontend folder
cd sec3_gr2_fe_src

# Install dependencies
npm install

# Start the frontend server
npm start
```

Open your browser and go to: `http://localhost:3000`

> **Note:** Both servers must be running at the same time. Start the backend first, then the frontend.

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
| GET | `/api/cars/search` | Search/filter cars (params: `brand`, `model`, `transmission`, `seats`, `doors`, `status`) |
| GET | `/api/cars/:id` | Get car by ID |
| POST | `/api/cars` | Add new car |
| PUT | `/api/cars/:id` | Update car |
| DELETE | `/api/cars/:id` | Delete car |

---

## 5. External Services Used

| Service | Purpose |
|---------|---------|
| [fawazahmed0/currency-api](https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/) | Live THB exchange rates on car detail page |
| [Google Maps Embed](https://maps.google.com) | Location map on homepage |
| [Google Fonts](https://fonts.google.com) | Montagu Slab & Inter typefaces |

---

## 6. Our Team

| Name | Student ID |
|------|------------|
| Traiwit Channgam | 6788015 |
| Tinna Mongkolsaomoke | 6788063 |
| Woraneti Phicharana | 6788087 |
| Madhuri Singh | 6788106 |
