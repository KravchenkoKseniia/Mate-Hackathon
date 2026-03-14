from pydantic import BaseModel


class RemoveBgRequest(BaseModel):
    image_url: str


class RemoveBgResponse(BaseModel):
    cutout_url: str


class GenerateRequest(BaseModel):
    image_url: str
    scenes: list[str]  # list of scene prompt strings


class GeneratedScene(BaseModel):
    scene_name: str
    images: list[str]


class GenerateResponse(BaseModel):
    results: list[GeneratedScene]


class UploadResponse(BaseModel):
    image_url: str
