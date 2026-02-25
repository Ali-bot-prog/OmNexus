import cloudscraper
import json
from bs4 import BeautifulSoup

scraper = cloudscraper.create_scraper()
url = "https://www.emlakjet.com/satilik-konut/ordu-unye/"
resp = scraper.get(url)

if resp.status_code == 200:
    soup = BeautifulSoup(resp.content, "html.parser")
    script = soup.find("script", id="__NEXT_DATA__")
    if script:
        data = json.loads(script.string)
        with open("next_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print("Saved next_data.json")
    else:
        print("No __NEXT_DATA__ found")
