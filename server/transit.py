import requests

import os
from dotenv import load_dotenv

load_dotenv()

# Define the base URL and the API key
BASE_URL = "https://external.transitapp.com/v3/public"

# open api key from .env
API_KEY = os.getenv('API_KEY')

def get_nearby_routes(lat, lon, max_distance=150, should_update_realtime=True):
    endpoint = f"{BASE_URL}/nearby_routes"
    params = {
        "lat": lat,
        "lon": lon,
        "max_distance": max_distance,
        "should_update_realtime": should_update_realtime
    }
    headers = {
        "apiKey": API_KEY,
        "Accept-Language": "en"
    }
    response = requests.get(endpoint, params=params, headers=headers)
    return response.json()

def get_nearby_stops(lat, lon, max_distance=150, stop_filter="Routable"):
    endpoint = f"{BASE_URL}/nearby_stops"
    params = {
        "lat": lat,
        "lon": lon,
        "max_distance": max_distance,
        "stop_filter": stop_filter
    }
    headers = {
        "apiKey": API_KEY,
        "Accept-Language": "en"
    }
    response = requests.get(endpoint, params=params, headers=headers)
    return response.json()

def plan_trip(from_place, to_place, date=None, time=None, mode="TRANSIT,WALK", num_itineraries=3, arrive_by=False):
    print(from_place, to_place)
    endpoint = f"{BASE_URL}/otp/plan"
    params = {
        "fromPlace": from_place,
        "toPlace": to_place,
        "date": date,
        "time": time,
        "mode": mode,
        "numItineraries": num_itineraries,
        "arriveBy": arrive_by
    }
    headers = {
        "apiKey": API_KEY,
        "Accept-Language": "en"
    }
    response = requests.get(endpoint, params=params, headers=headers)
    return response.json()

def get_available_networks(lat=None, lon=None, include_all_networks=False):
    endpoint = f"{BASE_URL}/available_networks"
    params = {
        "lat": lat,
        "lon": lon,
        "include_all_networks": include_all_networks
    }
    headers = {
        "apiKey": API_KEY,
        "Accept-Language": "en"
    }
    response = requests.get(endpoint, params=params, headers=headers)
    return response.json()

# Example usage
if __name__ == "__main__":
    lat = 45.526168077787894
    lon = -73.59506067289408
    print("Nearby Routes:", get_nearby_routes(lat, lon))
    print("Nearby Stops:", get_nearby_stops(lat, lon))
    from_place = "37.3076332, -122.011484"
    to_place = "37.3253267,-121.9448415"
    print("Plan Trip:", plan_trip(from_place, to_place))
    print("Available Networks:", get_available_networks())
