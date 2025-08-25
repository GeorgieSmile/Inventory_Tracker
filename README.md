# Inventory & Sales – Dockerized (MySQL + FastAPI + Vite)

This project is a **simple inventory and sales management system**.

It uses:
- **MySQL 8.4** for the database  
- **FastAPI** (`app_api`) as the backend API (Python 3.13)  
- **Vite + React** (`react_app`) as the frontend  

---

## Architecture

```text
[ MySQL Database ] <----> [ FastAPI Backend ] <----> [ React Frontend (Vite) ]
       (db)                      (api)                         (web)
```

- Database stores products, categories, sales, and reports  
- API provides endpoints for CRUD operations and reporting  
- Frontend offers a UI for managing inventory and sales  

---

## How to run

1. From the project root, build and start containers:
   ```bash
   docker compose up -d --build
   ```

2. Open in your browser:
   - **Frontend (React):** [http://localhost:5173](http://localhost:5173)  
   - **Backend API (FastAPI docs):** [http://localhost:8000/docs](http://localhost:8000/docs)  

3. Stop everything:
   ```bash
   docker compose down
   ```

---

## Project overview
- The backend exposes endpoints for products, categories, sales, reports, etc.  
- The frontend provides a simple interface to view stock, sales, and profitability.  
- Database connection is configured via environment variables in `docker-compose.yml`.  
- During development, the frontend calls the API directly at `http://localhost:8000` (CORS enabled).  
