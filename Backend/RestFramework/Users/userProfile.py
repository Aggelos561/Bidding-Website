from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import User, UserProfile
from django.http import Http404
from rest_framework import status
from ...serializers import *
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from BiddingWebsite.pagination import PageNumberPaginationWithCount
from rest_framework.permissions import IsAdminUser, IsAuthenticated

class UserProfileList(ListAPIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    pagination_class = PageNumberPaginationWithCount
    serializer_class = UserProfileRegisterSerializer
    queryset = UserProfile.objects.all().order_by("-id")

    def post(self, request, *args, **kwargs):
        userProfileSerializer = UserProfileRegisterSerializer(data=request.data)

        if userProfileSerializer.is_valid():
            userProfileSerializer.save(is_active=False)
            return Response(userProfileSerializer.data, status=status.HTTP_201_CREATED)
        
        return Response(userProfileSerializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UsernameProfileDetail(APIView):

    serializer_class = UserProfileRegisterSerializer
    authentication_classes = [JWTAuthentication]

    def get_user_object(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404
    
    def get(self, request, username, format=None):
        try:
            user_snippet = self.get_user_object(username)
            profile_snippet = UserProfile.objects.get(user_id=user_snippet)
            userProfileSerializer = UserProfileRegisterSerializer(profile_snippet)
            return Response(userProfileSerializer.data)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

class IdProfileDetail(APIView):

    serializer_class = UserProfileRegisterSerializer

    def get_profile_object(self, profile_id):
        try:
            return UserProfile.objects.get(id=profile_id)
        except UserProfile.DoesNotExist:
            raise Http404
    
    def get(self, request, profile_id, format=None):
        try:
            profile_snippet = self.get_profile_object(profile_id)
            userProfileSerializer = UserProfileRegisterSerializer(profile_snippet)
            userProfileSerializer_data = userProfileSerializer.data
            userProfileSerializer_data["rating"] = Seller.objects.get(user__id=profile_id).rating
            return Response(userProfileSerializer_data)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UpdateUserProfile(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = UserProfileUpdateSerializer

    def get_user_object(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404

    def put(self, request, username, format=None):
        try:
            user_instance = self.get_user_object(username)
            userProfileSerializer = UserProfileUpdateSerializer(user_instance, data=request.data)

            if userProfileSerializer.is_valid():
                userProfileSerializer.save()
                return Response(userProfileSerializer.data, status=status.HTTP_201_CREATED)
            return Response(userProfileSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
