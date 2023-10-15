from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from Backend.models import Bid
from django.http import Http404
from rest_framework import status
from BiddingWebsite.pagination import PageNumberPaginationWithCount
from ...serializers import *
from BiddingWebsite.settings import *
from ...permissions import *


class BidList(APIView):
    
    serializer_class = BidSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        snippets = Bid.objects.all()
        serializer = BidSerializer(snippets, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        serializer = BidSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListBidsBasedOnItemId(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, item_id):
        try:
            return Bid.objects.filter(item=item_id)
        except Bid.DoesNotExist:
            raise Http404

    def manipulate_bid(self, bid):
        bid["bidder_user"] = UserProfile.objects.get(id=bid["bidder_user"]).user_id.username
        bid["username"] = bid.pop("bidder_user")
        del bid["id"]
        bid["item_id"] = bid.pop("item")
        

    def get(self, request, item_id, format=None):

        bidObject = self.get_object(item_id)
        serializer = BidSerializer(bidObject, many=True)

        for bid in serializer.data:
           self.manipulate_bid(bid)

        return Response(serializer.data)


class ListMyBids(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsBidder]

    pagination_class = PageNumberPaginationWithCount
    
    def get(self, request, format=None):

        paginator = PageNumberPaginationWithCount()
        bidsObject = Bid.objects.filter(bidder_user=request.user.id).values("item").distinct()
        items_with_bid = []

        for bid in bidsObject:
            items_with_bid.append(Item.objects.get(id=bid["item"]))

        result_page = paginator.paginate_queryset(items_with_bid, request)
        
        serializer = ItemSerializer(result_page, many=True)
        total_pages = int(len(bidsObject)/REST_FRAMEWORK["PAGE_SIZE"])
        upper_bound_pages = int(len(bidsObject)%REST_FRAMEWORK["PAGE_SIZE"])

        total_pages = total_pages + 1 if upper_bound_pages > 0 else total_pages

        results = {
            "total_pages": total_pages,
            "results" : []
        }

        for item in serializer.data:
            results["results"].append(item)

        return Response(results)
