from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import Item
from django.http import Http404
from rest_framework import status
from ...serializers import *
from decimal import Decimal
from rest_framework_simplejwt.authentication import JWTAuthentication
from BiddingWebsite.pagination import PageNumberPaginationWithCount
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters, CharFilter
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from ...permissions import *


class CreateItems(APIView):

    serializer_class = ItemSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]
    
    def post(self, request, *args, **kwargs):
         
        self.check_permissions(request)

        serializer = ItemSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            content = str(serializer.data['id'])
            type = 'message'
            return Response({'item_id': content, 'type': type, 'status': status.HTTP_201_CREATED})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ListItems(APIView):

    def get(self, request, format=None):
        snippets = Item.objects.filter(active=True)
        serializer = ItemSerializer(snippets, many=True)
        return Response(serializer.data)



class ItemDetails(APIView):

    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = ItemSerializer(snippet)
        return Response(serializer.data)



class ItemBidAPI(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsBidder]

    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404

    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)

        self.check_object_permissions(request, snippet)

        serializer = ItemBidSerializer(snippet, data=request.data)

        if serializer.is_valid():
            snippet.currently += Decimal(request.data['currently'])
            snippet.numberofbids += 1
            snippet.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class UpdateItemAPI(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404


    def put(self, request, pk, format=None):
        snippet = self.get_object(pk)

        self.check_object_permissions(request, snippet)
         
        serializer = ItemSerializer(snippet, data=request.data)

        if serializer.is_valid():
            serializer.save()
            snippet.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    def delete(self, request, pk, format=None):
        snippet = self.get_object(pk)

        self.check_object_permissions(request, snippet)

        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class MyItemsList(ListAPIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    serializer_class = ItemSerializer
    pagination_class = PageNumberPaginationWithCount
    filter_backends = [DjangoFilterBackend, ]
    queryset = Item.objects.all()
    

    class MyItemsFilter(filters.FilterSet):

        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated, IsSeller]
        
        user = CharFilter(method='filter_user_items')

        def filter_user_items(self, queryset, seller_user, value):
            return queryset.filter(
                seller_user__user__user_id__username=value
            )

        class Meta:
            model = Item
            fields = [
                'user',
            ]    
    
    filterset_class = MyItemsFilter


class AdminListItems(ListAPIView):

    pagination_class = PageNumberPaginationWithCount
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemChecker(APIView):

    def get_object(self, item_id):
        try:
            return Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            raise Http404
    
    def get(self, request, item_id, format=None):
        item_object = self.get_object(item_id)
        
        json_object = {
            "active": item_object.active,
            "numberofbids": item_object.numberofbids,
            'status': status.HTTP_200_OK
        }
        return Response(json_object)
