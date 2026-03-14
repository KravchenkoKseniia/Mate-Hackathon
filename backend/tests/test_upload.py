import io


def test_upload_valid_png(client, mock_fal_upload):
    """Upload a valid PNG file."""
    fake_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
    response = client.post(
        "/api/upload",
        files={"file": ("product.png", io.BytesIO(fake_png), "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "image_url" in data
    assert data["image_url"] == "https://fal.ai/storage/test-image.png"
    mock_fal_upload.assert_called_once()


def test_upload_valid_jpeg(client, mock_fal_upload):
    """Upload a valid JPEG file."""
    fake_jpg = b"\xff\xd8\xff\xe0" + b"\x00" * 100
    response = client.post(
        "/api/upload",
        files={"file": ("photo.jpg", io.BytesIO(fake_jpg), "image/jpeg")},
    )
    assert response.status_code == 200
    assert response.json()["image_url"] == "https://fal.ai/storage/test-image.png"


def test_upload_valid_webp(client, mock_fal_upload):
    """Upload a valid WEBP file."""
    fake_webp = b"RIFF" + b"\x00" * 100
    response = client.post(
        "/api/upload",
        files={"file": ("image.webp", io.BytesIO(fake_webp), "image/webp")},
    )
    assert response.status_code == 200


def test_upload_invalid_file_type(client):
    """Reject non-image files."""
    response = client.post(
        "/api/upload",
        files={"file": ("doc.pdf", io.BytesIO(b"fake pdf"), "application/pdf")},
    )
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


def test_upload_no_file(client):
    """Reject request with no file."""
    response = client.post("/api/upload")
    assert response.status_code == 422  # FastAPI validation error


def test_upload_fal_failure(client):
    """Handle fal.ai upload failure gracefully."""
    from unittest.mock import patch

    with patch(
        "services.fal_service.fal_client.upload",
        side_effect=Exception("fal storage down"),
    ):
        fake_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100
        response = client.post(
            "/api/upload",
            files={"file": ("product.png", io.BytesIO(fake_png), "image/png")},
        )
        assert response.status_code == 500
