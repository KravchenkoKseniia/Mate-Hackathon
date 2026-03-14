from fastapi import APIRouter, UploadFile, File, HTTPException
from models import UploadResponse
from services.fal_service import upload_to_fal

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)):
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large. Max 10MB.")

    allowed = ["image/png", "image/jpeg", "image/webp"]
    if file.content_type not in allowed:
        raise HTTPException(400, f"Invalid file type: {file.content_type}")

    contents = await file.read()
    url = await upload_to_fal(contents, file.content_type)
    return UploadResponse(image_url=url)
