from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet

router = DefaultRouter()
router.register('business', BusinessViewSet)

urlpatterns = router.urls
