from core.serializers import CategorySerializer, CitySerializer
from .models import Business
from rest_framework import serializers
from core.models import City, Category, Country


class BusinessSerializer(serializers.ModelSerializer):

    city = CitySerializer()
    category = CategorySerializer()

    class Meta:
        model = Business
        fields = ['id', 'name', 'address', 'phone_number', 'email', 'desc', 'service', 'city', 'category']
class BusinessCreateSerializer(serializers.ModelSerializer):
    
    # Set user read-only and assign on create in the viewset
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())


    class Meta:
        model = Business
        # include write-only helper fields so DRF recognizes them
        fields = [
            'id', 'user', 'name', 'address', 'phone_number', 'email', 'desc', 'service',
            'city', 'category'
        ]

    def create(self, validated_data):
        return Business.objects.create(
            user_id = self.context['user_id'],
            **validated_data
        )
