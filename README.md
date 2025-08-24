# to-do-app
This a full stack To-Do Application
<br>
A complete todo web application with PostgreSQL database, Flask backend API, and vanilla JavaScript frontend, fully containerized with Docker.
<br>
## 🏗️ Architecture
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Python Flask REST API
- **Database:** PostgreSQL
- **Containerization:** Docker
## 📁 Project Structure
```
todo-app/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Backend container config
│   └── .env               # Database configuration
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styles
│   ├── script.js           # Frontend logic
│   └── Dockerfile          # Frontend container config
├── database/
│   └── init.sql           # Database schema
└── docker-compose.yml      # Multi-container setup
```
## 🚀 Quick Start with Docker (Recommended)

### 1. Clone and setup
```bash
git clone <your-repo-url>
cd todo-app
```

### 2. Start all services
```bash
docker-compose up --build
```
### 3. Access the application
- **Frontend:** http://localhost
- **Backend API:** http://localhost:5000/tasks
- **Database:** localhost:5432 (use pgAdmin)

## 🔧 Manual Setup (Development)

### 1. PostgreSQL Setup
```bash
# Install PostgreSQL and create database
# Database name: todo_app
# Username: postgres  
# Password: 123Pass.in

# Or use Docker for just PostgreSQL:
docker run --name postgres -e POSTGRES_DB=todo_app -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres:13
```
### 2. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend
python app.py
```

### 3. Frontend Setup
```bash
cd frontend

# Run local server
python -m http.server 8000

# Access: http://localhost:8000
```

## 🐛 Common Issues & Solutions

### 1. JSON Syntax Error in PowerShell
**Problem:** `curl` commands fail with JSON parsing errors
**Solution:** Use PowerShell's `Invoke-RestMethod`:
```powershell
# Create task
Invoke-RestMethod -Uri "http://localhost:5000/tasks" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"title": "Test", "description": "Test task"}'

# Complete task
Invoke-RestMethod -Uri "http://localhost:5000/tasks/1/complete" -Method Post

# Get tasks
Invoke-RestMethod -Uri "http://localhost:5000/tasks" -Method Get
```

### 2. CORS Errors (Frontend can't connect to backend)
**Solution:** Install flask-cors and update app.py:
```bash
cd backend
pip install flask-cors
```

Add to `backend/app.py`:
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Add this line after creating app
```

### 3. Database Connection Issues
**Solution:** Check/create `backend/.env` file:
```ini
DB_HOST=localhost
DB_NAME=todo_app
DB_USER=postgres
DB_PASSWORD=root
```

### 4. Docker Build Issues
```bash
# Remove all containers and rebuild
docker-compose down -v
docker-compose up --build

# Check logs for errors
docker-compose logs
```

### 5. Port Already in Use
**Solution:** Stop other services or change ports in `docker-compose.yml`

## 🧪 Testing Commands

### Test Backend API:
```powershell
# Get all tasks
Invoke-RestMethod -Uri "http://localhost:5000/tasks" -Method Get

# Create task
Invoke-RestMethod -Uri "http://localhost:5000/tasks" -Method Post -Headers @{"Content-Type"="application/json"} -Body '{"title": "Test Task", "description": "Test Description"}'

# Complete task (replace 1 with actual ID)
Invoke-RestMethod -Uri "http://localhost:5000/tasks/1/complete" -Method Post
```

### Test Database:
```bash
# Connect to database
docker-compose exec db psql -U postgres -d todo_app

# Run SQL queries
SELECT * FROM task;
SELECT * FROM task WHERE completed = true;
SELECT * FROM task WHERE completed = false;
```

## 📊 API Endpoints
- `GET /tasks` - Get all incomplete tasks (max 5)
- `POST /tasks` - Create new task
- `POST /tasks/:id/complete` - Mark task as complete

## 🗄️ Database Schema
```sql
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 Environment Variables
Create `backend/.env`:
```ini
DB_HOST=localhost
DB_NAME=todo_app
DB_USER=postgres
DB_PASSWORD=root
```

## 🐳 Docker Commands Cheat Sheet

```bash
# Build and start all containers
docker-compose up --build

# Stop containers
docker-compose down

# Stop and remove everything (including data)
docker-compose down -v

# Check running containers
docker ps

# View logs
docker-compose logs backend
docker-compose logs db
docker-compose logs frontend

# Run specific service
docker-compose up --build backend

# Execute command in container
docker-compose exec db psql -U postgres -d todo_app
```

## 🔄 Development Workflow
1. Make code changes
2. Test locally without Docker first
3. Rebuild Docker containers if needed: `docker-compose up --build`
4. Test API endpoints
5. Verify database changes in pgAdmin


