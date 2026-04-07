# Task Manager - Pro Edition

**Task Manager** is a high-performance Full-Stack application for intelligent task and time management.

## 🚀 Features

- **Smart Task Management:** Distinguish between actionable tasks and events with rich metadata
- **Advanced Visualization:** Timeline, Eisenhower Matrix, Monthly Calendar, Year Heatmap, Responsibility Tree
- **File Attachments:** Persistent storage for task-related files and documents
- **Secure Authentication:** JWT-based authentication with bcrypt password hashing
- **Containerized:** Fully dockerized with docker-compose for one-command deployment
- **Professional Testing:** Full test coverage with pytest (backend) and Jest (frontend)
- **Code Quality:** ESLint, Prettier, Black, Flake8 for consistent code standards
- **CI/CD Pipeline:** Automated testing, linting, and building with GitHub Actions

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Hooks, Context API, Axios, React Icons |
| **Backend** | Python 3.9, FastAPI, Uvicorn |
| **Database** | MongoDB 7.0 |
| **DevOps** | Docker, Docker Compose |
| **Testing** | Pytest, Jest, React Testing Library |
| **Linting** | ESLint, Black, Flake8 |
| **CI/CD** | GitHub Actions |
| **Security** | JWT, Bcrypt, Non-root containers, Health checks |

---

## 📦 Project Structure

```
taskManager/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions CI/CD pipeline
├── client/                        # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Auth.js
│   │   │   ├── Sidebar.js
│   │   │   ├── TaskModal.js
│   │   │   └── views/             # View layouts
│   │   │       ├── ListView.js
│   │   │       ├── MatrixView.js
│   │   │       ├── MonthView.js
│   │   │       ├── TimelineView.js
│   │   │       ├── YearView.js
│   │   │       ├── ResponsibilityView.js
│   │   │       └── SettingsView.js
│   │   ├── App.js                 # Main component & routing
│   │   ├── App.test.js            # App component tests
│   │   ├── utils.js               # Utility functions
│   │   └── utils.test.js          # Utils tests
│   ├── Dockerfile                 # Multi-stage Docker build
│   ├── package.json               # Dependencies + test/lint scripts
│   └── public/
│       └── index.html
├── server/                        # Python FastAPI Backend
│   ├── main.py                    # API routes, business logic
│   ├── test_main.py               # pytest tests
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example              # Environment variables template
│   └── Dockerfile                 # Secure Docker build
├── docker-compose.yml             # Multi-container orchestration
├── .env                          # Local environment variables
├── .env.example                  # Template environment variables
├── .gitignore                    # Git ignore patterns
├── LICENSE                       # MIT License
├── README.md                     # This file
└── CONTRIBUTING.md              # Contribution guidelines
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR: Node.js 18+, Python 3.9+, MongoDB 7.0

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/taskManager.git
cd taskManager

# Create environment file (optional - will use defaults)
cp .env.example .env

# Build and run
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

### Option 2: Local Development

**Backend Setup:**
```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
# Edit .env with your configuration

# Run server
uvicorn main:app --reload --port 8000
```

**Frontend Setup:**
```bash
cd client

# Install dependencies
npm install

# Start development server
npm start
# Runs on http://localhost:3000
```

---

## 🧪 Testing

### Backend Tests
```bash
cd server

# Run all tests
pytest

# Run with coverage report
pytest --cov=. --cov-report=html

# Run specific test file
pytest test_main.py -v
```

### Frontend Tests
```bash
cd client

# Run all tests
npm test

# Run with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- Auth.test.js
```

### Using Docker
```bash
# Run backend tests in Docker
docker-compose exec server pytest

# Run frontend tests in Docker
docker-compose exec client npm test
```

---

## 📝 Code Quality

### Python (Backend)

```bash
cd server

# Format code with Black
black .

# Lint with Flake8
flake8 .

# Format and lint
black . && flake8 .
```

### JavaScript (Frontend)

```bash
cd client

# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npm run format:check

# Format and lint
npm run format && npm run lint:fix
```

---

## 🔄 CI/CD Pipeline

This project includes a comprehensive GitHub Actions pipeline that:

- ✅ Lints Python code (Black, Flake8)
- ✅ Runs backend tests with coverage
- ✅ Lints JavaScript code (ESLint)
- ✅ Checks code formatting (Prettier)
- ✅ Runs frontend tests with coverage
- ✅ Builds Docker images
- ✅ Scans for security vulnerabilities (Trivy)

**View workflow:** [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

---

## 🔐 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt for password security
- **Non-root Containers:** Both services run as non-root users
- **Health Checks:** Container health verification
- **Environment Variables:** Sensitive data kept out of code
- **CORS Protection:** Configurable cross-origin requests
- **Input Validation:** Pydantic models for request validation

---

## 📚 API Documentation

Once the server is running, access interactive API documentation:

```
http://localhost:8000/docs          # Swagger UI
http://localhost:8000/redoc         # ReDoc
```

### Authentication Flow

1. **Register:** `POST /register`
   ```json
   { "username": "user", "password": "pass" }
   ```

2. **Login:** `POST /token`
   ```
   Form data: username, password
   Response: { "access_token": "...", "token_type": "bearer" }
   ```

3. **Use Token:** Add to request headers
   ```
   Authorization: Bearer <your_token>
   ```

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Branch naming conventions
- Commit message standards
- Code style guidelines
- Pull request process

**Quick steps:**
```bash
git checkout -b feature/your-feature
# Make changes
npm run lint && npm run format  # Frontend
black . && flake8 .             # Backend
npm test && pytest              # Tests
git commit -m "feat: description"
git push origin feature/your-feature
```

---

## 💡 Environment Variables

### `.env` (Local Development)
```bash
# MongoDB
MONGO_ROOT_USER=root
MONGO_ROOT_PASSWORD=taskmanager_password

# API
REACT_APP_API_URL=http://localhost:8000

# JWT
SECRET_KEY=your_super_secret_key_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Server
ENV=development
```

See `.env.example` for all available options.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## ✨ Acknowledgments

- React documentation and community
- FastAPI by Sebastián Ramírez
- MongoDB documentation
- GitHub Actions runners

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/yourusername/taskManager/issues)
2. Create a new issue with detailed description
3. Follow the issue template

---

**Happy task managing! 🎯**

*Developed with ❤️ by [Yuval Alexandrony](https://github.com/yourusername)*

