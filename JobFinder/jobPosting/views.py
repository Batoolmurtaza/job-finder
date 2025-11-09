from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response

from .models import Job
from .serializers import JobCreateSerializer, JobSerializer


class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    

class BusinessJobViewSet(ModelViewSet):
    
    def get_serializer_class(self):
        method = self.request.method

        if method == 'POST':
            return JobCreateSerializer
        return JobSerializer

    def get_queryset(self):
        return Job.objects.filter(business_id = self.kwargs['business_pk'])
    
    def get_serializer_context(self):
        return {
            'business_id': self.kwargs['business_pk']
        }