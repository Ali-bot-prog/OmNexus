import json, re

html = open('emlakjet_test.html','r',encoding='utf-8').read()
match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
if match:
    data = json.loads(match.group(1))
    props = data.get('props',{}).get('pageProps',{}).get('initialState',{}).get('listing',{}).get('aggs',{}).get('searchResponse',{}).get('hits',{}).get('hits',[])
    if props:
      for p in props[:3]:
        print(p.get('_source', {}).get('titleTr', 'No title'))
        print(p.get('_source', {}).get('price', 0))
    else:
      print("JSON hits array empty.")
else:
    print("NEXT_DATA block not found.")
