from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from models import User
from auth import get_password_hash, verify_password, create_access_token
from database import get_users_collection
from typing import List

router = APIRouter(tags=["Authentication"])

@router.post("/register")
async def register(user: User) -> dict:
    users_collection = get_users_collection()
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(400, "Taken")
    await users_collection.insert_one(
        {"username": user.username, "hashed_password": get_password_hash(user.password)}
    )
    return {"message": "Created"}

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> dict:
    users_collection = get_users_collection()
    user = await users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(401)
    return {
        "access_token": create_access_token(data={"sub": user["username"]}),
        "token_type": "bearer",
    }

@router.get("/users/all", response_model=List[str])
async def get_all_users() -> List[str]:
    users_collection = get_users_collection()
    users = []
    async for u in users_collection.find({}):
        users.append(u["username"])
    return users
