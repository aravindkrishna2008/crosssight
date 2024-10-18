import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://external.transitapp.com/v3/public"
API_KEY = os.getenv('API_KEY')



def plan_trip(lat=None, lon=None, lat2=None, lon2=None):
    endpoint = f"{BASE_URL}/otp/plan"
    from_place = f"{lat},{lon}"
    to_place = f"{lat2},{lon2}"
    params = {
        "fromPlace": "37.3076332,-122.011484",
        "toPlace": "37.3253267,-121.9448415",
        "mode":"TRANSIT,WALK"
    }
    headers = {
        "apiKey": API_KEY,
        "Accept-Language": "en"
    }
    response = requests.get(endpoint, params=params, headers=headers)
    return response.json()

if __name__ == "__main__":
    print(plan_trip(43.653225, -79.383186, 43.653225, -79.383186))  
    print(plan_trip())