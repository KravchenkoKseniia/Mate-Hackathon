import pytest
from pydantic import ValidationError

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from models import (
    RemoveBgRequest,
    RemoveBgResponse,
    GenerateRequest,
    GenerateResponse,
    GeneratedScene,
    UploadResponse,
)


def test_remove_bg_request_valid():
    req = RemoveBgRequest(image_url="https://example.com/img.png")
    assert req.image_url == "https://example.com/img.png"


def test_remove_bg_request_missing_url():
    with pytest.raises(ValidationError):
        RemoveBgRequest()


def test_generate_request_valid():
    req = GenerateRequest(
        image_url="https://example.com/img.png",
        scenes=["minimalist-studio", "beach-sunset"],
    )
    assert len(req.scenes) == 2


def test_generate_request_empty_scenes():
    req = GenerateRequest(image_url="https://example.com/img.png", scenes=[])
    assert req.scenes == []


def test_generate_response_structure():
    resp = GenerateResponse(
        results=[
            GeneratedScene(
                scene_name="Test",
                images=["https://example.com/a.png", "https://example.com/b.png"],
            )
        ]
    )
    assert len(resp.results) == 1
    assert resp.results[0].scene_name == "Test"
    assert len(resp.results[0].images) == 2


def test_upload_response():
    resp = UploadResponse(image_url="https://fal.ai/storage/uploaded.png")
    assert resp.image_url == "https://fal.ai/storage/uploaded.png"
