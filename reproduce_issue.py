import requests
import json

BASE_URL = "http://localhost:5555"

def test_add_emsal():
    payload = {
        "tur": "konut",
        "il": "TestIl",
        "ilce": "TestIlce",
        "mahalle": "TestMah",
        "fiyat": 1000000,
        "brut_m2": 100,
        "lat": 41.0,
        "lng": 29.0,
        "created_at": "2024-01-01"
    }
    
    print("Sending POST /emsal...")
    try:
        res = requests.post(f"{BASE_URL}/emsal", json=payload)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
        
        if res.status_code == 200:
            data = res.json()
            new_id = data.get("id")
            print(f"Created ID: {new_id}")
            return new_id
    except Exception as e:
        print(f"POST Failed: {e}")
        return None

def test_list_emsal(new_id):
    print("\nSending GET /emsal...")
    try:
        res = requests.get(f"{BASE_URL}/emsal?limit=5")
        print(f"Status: {res.status_code}")
        data = res.json()
        found = False
        for item in data:
            if item["id"] == new_id:
                print(f"SUCCESS: Found created item {new_id}")
                found = True
                break
        
        if not found:
            print("FAILURE: Created item not found in list (checking top 5)")
            print(f"List: {[i['id'] for i in data]}")

    except Exception as e:
        print(f"GET Failed: {e}")

if __name__ == "__main__":
    nid = test_add_emsal()
    if nid:
        test_list_emsal(nid)
