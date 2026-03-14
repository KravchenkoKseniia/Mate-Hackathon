from unittest.mock import patch


def test_generate_single_preset(client, mock_fal_generate):
    """Generate with a single preset scene."""
    response = client.post(
        "/api/generate",
        json={
            "image_url": "https://fal.ai/storage/cutout.png",
            "scenes": ["minimalist-studio"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 1
    assert data["results"][0]["scene_name"] == "Minimalist studio"
    assert len(data["results"][0]["images"]) == 1


def test_generate_multiple_presets(client, mock_fal_generate):
    """Generate with multiple preset scenes."""
    response = client.post(
        "/api/generate",
        json={
            "image_url": "https://fal.ai/storage/cutout.png",
            "scenes": ["minimalist-studio", "beach-sunset", "office-desk"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 3
    names = [r["scene_name"] for r in data["results"]]
    assert names == ["Minimalist studio", "Beach sunset", "Office desk"]


def test_generate_custom_scene(client, mock_fal_generate):
    """Generate with a custom prompt (not a preset ID)."""
    response = client.post(
        "/api/generate",
        json={
            "image_url": "https://fal.ai/storage/cutout.png",
            "scenes": ["A futuristic neon cityscape at night"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["results"][0]["scene_name"] == "Custom scene"
    assert len(data["results"][0]["images"]) == 1


def test_generate_mixed_preset_and_custom(client, mock_fal_generate):
    """Generate with both preset and custom scenes."""
    response = client.post(
        "/api/generate",
        json={
            "image_url": "https://fal.ai/storage/cutout.png",
            "scenes": ["kitchen-counter", "A zen garden with bamboo"],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["results"]) == 2
    assert data["results"][0]["scene_name"] == "Kitchen counter"
    assert data["results"][1]["scene_name"] == "Custom scene"


def test_generate_empty_scenes(client):
    """Request with empty scenes list should return empty results."""
    response = client.post(
        "/api/generate",
        json={
            "image_url": "https://fal.ai/storage/cutout.png",
            "scenes": [],
        },
    )
    assert response.status_code == 200
    assert response.json()["results"] == []


def test_generate_partial_failure(client):
    """One scene fails, others succeed — should not crash."""
    call_count = 0

    def mock_subscribe(model, arguments):
        nonlocal call_count
        call_count += 1
        if call_count == 2:
            raise Exception("GPU timeout")
        return {
            "images": [{"url": f"https://fal.ai/storage/shot-{call_count}.png"}]
        }

    with patch("services.fal_service.fal_client.subscribe", side_effect=mock_subscribe):
        response = client.post(
            "/api/generate",
            json={
                "image_url": "https://fal.ai/storage/cutout.png",
                "scenes": ["minimalist-studio", "beach-sunset", "office-desk"],
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert len(data["results"]) == 3
        # First and third succeed, second fails
        assert len(data["results"][0]["images"]) == 1
        assert data["results"][1]["scene_name"] == "Beach sunset (failed)"
        assert data["results"][1]["images"] == []
        assert len(data["results"][2]["images"]) == 1


def test_generate_missing_image_url(client):
    """Reject request with missing image_url."""
    response = client.post("/api/generate", json={"scenes": ["minimalist-studio"]})
    assert response.status_code == 422


def test_get_scenes(client):
    """GET /api/scenes returns all 9 presets."""
    response = client.get("/api/scenes")
    assert response.status_code == 200
    scenes = response.json()
    assert len(scenes) == 9
    ids = [s["id"] for s in scenes]
    assert "minimalist-studio" in ids
    assert "holiday-festive" in ids
    # Each scene should have id, name, prompt
    for scene in scenes:
        assert "id" in scene
        assert "name" in scene
        assert "prompt" in scene
        assert len(scene["prompt"]) > 10
