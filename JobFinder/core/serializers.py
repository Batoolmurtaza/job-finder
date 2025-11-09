from core.models import Country, City, Category
from business.models import Business
from rest_framework import serializers


class UserSerializer(serializers.Serializer):

    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    is_superuser = serializers.BooleanField(read_only=True)
    has_business = serializers.SerializerMethodField()
    business = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_has_business(self, obj):
        ### Returns true if user has a business or else returns false.
        return Business.objects.filter(user = obj.id).exists()  
    
    def update(self, instance, validated_data):
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SimpleUserSerializer(serializers.Serializer):

    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()
    email = serializers.EmailField()


    def get_name(self, user):
        return f'{str(user.first_name)} {str(user.last_name)}'


class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = ['id', 'name', 'country', 'zip_code']


class CountrySerializer(serializers.ModelSerializer):

    cities = CitySerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = ['id', 'name', 'cities']


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id', 'name']
