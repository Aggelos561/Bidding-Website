from Backend.models import  Item
from ...serializers import *
from rest_framework.generics import ListAPIView
from BiddingWebsite.pagination import PageNumberPaginationWithCount
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters, CharFilter, RangeFilter
from django.db.models import Q


class ItemFilter(filters.FilterSet):
    
    category__name = CharFilter(method='filter_categories')
    name = CharFilter(method='filter_name')
    buyprice = RangeFilter()
    currently = RangeFilter()
    location = CharFilter(method='filter_location')
    
    def filter_categories(self, queryset, category__name, value):
        try:
            if value:
                categories = value.split(',')
                
                for category in categories:
                    criterion = Q(category__name__contains=category)
                    queryset = queryset.filter(criterion)
     
        except ValueError:
            pass
        
        return queryset


    def filter_name(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )


    def filter_location(self, queryset, location, value):
        return queryset.filter(
            Q(location__icontains=value) | Q(country__icontains=value)
        )


    class Meta:
        model = Item
        fields = [
            'category__name',
            'name',
            'currently',
            'buyprice',
            'location'
        ]



class ApiItemListView(ListAPIView):

    queryset = Item.objects.filter(active=True)
    serializer_class = ItemSerializer
    pagination_class = PageNumberPaginationWithCount
    filter_backends = [DjangoFilterBackend, ]
    filterset_class = ItemFilter