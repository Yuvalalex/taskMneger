from pydantic import BaseModel, Field
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

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
    description: str = ""
    subtasks: List[Subtask] = []

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
