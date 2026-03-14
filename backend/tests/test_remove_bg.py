def test_remove_bg_success(client, mock_fal_remove_bg):
    """Successfully remove background from image."""
    response = client.post(
        "/api/remove-bg",
        json={"image_url": "https://fal.ai/storage/test-image.png"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "cutout_url" in data
    assert data["cutout_url"] == "https://fal.ai/storage/cutout.png"
    mock_fal_remove_bg.assert_called_once_with(
        "fal-ai/bria/background/remove",
        arguments={"image_url": "https://fal.ai/storage/test-image.png"},
    )


def test_remove_bg_missing_url(client):
    """Reject request with missing image_url."""
    response = client.post("/api/remove-bg", json={})
    assert response.status_code == 422


def test_remove_bg_fal_failure(client):
    """Handle fal.ai failure gracefully."""
    from unittest.mock import patch

    with patch(
        "services.fal_service.fal_client.subscribe",
        side_effect=Exception("model unavailable"),
    ):
        response = client.post(
            "/api/remove-bg",
            json={"image_url": "https://fal.ai/storage/test.png"},
        )
        assert response.status_code == 500
        assert "Background removal failed" in response.json()["detail"]
