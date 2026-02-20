import requests

BASE_URL = "http://localhost:5555"

def test_login():
    url = f"{BASE_URL}/auth/login"
    payload = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, data=payload) # Form-data olarak gider
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("Login Successful!")
            print("Token:", response.json().get("access_token")[:20] + "...")
        else:
            print("Login Failed:", response.text)
            
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_login()
