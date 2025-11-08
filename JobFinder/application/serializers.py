from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.SerializerMethodField()
    job_title = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'applicant', 'resume', 'cover_letter', 
            'status', 'created_at', 'updated_at', 'applicant_name',
            'job_title'
        ]
        read_only_fields = ['applicant', 'status', 'created_at', 'updated_at']

    def get_applicant_name(self, obj):
        return obj.applicant.get_full_name()

    def get_job_title(self, obj):
        return obj.job.title

    def create(self, validated_data):
        # Assign current user as applicant
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)