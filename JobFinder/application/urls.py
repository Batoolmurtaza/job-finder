from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ApplicationViewSet

router = DefaultRouter()
router.register('applications', ApplicationViewSet)

urlpatterns = router.urls