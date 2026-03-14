import os
from dotenv import load_dotenv

load_dotenv()

FAL_KEY = os.getenv("FAL_KEY")
if not FAL_KEY:
    raise ValueError("FAL_KEY environment variable is required")

os.environ["FAL_KEY"] = FAL_KEY  # fal_client reads from env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
