import requests
from bs4 import BeautifulSoup
import sys

def scrape_demo(url):
    print(f"Scraping URL: {url}")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print("Failed to retrieve page.")
            return

        soup = BeautifulSoup(response.content, "lxml")
        
        # 1. Title
        title = soup.title.string.strip() if soup.title else "No Title"
        print(f"Page Title: {title}")
        
        # 2. Meta Description / OG Tags
        og_title = soup.find("meta", property="og:title")
        if og_title: print(f"OG Title: {og_title.get('content')}")
        
        og_price = soup.find("meta", property="product:price:amount") # Bazen e-ticaret sitelerinde olur
        if og_price: print(f"OG Price: {og_price.get('content')}")

        # 3. Spesifik Site Denemeleri (Örnek: Sahibinden yapısı - classlar sürekli değişir ama deneyelim)
        # Not: Sahibinden bot koruması çok güçlüdür, requests ile gelmeyebilir.
        
        # Örnek Fiyat: Genelde 'price' veya 'classified-price' class'larında olur
        price_tag = soup.find(class_="classified-price")
        if price_tag:
             print(f"Found Price Tag: {price_tag.text.strip()}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_url = "https://www.sahibinden.com/" # Anasayfa testi
    if len(sys.argv) > 1:
        test_url = sys.argv[1]
    scrape_demo(test_url)
