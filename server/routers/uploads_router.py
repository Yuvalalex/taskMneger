from fastapi import APIRouter, UploadFile, File
from datetime import datetime
import shutil

router = APIRouter(prefix="/upload", tags=["Uploads"])

@router.post("")
async def upload_file(file: UploadFile = File(...)) -> dict:
    filename = f"{datetime.now().timestamp()}_{file.filename}"
    with open(f"uploads/{filename}", "wb+") as f:
        shutil.copyfileobj(file.file, f)
    return {"filename": filename, "url": f"/uploads/{filename}"}
