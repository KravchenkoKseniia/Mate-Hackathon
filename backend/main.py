from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload, remove_bg, generate, recommend
import config  # triggers env loading

app = FastAPI(title="ShotGen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")
app.include_router(remove_bg.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
