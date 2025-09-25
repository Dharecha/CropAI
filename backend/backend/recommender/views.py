from rest_framework.views import APIView
from rest_framework.response import Response
import joblib
import os

# Load the AI model from the file
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'crop_model.pkl')
model = joblib.load(MODEL_PATH)

class CropRecommendationView(APIView):
    """
    API view to handle crop recommendation requests.
    """
    def post(self, request, *args, **kwargs):
        # Get the data from the incoming request
        data = request.data
        
        # Ensure all required keys are present
        required_keys = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if not all(key in data for key in required_keys):
            return Response({"error": "Missing one or more required fields."}, status=400)

        try:
            # Prepare the data for the model in the correct order
            input_data = [[
                float(data['N']), float(data['P']), float(data['K']),
                float(data['temperature']), float(data['humidity']),
                float(data['ph']), float(data['rainfall'])
            ]]
            
            # Make a prediction
            prediction = model.predict(input_data)
            
            # Return the prediction in a JSON response
            return Response({'recommended_crop': prediction[0]})
            print(prediction[1])

        except (ValueError, TypeError) as e:
            return Response({"error": f"Invalid data format: {e}"}, status=400)