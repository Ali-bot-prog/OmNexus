"""Central configuration and constants for the Omnexus project.

Moving hard‑coded paths, API keys and other environment details here keeps the
codebase DRY and makes it easier to change settings without touching multiple
scripts. Other modules should import from this file rather than recreating
constants themselves.
"""
import os

# base directory where the SQLite database and other persistent files live
BASE_DIR = os.path.join(os.path.expanduser("~"), "PusulaGayrimenkulV5_2")
DB_PATH = os.path.join(BASE_DIR, "db.sqlite")

# server configuration
APP_TITLE = "OmNexus - Akıllı Emlak Platformu"
PORT = int(os.getenv("PORT", 5555))

# security / tokens
SECRET_KEY = os.getenv("SECRET_KEY", "super-gizli-anahtar-degistirilecek")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

# LLM configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# ensure base directory exists
os.makedirs(BASE_DIR, exist_ok=True)
