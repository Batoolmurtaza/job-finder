from django.urls import path, include, re_path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import BusinessViewSet
from jobPosting.views import BusinessJobViewSet

router = DefaultRouter()
router.register('business', BusinessViewSet)

business_router = NestedDefaultRouter(router, "business", lookup="business")
business_router.register('jobs', BusinessJobViewSet, basename='jobs')

urlpatterns = router.urls + business_router.urls
