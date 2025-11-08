from django.db import models
from core.models import City, Country, Category
from django.conf import settings

# Create your models here.

class Business(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='businesses')
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    desc = models.TextField()
    service = models.TextField()
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name