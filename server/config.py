import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class Config:

    MONGO_URI = os.getenv("MONGO_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALLOWED_EXTENSIONS = {"txt", "pdf", "doc", "jpg", "jpeg", "png"}
    Path("server/static/uploads").mkdir(parents=True, exist_ok=True)
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "server", "static", "uploads")
