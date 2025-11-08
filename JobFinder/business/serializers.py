from .models import Business
from rest_framework import serializers
from core.models import City, Category, Country


class BusinessCreateSerializer(serializers.ModelSerializer):
    # Set user read-only and assign on create in the viewset
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    # Allow either an existing PK for city/category or provide a new name via
    # city_name/category_name (write-only). PrimaryKeyRelatedField is used
    # for the existing relationship when frontend sends an id.
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    # If the frontend wants to create a new City/Category on the fly it can
    # send these write-only fields instead of an id.
    city_name = serializers.CharField(write_only=True, required=False)
    category_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Business
        # include write-only helper fields so DRF recognizes them
        fields = [
            'id', 'user', 'name', 'address', 'phone_number', 'email', 'desc', 'service',
            'city', 'category', 'city_name', 'category_name'
        ]

    def create(self, validated_data):
        # Pop any helper name fields
        city_name = validated_data.pop('city_name', None)
        category_name = validated_data.pop('category_name', None)

        # If a PK was provided for city/category they'll already be in validated_data
        city = validated_data.get('city')
        category = validated_data.get('category')

        # Create or get city by name if name provided and PK not provided.
        # City model requires a country and zip_code; when creating on-the-fly
        # we provide a fallback Country named 'Unknown' (created if missing)
        # and an empty zip_code.
        if not city and city_name:
            normalized_city = city_name.strip()
            # ensure a fallback country exists
            fallback_country, _ = Country.objects.get_or_create(name='Unknown')
            city_obj, _ = City.objects.get_or_create(
                name=normalized_city,
                defaults={'country': fallback_country, 'zip_code': ''}
            )
            validated_data['city'] = city_obj

        if not category and category_name:
            normalized_cat = category_name.strip()
            cat_obj, _ = Category.objects.get_or_create(name=normalized_cat)
            validated_data['category'] = cat_obj

        return super().create(validated_data)

