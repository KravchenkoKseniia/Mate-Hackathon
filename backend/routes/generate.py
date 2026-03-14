from fastapi import APIRouter
from models import GenerateRequest, GenerateResponse, GeneratedScene
from services.fal_service import generate_product_shot

router = APIRouter()

SCENE_PRESETS = {
    "minimalist-studio": {
        "name": "Minimalist studio",
        "prompt": "Clean white studio with soft diffused lighting, subtle shadows, professional product photography setup",
    },
    "cozy-living-room": {
        "name": "Cozy living room",
        "prompt": "Warm cozy living room with natural sunlight through window, wooden coffee table, green plants, soft textile background",
    },
    "kitchen-counter": {
        "name": "Kitchen counter",
        "prompt": "Modern kitchen countertop, marble surface, warm ambient lighting, cooking utensils in background, homey atmosphere",
    },
    "outdoor-garden": {
        "name": "Outdoor garden table",
        "prompt": "Outdoor garden table with natural greenery, dappled sunlight through leaves, rustic wooden surface",
    },
    "office-desk": {
        "name": "Office desk",
        "prompt": "Clean modern office desk, laptop and notebook in background, professional workspace, natural window light",
    },
    "marble-bathroom": {
        "name": "Marble bathroom",
        "prompt": "Luxurious marble bathroom counter, elegant lighting, premium spa-like atmosphere, white and gold accents",
    },
    "wooden-shelf": {
        "name": "Wooden shelf",
        "prompt": "Rustic wooden shelf with warm lighting, books and small plants in background, bohemian cozy aesthetic",
    },
    "beach-sunset": {
        "name": "Beach sunset",
        "prompt": "Sandy beach surface at golden hour, ocean waves in soft focus background, warm sunset lighting",
    },
    "holiday-festive": {
        "name": "Holiday festive",
        "prompt": "Festive holiday setting with fairy lights, red and gold decorations, warm cozy Christmas atmosphere, gift wrapping elements",
    },
}


@router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    results = []
    for scene_id in request.scenes:
        if scene_id in SCENE_PRESETS:
            preset = SCENE_PRESETS[scene_id]
            prompt = preset["prompt"]
            name = preset["name"]
        else:
            # Treat as custom prompt
            prompt = scene_id
            name = "Custom scene"

        try:
            image_urls = generate_product_shot(request.image_url, prompt)
            results.append(GeneratedScene(scene_name=name, images=image_urls))
        except Exception:
            results.append(GeneratedScene(scene_name=f"{name} (failed)", images=[]))

    return GenerateResponse(results=results)


@router.get("/scenes")
async def get_scenes():
    return [
        {"id": k, "name": v["name"], "prompt": v["prompt"]}
        for k, v in SCENE_PRESETS.items()
    ]
