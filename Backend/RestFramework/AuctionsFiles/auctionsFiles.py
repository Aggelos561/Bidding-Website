from typing import OrderedDict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser
from Backend.models import Item, Bid, Seller
from django.http import Http404
from ...serializers import *
from django.http import HttpResponse
from BiddingWebsite.settings import *
from rest_framework import status
import xml.etree.cElementTree as ET
import os, os.path
import json



class CreateAuctionFiles(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    json_file = os.path.join(AUCTION_FILES_ROOT, "AuctionData.json")
    xml_file = os.path.join(AUCTION_FILES_ROOT, "AuctionData.xml")


    def generate_json(self):
        f = open(self.json_file, "w+")
 
        all_items_dict = OrderedDict()
        all_items_dict_list = []

        query = f""" SELECT 1 as id, id as item_id
                     FROM item 
                """
        
        for item_id in list(Item.objects.raw(query)):

            item_obj = Item.objects.get(id=item_id.item_id)

            item_serializer = ItemAsFileSerializer(item_obj)


            query = f""" SELECT 1 as id, time as Time, amount as Amount, rating as Rating , username as UserID, UserProfile.country as Country, 
                        UserProfile.location as Location FROM bid, bidder, auth_user, UserProfile, item WHERE auth_user.id = UserProfile.id_user 
                        AND UserProfile.id = bidder.User_ID AND bid.item_id = item.id AND bidder.User_ID = bid.Bidder_User_ID AND bid.item_id = {item_id.item_id}
                    """ 

            bids_list = list(Bid.objects.raw(query))

            bids_dict_list = list()

            for bid in bids_list:
                bids_dict_list.append({"Bid":{
                    "Time": str(bid.Time),
                    "Amount": "$" + str(bid.Amount),
                    "UserID": str(bid.UserID),
                    "Rating": str(bid.Rating),
                    "Country": str(bid.Country),
                    "Location": str(bid.Location)
                }})
                
        
            seller_obj = Seller.objects.get(user=item_obj.seller_user)
              

            item_dict= OrderedDict((item_serializer.data))
            item_dict["currently"] = "$" + item_dict["currently"]
            item_dict["firstbid"] = "$" + item_dict["firstbid"]


            item_dict['UserID'] = str(item_obj.seller_user)
            item_dict["Rating"] = seller_obj.rating
            item_dict["Bids"] = bids_dict_list

            all_items_dict_list.append(item_dict)

        
        all_items_dict["items"] = all_items_dict_list
        f.write(json.dumps(all_items_dict))

        f.close()


    def generate_XML(self):

        f = open(self.xml_file, "w+")
        
        root = ET.Element("items")


        query = f""" SELECT 1 as id, id as item_id
                     FROM item 
                """

        for item_id in list(Item.objects.raw(query)):

            item_obj = Item.objects.get(id=item_id.item_id)
            item_serializer = ItemAsFileSerializer(item_obj)

            seller_obj = Seller.objects.get(user=item_obj.seller_user)
            item_dict = OrderedDict(item_serializer.data)

            item = ET.SubElement(root, "Item", ItemID=str(item_id.item_id))
        
            name = ET.SubElement(root, "Name")
            name.text = item_obj.name

            for category in item_dict['category']:
                cat_element = ET.SubElement(item, "Category")
                cat_element.text = category

            
            currently = ET.SubElement(root, "Currently")
            currently.text = "$" + str(item_dict['currently'])

            first_bid = ET.SubElement(root, "First_Bid")
            first_bid.text = "$" + str(item_dict['firstbid'])

            number_of_bids = ET.SubElement(root, "Number_Of_Bids")
            number_of_bids.text = str(item_dict['numberofbids'])

            
            
            bids = ET.SubElement(root, "Bids")
            

            query = f""" SELECT 1 as id, time as Time, amount as Amount, rating as Rating , username as UserID, UserProfile.country as Country, 
                        UserProfile.location as Location FROM bid, bidder, auth_user, UserProfile, item WHERE auth_user.id = UserProfile.id_user 
                        AND UserProfile.id = bidder.User_ID AND bid.item_id = item.id AND bidder.User_ID = bid.Bidder_User_ID AND bid.item_id = {item_id.item_id}
                    """

            bids_list = list(Bid.objects.raw(query))


            for bid in bids_list:
                bid_element = ET.SubElement(bids, "Bid")
                bidder_element = ET.SubElement(bid_element, "Bidder", Rating=str(bid.Rating), UserID=str(bid.UserID))
                location = ET.SubElement(bidder_element, "Location")
                location.text = str(bid.Location)
                country = ET.SubElement(bidder_element, "Country")
                country.text = str(bid.Country)
                time = ET.SubElement(bid_element, "Time")
                time.text = str(bid.Time)
                amount = ET.SubElement(bid_element, "Amount")
                amount.text = "$" + str(bid.Amount)

            location = ET.SubElement(item, "Location") if item_dict['latitude'] is None else ET.SubElement(item, "Location", Latitude=item_dict['latitude'], Longitude=item_dict['longitude'])
            location.text = str(item_dict['location'])

            country = ET.SubElement(item, "Country")
            country.text = str(item_dict['country'])

            started = ET.SubElement(item, "Started")
            started.text = str(item_dict['started'])

            ends = ET.SubElement(item, "Ends")
            ends.text = str(item_dict['ends'])

            seller = ET.SubElement(item, "Seller", Rating=str(seller_obj.rating), UserID=str(item_obj.seller_user))
            
            description = ET.SubElement(item, "Description")
            description.text = str(item_dict['description'])

            tree = ET.ElementTree(root)
            tree.write(self.xml_file)


        f.close()




    def post (self, request, format=None):

        try:
            if os.path.exists(self.json_file):
                os.remove(self.json_file)

            if os.path.exists(self.xml_file):
                os.remove(self.xml_file)

            self.generate_json()
            self.generate_XML()

            return Response(status=status.HTTP_201_CREATED)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class RetrieveJson(APIView):

    authentication_classes = [JWTAuthentication]

    json_file = os.path.join(AUCTION_FILES_ROOT, "AuctionData.json")

    def get(self, request, format=None):
       
        file_path1 = self.json_file

        if os.path.exists(file_path1):
            with open(file_path1, 'r') as f1:
                response = HttpResponse(f1.read(), content_type="application/force-download")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path1)
                return response

        raise Http404
    



class RetrieveXML(APIView):
    
    authentication_classes = [JWTAuthentication]

    xml_file = os.path.join(AUCTION_FILES_ROOT, "AuctionData.xml")

    def get(self, request, format=None):
       
        file_path = self.xml_file

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/force-download")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response

        raise Http404
