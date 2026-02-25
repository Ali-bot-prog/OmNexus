from curl_cffi import requests

def test():
    url = "https://www.emlakjet.com/satilik-konut/ordu-unye/"
    print(f"Testing {url} with curl_cffi")
    try:
        response = requests.get(url, impersonate="chrome110", timeout=20)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            if "__NEXT_DATA__" in response.text:
                print("SUCCESS: Found __NEXT_DATA__")
            else:
                print("FAILED: __NEXT_DATA__ not found (likely Cloudflare challenge)")
                # Print a bit of the text
                print(response.text[:500])
        else:
            print(f"FAILED: Status {response.status_code}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test()
