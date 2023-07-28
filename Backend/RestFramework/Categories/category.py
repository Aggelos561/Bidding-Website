from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import Category
from ...serializers import *


class CategoryList(APIView):

    serializer_class = CategorySerializer

    def get(self, request, format=None):
        snippets = Category.objects.all()
        serializer = CategorySerializer(snippets, many=True)
        return Response(serializer.data)

