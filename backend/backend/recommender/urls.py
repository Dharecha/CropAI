from django.urls import path
from .views import CropRecommendationView, WeatherAPIView

urlpatterns = [
    path('recommend/', CropRecommendationView.as_view(), name='crop-recommend'),
    path('weather/', WeatherAPIView.as_view(), name='weather-data'),
]