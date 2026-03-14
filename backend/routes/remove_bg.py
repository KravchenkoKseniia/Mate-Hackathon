from fastapi import APIRouter, HTTPException
from models import RemoveBgRequest, RemoveBgResponse
from services.fal_service import remove_background

router = APIRouter()


@router.post("/remove-bg", response_model=RemoveBgResponse)
async def remove_bg(request: RemoveBgRequest):
    try:
        cutout_url = remove_background(request.image_url)
        return RemoveBgResponse(cutout_url=cutout_url)
    except Exception as e:
        raise HTTPException(500, f"Background removal failed: {str(e)}")
