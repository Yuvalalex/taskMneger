from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import List
from models import CustomList
from auth import get_current_user
from database import get_lists_collection, get_tasks_collection

router = APIRouter(prefix="/lists", tags=["Lists"])

@router.get("", response_model=List[CustomList])
async def get_lists(current_user: dict = Depends(get_current_user)):
    lists_collection = get_lists_collection()
    lists = []
    async for doc in lists_collection.find({"owner_id": str(current_user["_id"])}):
        doc["_id"] = str(doc["_id"])
        lists.append(doc)
    return lists

@router.post("", response_model=CustomList)
async def create_list(l: CustomList, current_user: dict = Depends(get_current_user)):
    lists_collection = get_lists_collection()
    new_l = l.dict()
    new_l["owner_id"] = str(current_user["_id"])
    del new_l["id"]
    res = await lists_collection.insert_one(new_l)
    created = await lists_collection.find_one({"_id": res.inserted_id})
    created["_id"] = str(created["_id"])
    return created

@router.put("/{id}", response_model=CustomList)
async def update_list(id: str, lst: CustomList, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    lists_collection = get_lists_collection()
    await lists_collection.update_one(
        {"_id": ObjectId(id), "owner_id": str(current_user["_id"])},
        {"$set": {"name": lst.name, "color": lst.color}},
    )
    updated = await lists_collection.find_one({"_id": ObjectId(id)})
    if not updated:
        raise HTTPException(404, "List not found")
    updated["_id"] = str(updated["_id"])
    return updated

@router.delete("/{id}")
async def delete_list(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "Invalid ID")
    lists_collection = get_lists_collection()
    tasks_collection = get_tasks_collection()
    res = await lists_collection.delete_one(
        {"_id": ObjectId(id), "owner_id": str(current_user["_id"])}
    )
    if res.deleted_count == 0:
        raise HTTPException(404, "List not found")
    await tasks_collection.update_many({"list_id": id}, {"$set": {"list_id": None}})
    return {"success": True}
