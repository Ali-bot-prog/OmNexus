import json
d = json.load(open('next_data.json', encoding='utf-8'))

found = False
def find_list(obj):
    global found
    if found: return
    if isinstance(obj, dict):
        if 'records' in obj and isinstance(obj['records'], list) and len(obj['records']) > 0:
            if 'title' in obj['records'][0]:
                with open("listing_sample.json", "w", encoding="utf-8") as f:
                    json.dump(obj['records'][0], f, indent=2, ensure_ascii=False)
                found = True
                return
        for k, v in obj.items():
            find_list(v)
    elif isinstance(obj, list):
        if len(obj) > 0 and isinstance(obj[0], dict) and 'title' in obj[0]:
             with open("listing_sample.json", "w", encoding="utf-8") as f:
                 json.dump(obj[0], f, indent=2, ensure_ascii=False)
             found = True
             return
        for i in obj:
            find_list(i)

find_list(d)
print("Done")
