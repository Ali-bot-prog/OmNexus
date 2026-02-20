import requests
import io
from openpyxl import Workbook

BASE_URL = "http://localhost:5555"

def create_sample_excel():
    wb = Workbook()
    ws = wb.active
    # Headers matching logic
    ws.append(["TÜR", "İL", "İLÇE", "MAHALLE", "FİYAT", "BRÜT", "LAT", "LNG"])
    ws.append(["konut", "Ordu", "Ünye", "TestMah", 1500000, 100, 41.0, 37.0])
    
    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)
    return buf

def test_import():
    print("Preparing excel...")
    file_buf = create_sample_excel()
    files = {'file': ('test_import.xlsx', file_buf, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
    
    print("Sending POST /import/emsal...")
    try:
        res = requests.post(f"{BASE_URL}/import/emsal", files=files)
        print(f"Status: {res.status_code}")
        print("Raw Response Content:")
        print(res.content.decode('utf-8', errors='replace'))
        
        try:
            json_data = res.json()
            print("Response JSON:", json_data)
        except Exception as e:
            print("JSON Decode Failed!", e)

    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    test_import()
