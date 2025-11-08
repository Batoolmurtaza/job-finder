from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User

from core.models import Country, City, Category
from rest_framework.renderers import JSONRenderer
from rest_framework.viewsets import ModelViewSet

from .serializers import CountrySerializer, UserSerializer, CitySerializer, CategorySerializer


# Create your views here.

def user_details(request):
    user = User.objects.get(id=1)
    serializer = UserSerializer(user)
    json_data = JSONRenderer().render(serializer.data)
    return HttpResponse()


class CountryViewSet(ModelViewSet):

    queryset = Country.objects.all()
    serializer_class = CountrySerializer

class CityViewSet(ModelViewSet):

    queryset = City.objects.all()
    serializer_class = CitySerializer
    
class CategoryViewSet(ModelViewSet):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer