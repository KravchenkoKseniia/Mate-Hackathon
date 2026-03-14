import fal_client


async def upload_to_fal(file_bytes: bytes, content_type: str) -> str:
    """Upload file to fal.ai storage, return URL."""
    url = fal_client.upload(file_bytes, content_type=content_type)
    return url


def remove_background(image_url: str) -> str:
    """Remove background using Bria RMBG 2.0. Returns cutout image URL."""
    result = fal_client.subscribe(
        "fal-ai/bria/background/remove",
        arguments={"image_url": image_url},
    )
    return result["image"]["url"]


def generate_product_shot(image_url: str, scene_prompt: str, num_images: int = 1) -> list[str]:
    """Generate product lifestyle shots. Returns list of image URLs."""
    result = fal_client.subscribe(
        "fal-ai/bria/product-shot",
        arguments={
            "image_url": image_url,
            "scene_description": scene_prompt,
            "placement_type": "automatic",
            "shot_size": [1024, 1024],
            "num_results": num_images,
        },
    )
    return [img["url"] for img in result["images"]][:num_images]
