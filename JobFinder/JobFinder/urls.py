"""
URL configuration for JobFinder project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ Djoser URLs
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    
    # API URLs
    path('api/', include('core.urls')),
    path('api/', include('business.urls')),
    path('api/', include('jobPosting.urls')),
    path('api/', include('application.urls')),

    # Redirect root to admin for API-only backend
    path('', RedirectView.as_view(url='/admin/', permanent=False)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
