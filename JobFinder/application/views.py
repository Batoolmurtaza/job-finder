from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter applications based on user role"""
        user = self.request.user
        if user.is_staff:
            return Application.objects.all()
        # Regular users can only see their own applications
        return Application.objects.filter(applicant=user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update application status (staff only)"""
        if not request.user.is_staff:
            return Response(
                {"detail": "Not authorized"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        application = self.get_object()
        new_status = request.data.get('status')
        if new_status not in dict(Application.STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        return Response(ApplicationSerializer(application).data)