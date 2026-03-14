from fastapi import APIRouter
from pydantic import BaseModel
from services.vision_service import recommend_scenes_for_product

router = APIRouter()

VALID_SCENE_IDS = [
    "minimalist-studio",
    "cozy-living-room",
    "kitchen-counter",
    "outdoor-garden",
    "office-desk",
    "marble-bathroom",
    "wooden-shelf",
    "beach-sunset",
    "holiday-festive",
]


class RecommendRequest(BaseModel):
    image_url: str
    scene_ids: list[str] = VALID_SCENE_IDS


class RecommendResponse(BaseModel):
    reasoning: str
    recommended_scenes: list[str]


@router.post("/recommend-scenes", response_model=RecommendResponse)
async def recommend_scenes(request: RecommendRequest):
    # Filter to only known scene IDs
    available = [s for s in request.scene_ids if s in VALID_SCENE_IDS] or VALID_SCENE_IDS

    result = recommend_scenes_for_product(request.image_url, available)
    return RecommendResponse(
        reasoning=result.reasoning,
        recommended_scenes=result.recommended_scenes,
    )
