# Contributing to Task Manager

Thank you for your interest in contributing to Task Manager! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Docker and Docker Compose
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskManager.git
   cd taskManager
   ```

2. **Copy environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Backend
   cd ../server
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages
Use clear, descriptive commit messages:
```bash
git commit -m "feat: add new task filtering capability"
git commit -m "fix: resolve authentication token expiry bug"
git commit -m "docs: update setup instructions"
```

### Code Style

#### Python (Backend)
```bash
# Format with Black
black server/

# Lint with Flake8
flake8 server/
```

#### JavaScript (Frontend)
```bash
# Format with Prettier
npm run format

# Lint with ESLint
npm run lint
```

### Testing

#### Backend Tests
```bash
cd server
pytest
pytest --cov=.  # With coverage
```

#### Frontend Tests
```bash
cd client
npm test
npm test -- --coverage  # With coverage
```

### Pull Request Process

1. **Update your branch**
   ```bash
   git pull origin main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clear code with comments
   - Add tests for new functionality
   - Update documentation

4. **Run tests locally**
   ```bash
   npm test           # Frontend
   pytest             # Backend
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Related Issue
   Closes #123
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation
   
   ## Testing
   Describe test coverage
   
   ## Screenshots (if applicable)
   ```

## Code Review Guidelines

- Keep PRs focused and reasonably sized
- Respond to review comments promptly
- All checks must pass (linting, tests, build)
- At least one approval required

## Reporting Issues

Please use clear titles and provide:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- OS and browser information

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Welcome newcomers and provide guidance
- Focus on the code, not the person

## Questions?

Open an issue or start a discussion. Happy contributing! 🚀
