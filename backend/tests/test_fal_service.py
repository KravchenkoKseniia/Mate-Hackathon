from unittest.mock import patch, MagicMock
import pytest

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
os.environ["FAL_KEY"] = "test-fake-key"

from services.fal_service import upload_to_fal, remove_background, generate_product_shot


@pytest.mark.asyncio
async def test_upload_to_fal():
    with patch("services.fal_service.fal_client.upload") as mock_upload:
        mock_upload.return_value = "https://fal.ai/storage/uploaded.png"
        result = await upload_to_fal(b"fake-bytes", "image/png")
        assert result == "https://fal.ai/storage/uploaded.png"
        mock_upload.assert_called_once_with(b"fake-bytes", content_type="image/png")


def test_remove_background():
    with patch("services.fal_service.fal_client.subscribe") as mock_sub:
        mock_sub.return_value = {"image": {"url": "https://fal.ai/cutout.png"}}
        result = remove_background("https://fal.ai/original.png")
        assert result == "https://fal.ai/cutout.png"
        mock_sub.assert_called_once_with(
            "fal-ai/bria/background/remove",
            arguments={"image_url": "https://fal.ai/original.png"},
        )


def test_generate_product_shot():
    with patch("services.fal_service.fal_client.subscribe") as mock_sub:
        mock_sub.return_value = {
            "images": [
                {"url": "https://fal.ai/shot1.png"},
            ]
        }
        result = generate_product_shot("https://fal.ai/cutout.png", "white studio")
        assert result == ["https://fal.ai/shot1.png"]
        mock_sub.assert_called_once_with(
            "fal-ai/bria/product-shot",
            arguments={
                "image_url": "https://fal.ai/cutout.png",
                "scene_description": "white studio",
                "placement_type": "automatic",
                "shot_size": [1024, 1024],
                "num_results": 1,
            },
        )


def test_remove_background_raises_on_fal_error():
    with patch("services.fal_service.fal_client.subscribe", side_effect=Exception("API error")):
        with pytest.raises(Exception, match="API error"):
            remove_background("https://fal.ai/original.png")


def test_generate_product_shot_raises_on_fal_error():
    with patch("services.fal_service.fal_client.subscribe", side_effect=Exception("GPU OOM")):
        with pytest.raises(Exception, match="GPU OOM"):
            generate_product_shot("https://fal.ai/cutout.png", "scene prompt")
