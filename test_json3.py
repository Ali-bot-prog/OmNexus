import json
d = json.load(open('next_data.json', encoding='utf-8'))

def find_list(obj, path="d"):
    if isinstance(obj, dict):
        if 'records' in obj and isinstance(obj['records'], list) and len(obj['records']) > 0:
            print(f"FOUND RECORDS: {path}['records']")
            keys = list(obj['records'][0].keys())
            print(f"Keys: {keys}")
        for k, v in obj.items():
            find_list(v, f"{path}['{k}']")
    elif isinstance(obj, list):
        if len(obj) > 0 and isinstance(obj[0], dict) and 'title' in obj[0]:
             print(f"FOUND LIST: {path}")
find_list(d)
