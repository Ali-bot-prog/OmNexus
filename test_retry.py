import cloudscraper
import bs4
import json
scraper = cloudscraper.create_scraper()
success = False
for i in range(5):
    try:
        r = scraper.get('https://www.emlakjet.com/satilik-konut/ordu-unye/')
        soup = bs4.BeautifulSoup(r.content, 'html.parser')
        script = soup.find('script', id='__NEXT_DATA__')
        if script:
             print('SUCCESS AT', i)
             success = True
             break
        print('FAILED AT', i)
    except Exception as e:
        print('ERROR AT', i, e)
