import os
import sys

# Set FAL_KEY before any app imports (config.py raises ValueError without it)
os.environ["FAL_KEY"] = "test-fake-key"

# Add backend/ to sys.path so imports like `from models import ...` work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_fal_upload():
    with patch("services.fal_service.fal_client.upload") as m:
        m.return_value = "https://fal.ai/storage/test-image.png"
        yield m


@pytest.fixture
def mock_fal_remove_bg():
    with patch("services.fal_service.fal_client.subscribe") as m:
        m.return_value = {"image": {"url": "https://fal.ai/storage/cutout.png"}}
        yield m


@pytest.fixture
def mock_fal_generate():
    with patch("services.fal_service.fal_client.subscribe") as m:
        m.return_value = {
            "images": [
                {"url": "https://fal.ai/storage/shot1.png"},
            ]
        }
        yield m
