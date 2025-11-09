from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id', 'business', 'title', 'description', 'company', 'city',
            'is_remote', 'category', 'experience_level', 'salary_min',
            'salary_max', 'working_hours', 'requirements', 'deadline',
            'application_url', 'contact_email', 'contact_phone',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class JobCreateSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        return Job.objects.create(
            business_id = self.context['business_id'],
            ** validated_data
        )

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'company', 'city',
            'is_remote', 'category', 'experience_level', 'salary_min',
            'salary_max', 'working_hours', 'requirements', 'deadline',
            'application_url', 'contact_email', 'contact_phone',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']