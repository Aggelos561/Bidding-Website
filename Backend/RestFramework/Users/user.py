from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import User
from django.http import Http404
from rest_framework import status
from ...serializers import *
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView

class UserList(ListAPIView):

    serializer_class = UserRegisterSerializer

    def get_queryset(self):
        return User.objects.all()

    def get(self, request, format=None):
        try:
            snippets = User.objects.all()
            user_serializer = UserRegisterSerializer(snippets, many=True)
            return Response(user_serializer.data)

        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    def post(self, request, *args, **kwargs):
        user_serializer = UserRegisterSerializer(data=request.data)

        if user_serializer.is_valid():
            user_serializer.save(is_active=False)
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserDetail(APIView):

    def get_object(self, pk):
        try:
            return User.objects.get(id=pk)
        except User.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            serializer = UserRegisterSerializer(snippet)
            return Response(serializer.data)
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def put(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            serializer = UserRegisterSerializer(snippet, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    
    def delete(self, request, pk, format=None):
        try:
            snippet = self.get_object(pk)
            snippet.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

