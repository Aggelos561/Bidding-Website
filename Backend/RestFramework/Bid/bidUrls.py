
from django.urls import path
from . import bid


urlpatterns = [

    path('list-bids/', bid.BidList.as_view()),
    path('list-bids/<int:item_id>/', bid.ListBidsBasedOnItemId.as_view()),
    path('list-mybids/', bid.ListMyBids.as_view()),
]


