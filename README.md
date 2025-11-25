#  Task Manager - Advanced Productivity Platform

**Task Manager** is a state-of-the-art Full-Stack application for task and time management.
The system offers a comprehensive solution for personal and team productivity, featuring advanced visual views (Timeline, Eisenhower Matrix, Responsibility Tree), built on a robust Microservices architecture using Docker.

---

##  Key Features

* **Smart Task Management:** Clear distinction between actionable tasks and events.
* **Advanced Views:** Timeline, Eisenhower Matrix, Calendar, and Year Heatmap.
* **File Attachments:** Persistent file storage for tasks.
* **User System:** Secure Authentication (JWT) and user management.
* **Dockerized:** Fully containerized environment for easy deployment.

---

## Tech Stack

* **Frontend:** React.js (Hooks, Context API)
* **Backend:** Python FastAPI
* **Database:** MongoDB
* **DevOps:** Docker & Docker Compose
* **Testing:** Pytest

---

##  Project Structure


```text
taskManagerProject/
├── docker-compose.yml      # Orchestrates Client and Server containers
├── uploads/                # Persistent volume for file storage
├── server/                 # Python Backend
│   ├── main.py             # Entry point, API routes & Logic
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Server image configuration
│   └── test_main.py        # Unit tests
└── client/                 # React Frontend
    ├── Dockerfile          # Client image configuration
    ├── public/             # Static assets
    └── src/
        ├── components/     # Reusable UI components (Auth, Sidebar, TaskModal)
        ├── views/          # Page layouts (ListView, MatrixView, etc.)
        ├── App.js          # Main component & Routing
        └── App.css         # Global styles
    
```


## Getting Started & Running the App
You can run this project in two ways: using Docker

Run with Docker 
This is the easiest method. It sets up the Client, Server, and Database automatically.

Clone the repository:

git clone <your-repo-url>

cd taskManagerProject

Build and Run:

docker-compose up --build

Access the Application: 

Frontend: http://localhost:3000

Backend API Docs: http://localhost:8000/docs

2. Frontend Setup
Open a new terminal:
cd client
# Install dependencies
npm install

# Run Client
npm start
How to Run Tests
This project uses pytest for backend testing. You can run tests inside the Docker container or locally.

Run Tests via Docker
If your Docker containers are running, simply execute:
docker-compose exec server pytest

cd server
# Ensure venv is active
source venv/bin/activate

# Run tests
pytest

Developed by- Yuval Alexandrony

