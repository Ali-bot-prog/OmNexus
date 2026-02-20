import requests

BASE_URL = "http://localhost:5555"

def test_parse():
    # 1. Login
    login_url = f"{BASE_URL}/auth/login"
    login_payload = {"username": "admin", "password": "admin123"}
    
    try:
        res = requests.post(login_url, data=login_payload)
        if res.status_code != 200:
            print(f"Login Failed: {res.text}")
            return
        token = res.json()["access_token"]
        print("Login Success.")
        
        # 2. Parse Text
        parse_url = f"{BASE_URL}/tools/parse-text"
        headers = {"Authorization": f"Bearer {token}"}
        
        # Örnek İlan Metni
        sample_text = """
        Sahibinden Satılık 3+1 Daire
        İstanbul Kadıköy Caferağa Mahallesi'nde merkezi konumda.
        Brüt 120m2, Net 100m2. 5. katta, asansörlü.
        Fiyat: 15.000.000 TL
        Kombi ile ısınıyor. Eşyalı değil.
        """
        
        res = requests.post(parse_url, json={"text": sample_text}, headers=headers)
        
        if res.status_code == 200:
            print("Parse Success!")
            import json
            print(json.dumps(res.json(), indent=2, ensure_ascii=False))
        else:
            print(f"Parse Failed: {res.status_code} - {res.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_parse()
