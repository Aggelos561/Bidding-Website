from rest_framework.response import Response
from rest_framework import status
from ...serializers import *
from Backend.models import UserProfile
from rest_framework import generics

class UserProfileRegister(generics.ListAPIView):

    serializer_class = UserProfileRegisterSerializer

    def get_queryset(self):
        return UserProfile.objects.all()

    def get(self, request, format=None):
        try:
            snippets = self.get_queryset()
            user_serializer = UserProfileRegisterSerializer(snippets, many=True)
            return Response(user_serializer.data)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    def post(self, request, *args, **kwargs):
        UserProfile_serializer = UserProfileRegisterSerializer(data=request.data)
        
        if UserProfile_serializer.is_valid():
            UserProfile_serializer.save()
            return Response(UserProfile_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(UserProfile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

