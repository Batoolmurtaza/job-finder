from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer


class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get_permissions(self):
    #     if self.action in ['create', 'update', 'partial_update', 'destroy']:
    #         self.permission_classes = [permissions.IsAuthenticated]
    #     return super().get_permissions()