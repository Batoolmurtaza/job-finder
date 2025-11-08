from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, CityViewSet, CategoryViewSet

router = DefaultRouter()
router.register('countries', CountryViewSet)
router.register('cities', CityViewSet)
router.register('categories', CategoryViewSet)

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
] + router.urls  
