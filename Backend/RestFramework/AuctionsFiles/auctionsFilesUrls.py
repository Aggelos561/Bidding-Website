from django.urls import path
from . import auctionsFiles


urlpatterns = [

    path('create-auction-files/', auctionsFiles.CreateAuctionFiles.as_view()),
    path('auctions-json/', auctionsFiles.RetrieveJson.as_view()),
    path('auctions-xml/', auctionsFiles.RetrieveXML.as_view()),

]