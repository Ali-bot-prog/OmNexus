import json
d = json.load(open('next_data.json', encoding='utf-8'))

def find_mabel(obj, path="d"):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if "Mabel" in str(k):
                print(f"{path}[{repr(k)}]")
            find_mabel(v, f"{path}[{repr(k)}]")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            find_mabel(v, f"{path}[{i}]")
    elif isinstance(obj, str):
        if "Mabel" in obj:
            print(f"{path} = {repr(obj[:50])}...")
            
find_mabel(d)
