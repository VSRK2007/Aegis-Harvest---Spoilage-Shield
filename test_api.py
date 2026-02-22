"""
Simple test script to verify backend API is working
Run this after starting the backend server
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("=" * 60)
    print("Testing Aegis Harvest API")
    print("=" * 60)
    
    # Test root endpoint
    print("\n1. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return False
    
    # Test telemetry endpoint
    print("\n2. Testing telemetry endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/telemetry")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Temperature: {data['temperature']}°C")
        print(f"   Humidity: {data['humidity']}%")
        print(f"   Vibration: {data['vibration']}G")
    except Exception as e:
        print(f"   ERROR: {e}")
        return False
    
    # Test prediction endpoint
    print("\n3. Testing prediction endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/prediction")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Days Left: {data['days_left']} days")
        print(f"   Status: {data['status']}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return False
    
    # Test chaos toggle
    print("\n4. Testing chaos mode toggle...")
    try:
        response = requests.post(f"{BASE_URL}/api/chaos")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Chaos Mode: {data['chaos_mode']}")
        print(f"   Days Left: {data['days_left']} days")
    except Exception as e:
        print(f"   ERROR: {e}")
        return False
    
    # Test reroute calculation
    print("\n5. Testing reroute calculation...")
    try:
        reroute_data = {
            "road_condition": "Smooth",
            "cap_pct_center_a": 70,
            "cap_pct_center_b": 65,
            "travel_time_original": 5,
            "travel_time_center_a": 3,
            "travel_time_center_b": 4
        }
        response = requests.post(
            f"{BASE_URL}/api/reroute",
            json=reroute_data
        )
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Best Center: {data['best_center']}")
        print(f"   Recommendation: {data['recommendation']}")
        print(f"   Survival Margins: {data['survival_margins']}")
    except Exception as e:
        print(f"   ERROR: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("All tests passed! ✅")
    print("=" * 60)
    return True

if __name__ == "__main__":
    print("\nMake sure the backend server is running on http://localhost:8000")
    print("Press Enter to start testing...")
    input()
    
    success = test_endpoints()
    
    if not success:
        print("\n❌ Some tests failed. Check that:")
        print("   1. Backend server is running")
        print("   2. Port 8000 is accessible")
        print("   3. All dependencies are installed")
