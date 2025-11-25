from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional
import os
import shutil
import json
import time
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt

SECRET_KEY = "my_secret_key_change_this_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

app = FastAPI()

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.ticktick_clone
tasks_collection = db.tasks
users_collection = db.users
lists_collection = db.lists

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# --- Models ---
class User(BaseModel):
    username: str
    password: str

class CustomList(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    owner_id: str = ""
    name: str
    color: str = "#6b63ff"

class Subtask(BaseModel):
    title: str
    isDone: bool = False

class TaskModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    owner_id: str
    list_id: Optional[str] = None
    assignee: Optional[str] = None
    title: str
    isDone: bool = False
    tag: str = "General"
    isEvent: bool = False
    isAllDay: bool = False
    isDeleted: bool = False
    priority: int = 4
    dueDate: Optional[datetime] = None
    startTime: str = "09:00"
    endTime: str = "10:00"
    description: str = ""
    subtasks: List[Subtask] = []
    attachments: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.now)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class TaskCreate(BaseModel):
    title: str
    tag: str = "General"
    list_id: Optional[str] = None
    assignee: Optional[str] = None
    isEvent: bool = False
    isAllDay: bool = False
    priority: int = 4
    dueDate: Optional[str] = None
    startTime: Optional[str] = "09:00"
    endTime: Optional[str] = "10:00"

class TaskUpdate(BaseModel):
    title: str
    tag: str
    list_id: Optional[str] = None
    assignee: Optional[str] = None
    isEvent: bool
    isAllDay: bool
    priority: int
    description: str
    subtasks: List[Subtask]
    attachments: List[str] = []
    dueDate: Optional[str] = None
    startTime: Optional[str] = "09:00"
    endTime: Optional[str] = "10:00"
    isDeleted: bool = False
    isDone: bool = False



# --- Helpers ---
def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)

def get_password_hash(password): return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username: raise HTTPException(401)
    except:
        raise HTTPException(401)
    user = await users_collection.find_one({"username": username})
    if not user: raise HTTPException(401)
    return user


# --- Routes ---

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = f"{datetime.now().timestamp()}_{file.filename}"
    with open(f"uploads/{filename}", "wb+") as f: shutil.copyfileobj(file.file, f)
    return {"filename": filename, "url": f"/uploads/{filename}"}


@app.get("/users/all", response_model=List[str])
async def get_all_users():
    users = []
    async for u in users_collection.find({}): users.append(u["username"])
    return users


# Lists
@app.get("/lists", response_model=List[CustomList])
async def get_lists(current_user: dict = Depends(get_current_user)):
    lists = []
    async for doc in lists_collection.find({"owner_id": str(current_user["_id"])}):
        doc["_id"] = str(doc["_id"])
        lists.append(doc)
    return lists


@app.post("/lists", response_model=CustomList)
async def create_list(l: CustomList, current_user: dict = Depends(get_current_user)):
    new_l = l.dict()
    new_l["owner_id"] = str(current_user["_id"])
    del new_l["id"]
    res = await lists_collection.insert_one(new_l)
    created = await lists_collection.find_one({"_id": res.inserted_id})
    created["_id"] = str(created["_id"])
    return created


@app.put("/lists/{id}", response_model=CustomList)
async def update_list(id: str, l: CustomList, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id): raise HTTPException(400)
    await lists_collection.update_one({"_id": ObjectId(id), "owner_id": str(current_user["_id"])},
                                      {"$set": {"name": l.name, "color": l.color}})
    updated = await lists_collection.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])
    return updated


@app.delete("/lists/{id}")
async def delete_list(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id): raise HTTPException(400)
    res = await lists_collection.delete_one({"_id": ObjectId(id), "owner_id": str(current_user["_id"])})
    if res.deleted_count == 0: raise HTTPException(404, "List not found")
    await tasks_collection.update_many({"list_id": id}, {"$set": {"list_id": None}})
    return {"success": True}


# Auth & Tasks
@app.post("/register")
async def register(user: User):
    if await users_collection.find_one({"username": user.username}): raise HTTPException(400, "Taken")
    await users_collection.insert_one({"username": user.username, "hashed_password": get_password_hash(user.password)})
    return {"message": "Created"}


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]): raise HTTPException(401)
    return {"access_token": create_access_token(data={"sub": user["username"]}), "token_type": "bearer"}


@app.get("/tasks", response_model=List[TaskModel])
async def get_tasks(mode: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    tasks = []
    query = {}

    # === LOGIC FIX: VISIBILITY ===
    if mode == "all":
        query = {}
    else:
        query = {
            "$or": [
                {"assignee": current_user["username"]},
                {
                    "$and": [
                        {"owner_id": str(current_user["_id"])},
                        {"assignee": {"$in": [None, ""]}}
                    ]
                }
            ]
        }

    # === SORTING FIX ===
    cursor = tasks_collection.find(query).sort([
        ("isDone", 1),
        ("priority", 1),
        ("isEvent", -1),
        ("dueDate", 1)
    ])

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        for k, v in [("isAllDay", False), ("subtasks", []), ("attachments", []), ("list_id", None), ("assignee", None)]:
            if k not in doc: doc[k] = v
        tasks.append(doc)
    return tasks


@app.post("/tasks", response_model=TaskModel)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    p_date = None
    if task.dueDate:
        try:
            p_date = datetime.fromisoformat(task.dueDate)
        except:
            pass
    new_task = task.dict()
    new_task.update(
        {"owner_id": str(current_user["_id"]), "isDone": False, "isDeleted": False, "subtasks": [], "attachments": [],
         "description": "", "dueDate": p_date, "createdAt": datetime.now()})
    res = await tasks_collection.insert_one(new_task)
    created = await tasks_collection.find_one({"_id": res.inserted_id})
    created["_id"] = str(created["_id"])
    return created


@app.put("/tasks/{id}/update", response_model=TaskModel)
async def update_task(id: str, update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    p_date = None
    if update.dueDate:
        try:
            p_date = datetime.fromisoformat(update.dueDate)
        except:
            pass
    subtasks = [{"title": s.title, "isDone": s.isDone} for s in update.subtasks]
    await tasks_collection.update_one({"_id": ObjectId(id)}, {
        "$set": {**update.dict(exclude={"subtasks", "dueDate"}), "subtasks": subtasks, "dueDate": p_date}})
    updated = await tasks_collection.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])
    return updated


@app.put("/tasks/{id}", response_model=TaskModel)
async def toggle(id: str):
    t = await tasks_collection.find_one({"_id": ObjectId(id)})
    if t: await tasks_collection.update_one({"_id": ObjectId(id)}, {"$set": {"isDone": not t["isDone"]}})
    u = await tasks_collection.find_one({"_id": ObjectId(id)})
    u["_id"] = str(u["_id"])
    return u


@app.delete("/tasks/{id}")
async def del_task(id: str):
    t = await tasks_collection.find_one({"_id": ObjectId(id)})
    if t:
        if t.get("isDeleted"):
            await tasks_collection.delete_one({"_id": ObjectId(id)})
        else:
            await tasks_collection.update_one({"_id": ObjectId(id)}, {"$set": {"isDeleted": True}})
    return {"success": True}


@app.put("/tasks/{id}/restore", response_model=TaskModel)
async def res(id: str):
    await tasks_collection.update_one({"_id": ObjectId(id)}, {"$set": {"isDeleted": False}})
    u = await tasks_collection.find_one({"_id": ObjectId(id)})
    u["_id"] = str(u["_id"])
    return u