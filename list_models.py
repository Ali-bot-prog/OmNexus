from google import genai
import os

GEMINI_API_KEY = "AIzaSyAQcTEQHXV9fJ32K2zKjtXikFb3FJ6NU4o"

def list_models():
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        # Bazen iterasyon gerekebilir
        print("Fetching models...")
        # google-genai library specific listing
        with open("models_out.txt", "w") as f:
            for m in client.models.list():
                print(f"Model: {m.name}")
                f.write(f"{m.name}\n")
            
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
