from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Business
from .serializers import BusinessCreateSerializer, BusinessSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions, status


class BusinessViewSet(ModelViewSet):
    queryset = Business.objects.all()

    def perform_create(self, serializer):
        # assign the currently authenticated user as the owner of the business
        serializer.save(user=self.request.user)

    def get_serializer_class(self):
        
        method = self.request.method
        if method == 'POST':
            return BusinessCreateSerializer
        return BusinessSerializer
    
    def get_serializer_context(self):
        return {
            "user_id": self.request.user.id
        }
