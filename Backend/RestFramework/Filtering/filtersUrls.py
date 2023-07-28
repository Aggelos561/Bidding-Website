from django.urls import path
from . import filters


urlpatterns = [

    path('items-paging/', filters.ApiItemListView.as_view(), name='Item Filtering'),

]
