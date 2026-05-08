# Inventory Management System

## Tech Stack
- Frontend: React 18
- Backend: Node.js + Express
- Database: MySQL (via phpMyAdmin / XAMPP)

---

## Setup Instructions

### 1. Database (phpMyAdmin)
1. Open http://localhost/phpmyadmin
2. Create database: `inventory_db`
3. Run the SQL from `server/database.sql` in the SQL tab

### 2. Backend
```bash
cd server
npm install
# Edit .env with your DB password if needed
npm run dev
```
Server runs at: http://localhost:5000

### 3. Frontend
```bash
cd client
npm install
npm start
```
App runs at: http://localhost:3000

---

## Project Structure

```
inventory-app/
├── server/
│   ├── routes/
│   │   ├── products.js     ← CRUD + barcode + low stock alert
│   │   ├── suppliers.js    ← CRUD
│   │   └── logs.js         ← Stock in/out with transactions
│   ├── db.js               ← MySQL connection pool
│   ├── index.js            ← Express entry point
│   └── .env                ← DB credentials
└── client/
    └── src/
        ├── pages/
        │   ├── Products.jsx  ← Products table + stock in/out modals
        │   ├── Suppliers.jsx ← Supplier cards
        │   └── Logs.jsx      ← Stock movement history
        ├── components/
        │   └── Modal.jsx     ← Reusable modal
        └── App.jsx           ← Routing + navbar
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List all products |
| POST | /api/products | Add product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/barcode/:code | Lookup by barcode |
| GET | /api/products/alerts/low-stock | Low stock list |
| GET | /api/suppliers | List all suppliers |
| POST | /api/suppliers | Add supplier |
| PUT | /api/suppliers/:id | Update supplier |
| DELETE | /api/suppliers/:id | Delete supplier |
| GET | /api/logs | All stock logs |
| POST | /api/logs/in | Stock in |
| POST | /api/logs/out | Stock out |
