from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Import database lifecycle events
from database import connect_to_mongo, close_mongo_connection

# Import Routers
from routers import auth_router, lists_router, tasks_router, uploads_router

# Load environment variables
load_dotenv()

app = FastAPI(title="Task Manager API", description="Pro Edition API endpoints", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup and Shutdown Events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    print("MongoDB Connected successfully and Routers initialized.")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    print("MongoDB Connection Closed.")

# Setup static files directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(auth_router.router)
app.include_router(lists_router.router)
app.include_router(tasks_router.router)
app.include_router(uploads_router.router)
