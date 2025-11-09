from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from .views import JobViewSet

router = DefaultRouter()
router.register('job', JobViewSet)


urlpatterns = router.urls