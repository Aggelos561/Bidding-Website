
from django.urls import path
from . import bid


urlpatterns = [

    path('list-bids/', bid.BidList.as_view()),
    path('list-bids/<int:item_id>/', bid.ListBidsBasedOnItemId.as_view()),
    path('list-mybids/<int:user_id>/', bid.ListMyBids.as_view()),
]


