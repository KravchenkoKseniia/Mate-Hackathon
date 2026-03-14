import base64
import httpx
from pydantic import BaseModel
from config import OPENAI_API_KEY


class SceneRecommendation(BaseModel):
    reasoning: str
    recommended_scenes: list[str]


DEFAULT_RECOMMENDATIONS = SceneRecommendation(
    reasoning="Default recommendation (AI analysis unavailable)",
    recommended_scenes=["minimalist-studio", "cozy-living-room"],
)


def recommend_scenes_for_product(image_url: str, available_scene_ids: list[str]) -> SceneRecommendation:
    """Analyze a cutout product image and return the top 2 recommended scenes.

    Uses gpt-4o-mini vision with structured output via client.beta.chat.completions.parse.
    Falls back to defaults if OPENAI_API_KEY is missing or the call fails.
    """
    if not OPENAI_API_KEY:
        return DEFAULT_RECOMMENDATIONS

    try:
        from openai import OpenAI

        # Download the image and convert to base64 data URL.
        # OpenAI servers cannot access fal.ai storage URLs directly.
        resp = httpx.get(image_url, timeout=30, follow_redirects=True)
        resp.raise_for_status()
        content_type = resp.headers.get("content-type", "image/png")
        b64 = base64.b64encode(resp.content).decode("ascii")
        data_url = f"data:{content_type};base64,{b64}"

        client = OpenAI(api_key=OPENAI_API_KEY)

        scene_list = ", ".join(available_scene_ids)

        completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert product photographer. You will be shown a product image "
                        "with its background removed (transparent). Analyze the product — its type, "
                        "material, color palette, and intended audience — then select exactly 2 scenes "
                        f"from this list that would best showcase it: {scene_list}. "
                        "Provide brief reasoning for your choices."
                    ),
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url,
                                "detail": "low",
                            },
                        },
                        {
                            "type": "text",
                            "text": "Which 2 scenes from the list best suit this product?",
                        },
                    ],
                },
            ],
            response_format=SceneRecommendation,
            max_tokens=200,
        )

        result = completion.choices[0].message.parsed
        if result is None:
            return DEFAULT_RECOMMENDATIONS

        # Validate: only keep IDs that are in the provided list
        validated = [s for s in result.recommended_scenes if s in available_scene_ids]
        if len(validated) < 2:
            return DEFAULT_RECOMMENDATIONS

        return SceneRecommendation(
            reasoning=result.reasoning,
            recommended_scenes=validated[:2],
        )

    except Exception:
        return DEFAULT_RECOMMENDATIONS
