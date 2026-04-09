import os
from motor.motor_asyncio import AsyncIOMotorClient

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db.client = AsyncIOMotorClient(MONGO_URI)
    db.db = db.client.ticktick_clone

async def close_mongo_connection():
    if db.client:
        db.client.close()

def get_tasks_collection():
    return db.db.tasks

def get_users_collection():
    return db.db.users

def get_lists_collection():
    return db.db.lists
