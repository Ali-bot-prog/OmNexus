import cloudscraper
from bs4 import BeautifulSoup
import re

scraper = cloudscraper.create_scraper()
url = "https://www.emlakjet.com/satilik-konut/ordu-unye/"
print("Fetching...", url)
resp = scraper.get(url)

with open("output.txt", "w", encoding="utf-8") as f:
    f.write(f"Status: {resp.status_code}\n")
    if resp.status_code == 200:
        soup = BeautifulSoup(resp.content, "html.parser")
        items = soup.find_all("div", class_=re.compile(r"manat-wrapper|manat-card|manat-home.*|listing-item"))
        if not items:
            items = soup.find_all("a", href=re.compile(r"/ilan/"))
        
        f.write(f"Found {len(items)} items.\n")
        for idx, item in enumerate(items[:2]):
            f.write(f"\n====== TEXT {idx} ======\n")
            f.write(item.get_text(separator="\n", strip=True))
            
            f.write(f"\n====== HTML {idx} ======\n")
            f.write(str(item))
