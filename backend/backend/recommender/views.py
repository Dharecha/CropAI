import os
import joblib
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

# --- Load the AI Model ---
# This path goes up two levels to find the model file in the main backend directory
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'crop_model.pkl')
model = joblib.load(MODEL_PATH)


# --- API View for Crop Recommendation ---
class CropRecommendationView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        required_keys = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if not all(key in data for key in required_keys):
            return Response({"error": "Missing one or more required fields."}, status=400)

        try:
            input_data = [[
                float(data['N']), float(data['P']), float(data['K']),
                float(data['temperature']), float(data['humidity']),
                float(data['ph']), float(data['rainfall'])
            ]]
            prediction = model.predict(input_data)
            return Response({'recommended_crop': prediction[0]})
        except (ValueError, TypeError) as e:
            return Response({"error": f"Invalid data format: {e}"}, status=400)


# --- API View for Weather Data (using Open-Meteo) ---
class WeatherAPIView(APIView):
    def get(self, request, *args, **kwargs):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')

        if not lat or not lon:
            return Response({"error": "Latitude and longitude are required."}, status=400)
            
        # The Open-Meteo API URL for current weather in Ahmedabad
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m"
        )
        
        try:
            response = requests.get(url)
            response.raise_for_status() # Raise an exception for bad status codes
            weather_data = response.json()

            current_weather = weather_data.get('current', {})
            
            processed_data = {
                'temperature': current_weather.get('temperature_2m'),
                'humidity': current_weather.get('relative_humidity_2m'),
            }

            if processed_data['temperature'] is None or processed_data['humidity'] is None:
                 return Response({"error": "Could not parse weather data from response."}, status=500)

            return Response(processed_data)
        
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Failed to fetch weather data: {e}"}, status=500)