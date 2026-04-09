from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from models import TaskModel, TaskCreate, TaskUpdate
from auth import get_current_user
from database import get_tasks_collection

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=List[TaskModel])
async def get_tasks(mode: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    tasks_collection = get_tasks_collection()
    tasks = []
    query = {}

    if mode == "all":
        query = {"owner_id": str(current_user["_id"])}  # SECURITY FIX
    else:
        query = {
            "$or": [
                {"assignee": current_user["username"]},
                {
                    "$and": [
                        {"owner_id": str(current_user["_id"])},
                        {"assignee": {"$in": [None, ""]}},
                    ]
                },
            ]
        }

    cursor = tasks_collection.find(query).sort(
        [("isDone", 1), ("priority", 1), ("isEvent", -1), ("dueDate", 1)]
    )

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        for k, v in [
            ("isAllDay", False),
            ("subtasks", []),
            ("attachments", []),
            ("list_id", None),
            ("assignee", None),
        ]:
            if k not in doc:
                doc[k] = v
        tasks.append(doc)
    return tasks

@router.post("", response_model=TaskModel)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    tasks_collection = get_tasks_collection()
    p_date = None
    if task.dueDate:
        try:
            p_date = datetime.fromisoformat(task.dueDate)
        except ValueError:
            pass
    new_task = task.dict()
    new_task.update({
        "owner_id": str(current_user["_id"]),
        "isDone": False,
        "isDeleted": False,
        "attachments": [],
        "dueDate": p_date,
        "createdAt": datetime.now(),
    })
    res = await tasks_collection.insert_one(new_task)
    created = await tasks_collection.find_one({"_id": res.inserted_id})
    created["_id"] = str(created["_id"])
    return created

@router.put("/{id}/update", response_model=TaskModel)
async def update_task(id: str, update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    tasks_collection = get_tasks_collection()
    existing = await tasks_collection.find_one({
        "_id": ObjectId(id),
        "$or": [
            {"owner_id": str(current_user["_id"])},
            {"assignee": current_user["username"]}
        ]
    })
    if not existing:
        raise HTTPException(404, "Task not found or unauthorized")
        
    p_date = None
    if update.dueDate:
        try:
            p_date = datetime.fromisoformat(update.dueDate)
        except ValueError:
            pass
    subtasks = [{"title": s.title, "isDone": s.isDone} for s in update.subtasks]
    await tasks_collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                **update.dict(exclude={"subtasks", "dueDate"}),
                "subtasks": subtasks,
                "dueDate": p_date,
            }
        },
    )
    updated = await tasks_collection.find_one({"_id": ObjectId(id)})
    updated["_id"] = str(updated["_id"])
    return updated

@router.put("/{id}", response_model=TaskModel)
async def toggle(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    tasks_collection = get_tasks_collection()
    t = await tasks_collection.find_one({
        "_id": ObjectId(id),
        "$or": [
            {"owner_id": str(current_user["_id"])},
            {"assignee": current_user["username"]}
        ]
    })
    if not t:
        raise HTTPException(404, "Task not found or unauthorized")
        
    await tasks_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": {"isDone": not t["isDone"]}}
    )
    u = await tasks_collection.find_one({"_id": ObjectId(id)})
    u["_id"] = str(u["_id"])
    return u

@router.delete("/{id}")
async def del_task(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    tasks_collection = get_tasks_collection()
    t = await tasks_collection.find_one({"_id": ObjectId(id), "owner_id": str(current_user["_id"])})
    if not t:
        raise HTTPException(404, "Task not found or unauthorized")
        
    if t.get("isDeleted"):
        await tasks_collection.delete_one({"_id": ObjectId(id)})
    else:
        await tasks_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": {"isDeleted": True}}
        )
    return {"success": True}

@router.put("/{id}/restore", response_model=TaskModel)
async def res(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    tasks_collection = get_tasks_collection()
    t = await tasks_collection.find_one({"_id": ObjectId(id), "owner_id": str(current_user["_id"])})
    if not t:
        raise HTTPException(404, "Task not found or unauthorized")
        
    await tasks_collection.update_one(
        {"_id": ObjectId(id)}, {"$set": {"isDeleted": False}}
    )
    u = await tasks_collection.find_one({"_id": ObjectId(id)})
    u["_id"] = str(u["_id"])
    return u
