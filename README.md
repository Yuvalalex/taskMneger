# 🎯 Task Manager - Pro Edition

**Task Manager** is a high-performance Full-Stack application for intelligent task and time management, built with React, FastAPI, and MongoDB.



---

## 🚀 Features

- **Smart Task Management:** Distinguish between actionable tasks and events with rich metadata (priority, subtasks, descriptions, attachments)
- **Advanced Visualization:** Timeline, Eisenhower Matrix, Monthly Calendar, Year Heatmap, Responsibility Tree
- **Drag & Drop:** Rearrange tasks between views, priorities, and assignees via drag & drop
- **File Attachments:** Persistent storage for task-related files and documents
- **Secure Authentication:** JWT-based authentication with bcrypt password hashing and input validation
- **Real-time UX:** Toast notifications, loading spinners, and disabled buttons to prevent double-clicks
- **Containerized:** Fully dockerized with docker-compose for one-command deployment
- **Modular Backend:** Clean architecture with separated routers, models, auth, and database modules
- **Code Quality:** ESLint, Prettier, Black, Flake8 for consistent code standards
- **CI/CD Pipeline:** Automated testing, linting, and building with GitHub Actions

---

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Hooks, Axios, React Icons |
| **Backend** | Python 3.9, FastAPI, Uvicorn, Pydantic |
| **Database** | MongoDB 7.0, Motor (async driver) |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Testing** | Pytest, Jest, React Testing Library |
| **Linting** | ESLint (Airbnb), Prettier, Black, Flake8 |
| **Security** | JWT, Bcrypt, Non-root containers, Health checks |

---

## 📦 Project Structure

```
taskMneger/
├── .github/
│   └── workflows/
│       └── ci-cd.yml                  # GitHub Actions CI/CD pipeline
├── client/                            # React Frontend
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── Auth.js                # Login/Register with validation
│   │   │   ├── Sidebar.js             # Navigation & list management
│   │   │   ├── TaskModal.js           # Task editing modal
│   │   │   └── views/                 # View layouts
│   │   │       ├── ListView.js
│   │   │       ├── MatrixView.js      # Eisenhower Matrix
│   │   │       ├── MonthView.js       # Monthly calendar
│   │   │       ├── TimelineView.js    # Daily timeline
│   │   │       ├── YearView.js        # Year heatmap
│   │   │       ├── ResponsibilityView.js  # Team assignments
│   │   │       └── SettingsView.js
│   │   ├── App.js                     # Main component & state management
│   │   ├── App.css                    # Complete design system
│   │   └── utils.js                   # Utility functions
│   ├── Dockerfile                     # Multi-stage Docker build
│   └── package.json                   # Dependencies + scripts
├── server/                            # Python FastAPI Backend
│   ├── main.py                        # App entrypoint & middleware
│   ├── auth.py                        # JWT authentication & password hashing
│   ├── database.py                    # MongoDB connection management
│   ├── models.py                      # Pydantic data models
│   ├── routers/                       # API route modules
│   │   ├── auth_router.py             # /register, /token, /users
│   │   ├── tasks_router.py            # /tasks CRUD operations
│   │   ├── lists_router.py            # /lists CRUD operations
│   │   └── uploads_router.py          # /upload file handling
│   ├── requirements.txt               # Python dependencies
│   └── Dockerfile                     # Secure Docker build
├── docker-compose.yml                 # Multi-container orchestration
├── .env.example                       # Environment variables template
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR: Node.js 18+, Python 3.9+, MongoDB 7.0

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/Yuvalalex/taskMneger.git
cd taskMneger

# Create environment file
cp .env.example .env

# Build and run all services
docker-compose up --build -d

# Access application
# Frontend:     http://localhost:3000
# Backend API:  http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Edit .env with your configuration
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd client
npm install
npm start                       # Runs on http://localhost:3000
```

---

## 🧪 Testing

### Backend Tests
```bash
cd server
pytest                                    # Run all tests
pytest --cov=. --cov-report=html          # With coverage report
```

### Frontend Tests
```bash
cd client
npm test                                  # Run all tests
npm test -- --coverage --watchAll=false    # With coverage
```

### Using Docker
```bash
docker-compose exec server pytest
docker-compose exec client npm test
```

---

## 📝 Code Quality

```bash
# Backend - Format & Lint
cd server && black . && flake8 .

# Frontend - Format & Lint
cd client && npm run format && npm run lint:fix
```

---

## 🔄 CI/CD Pipeline

This project includes a comprehensive GitHub Actions pipeline:

- ✅ Lints Python code (Black, Flake8)
- ✅ Runs backend tests with coverage
- ✅ Lints JavaScript code (ESLint Airbnb)
- ✅ Checks code formatting (Prettier)
- ✅ Runs frontend tests with coverage
- ✅ Builds Docker images
- ✅ Scans for security vulnerabilities (Trivy)

**View workflow:** [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

---

## 🔐 Security

| Feature | Details |
|---------|---------|
| **Authentication** | JWT tokens with configurable expiration |
| **Password Security** | Bcrypt hashing (never stored in plain text) |
| **Authorization** | Ownership checks on all task/list operations |
| **Input Validation** | Pydantic models + ObjectId validation (prevents 500 errors) |
| **Container Security** | Non-root users in both client and server containers |
| **Health Checks** | Automatic container health monitoring |
| **Secrets Management** | `.env` excluded from Git, `.env.example` provided |
| **CORS** | Configurable cross-origin request protection |

---

## 📚 API Documentation

Once the server is running, access interactive API documentation:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Authentication Flow

```
1. POST /register  →  { "username": "user", "password": "pass" }
2. POST /token     →  Form data: username, password
                       Response: { "access_token": "...", "token_type": "bearer" }
3. Use token       →  Header: Authorization: Bearer <token>
```

---

## 💡 Environment Variables

Copy `.env.example` to `.env` and customize:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_ROOT_USER` | `root` | MongoDB admin username |
| `MONGO_ROOT_PASSWORD` | — | MongoDB admin password |
| `REACT_APP_API_URL` | `http://localhost:8000` | Backend API URL |
| `SECRET_KEY` | — | JWT signing secret (min 32 chars) |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `43200` | Token expiry (30 days) |

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

**Happy task managing! 🎯**

*Developed by [Yuval Alexandrony](https://github.com/Yuvalalex)*
