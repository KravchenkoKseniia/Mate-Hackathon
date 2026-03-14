from unittest.mock import patch, MagicMock
import routes.recommend as recommend_mod
import services.vision_service as vision_mod
from services.vision_service import SceneRecommendation, recommend_scenes_for_product


def _mock_httpx_response():
    """Create a mock httpx response with fake image bytes."""
    mock_resp = MagicMock()
    mock_resp.content = b"\x89PNG\r\n\x1a\nfakeimage"
    mock_resp.headers = {"content-type": "image/png"}
    mock_resp.raise_for_status = MagicMock()
    return mock_resp


def test_recommend_scenes_fallback_no_key(client):
    """Without OPENAI_API_KEY, returns default 2 recommendations."""
    with patch.object(vision_mod, "OPENAI_API_KEY", ""):
        response = client.post(
            "/api/recommend-scenes",
            json={"image_url": "https://fal.ai/storage/cutout.png"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "recommended_scenes" in data
        assert "reasoning" in data
        assert len(data["recommended_scenes"]) == 2
        assert data["recommended_scenes"] == ["minimalist-studio", "cozy-living-room"]


def test_recommend_scenes_with_openai(client):
    """With a valid key, uses beta.chat.completions.parse and returns structured output."""
    mock_parsed = SceneRecommendation(
        reasoning="This ceramic mug suits a cozy and kitchen setting.",
        recommended_scenes=["cozy-living-room", "kitchen-counter"],
    )
    mock_message = MagicMock()
    mock_message.parsed = mock_parsed
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]

    mock_client_instance = MagicMock()
    mock_client_instance.beta.chat.completions.parse.return_value = mock_response

    with patch.object(vision_mod, "OPENAI_API_KEY", "sk-test-key"):
        with patch("services.vision_service.httpx.get", return_value=_mock_httpx_response()):
            with patch("openai.OpenAI", return_value=mock_client_instance):
                response = client.post(
                    "/api/recommend-scenes",
                    json={"image_url": "https://fal.ai/storage/cutout.png"},
                )

    assert response.status_code == 200
    data = response.json()
    assert data["recommended_scenes"] == ["cozy-living-room", "kitchen-counter"]
    assert "ceramic mug" in data["reasoning"].lower()

    # Verify beta.chat.completions.parse was called (not .create)
    mock_client_instance.beta.chat.completions.parse.assert_called_once()
    call_kwargs = mock_client_instance.beta.chat.completions.parse.call_args
    assert call_kwargs.kwargs["model"] == "gpt-4o-mini"
    assert call_kwargs.kwargs["response_format"] is SceneRecommendation


def test_recommend_scenes_sends_base64_data_url(client):
    """Verify the image is downloaded and sent as a base64 data URL."""
    mock_parsed = SceneRecommendation(
        reasoning="Good for studio.",
        recommended_scenes=["minimalist-studio", "office-desk"],
    )
    mock_message = MagicMock()
    mock_message.parsed = mock_parsed
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]

    mock_client_instance = MagicMock()
    mock_client_instance.beta.chat.completions.parse.return_value = mock_response

    with patch.object(vision_mod, "OPENAI_API_KEY", "sk-test-key"):
        with patch("services.vision_service.httpx.get", return_value=_mock_httpx_response()) as mock_get:
            with patch("openai.OpenAI", return_value=mock_client_instance):
                client.post(
                    "/api/recommend-scenes",
                    json={"image_url": "https://fal.ai/storage/cutout.png"},
                )

    # httpx.get was called with the fal URL
    mock_get.assert_called_once_with("https://fal.ai/storage/cutout.png", timeout=30, follow_redirects=True)

    call_kwargs = mock_client_instance.beta.chat.completions.parse.call_args
    messages = call_kwargs.kwargs["messages"]
    user_msg = messages[1]
    image_part = user_msg["content"][0]
    assert image_part["type"] == "image_url"
    assert image_part["image_url"]["url"].startswith("data:image/png;base64,")
    assert image_part["image_url"]["detail"] == "low"


def test_recommend_scenes_openai_error_fallback(client):
    """If OpenAI call fails, returns default recommendations."""
    with patch.object(vision_mod, "OPENAI_API_KEY", "sk-test-key"):
        with patch("services.vision_service.httpx.get", return_value=_mock_httpx_response()):
            with patch("openai.OpenAI", side_effect=Exception("API down")):
                response = client.post(
                    "/api/recommend-scenes",
                    json={"image_url": "https://fal.ai/storage/cutout.png"},
                )

    assert response.status_code == 200
    data = response.json()
    assert len(data["recommended_scenes"]) == 2


def test_recommend_scenes_custom_scene_ids(client):
    """Accepts a custom list of scene IDs to choose from."""
    with patch.object(vision_mod, "OPENAI_API_KEY", ""):
        response = client.post(
            "/api/recommend-scenes",
            json={
                "image_url": "https://fal.ai/storage/cutout.png",
                "scene_ids": ["beach-sunset", "office-desk"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["recommended_scenes"]) == 2


def test_recommend_scenes_missing_url(client):
    """Reject request with missing image_url."""
    response = client.post("/api/recommend-scenes", json={})
    assert response.status_code == 422


def test_recommend_scenes_validates_invalid_ids(client):
    """Invalid scene IDs in the request are filtered out, falls back to all valid."""
    with patch.object(vision_mod, "OPENAI_API_KEY", ""):
        response = client.post(
            "/api/recommend-scenes",
            json={
                "image_url": "https://fal.ai/storage/cutout.png",
                "scene_ids": ["nonexistent-scene", "fake-id"],
            },
        )
        assert response.status_code == 200
        # Falls back to using all valid scene IDs
        assert len(response.json()["recommended_scenes"]) == 2


def test_service_returns_exactly_2():
    """The service function always returns exactly 2 scenes."""
    with patch.object(vision_mod, "OPENAI_API_KEY", ""):
        result = recommend_scenes_for_product(
            "https://fal.ai/cutout.png",
            ["minimalist-studio", "office-desk", "beach-sunset"],
        )
        assert len(result.recommended_scenes) == 2
        assert isinstance(result.reasoning, str)


def test_recommend_scenes_image_download_fails(client):
    """If image download fails, returns default recommendations."""
    with patch.object(vision_mod, "OPENAI_API_KEY", "sk-test-key"):
        with patch("services.vision_service.httpx.get", side_effect=Exception("Connection refused")):
            response = client.post(
                "/api/recommend-scenes",
                json={"image_url": "https://fal.ai/storage/cutout.png"},
            )

    assert response.status_code == 200
    data = response.json()
    assert len(data["recommended_scenes"]) == 2
    assert data["recommended_scenes"] == ["minimalist-studio", "cozy-living-room"]
