from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from Backend.models import Item, Category, User, UserProfile, Bidder, Seller, Picture, Bid
from datetime import datetime, timedelta
import xml.etree.ElementTree as ET
from BiddingWebsite import settings
import os
import random
from decimal import Decimal

class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str)
        parser.add_argument('limit_count', type=int)

    def remove_apersands(self, filename):
        with open(filename, 'r') as file :
            filedata = file.read()
            filedata = filedata.replace('&amp;', 'and')
            filedata = filedata.replace('&', 'and')
            with open(filename, 'w') as file:
                file.write(filedata)
    
    def create_user(self, username, rating, location, country):
        if not User.objects.filter(username=username).exists():
            user = User.objects.create(username=username, password=make_password("root123!@#"), is_active=True, first_name=username, last_name=username, email=username+"@mail.org")
            userprofile = UserProfile.objects.create(TIN=str(random.randint(1_000_000_000, 9_999_999_999)), phoneNumber=str(random.randint(1_000_000_000, 9_999_999_999)), location=location, country=country, user_id=user)
            seller = Seller.objects.create(user=userprofile, rating=int(rating))
            bidder = Bidder.objects.create(user=userprofile, rating=int(rating))
            return userprofile.id
    
        return UserProfile.objects.get(user_id=User.objects.get(username=username)).id

    def create_bid(self, item_id, bidder_id, amount, bid_time):
        bid_time = datetime.now() + timedelta(minutes=bid_time)
        Bid.objects.create(time=bid_time.replace(second=0, microsecond=0), amount=amount, item_id=item_id, bidder_user_id=bidder_id)


    def create_item(self, name, categories, number_of_bids, firstbid, currently, buyprice, description, location, country, latitude, longitude, seller):
        item_instance = Item.objects.create(name=name, numberofbids=number_of_bids, firstbid=firstbid, currently=currently, buyprice=buyprice, description=description, location=location, country=country, latitude=latitude, longitude=longitude, seller_user_id=seller, active=True, started=datetime.now().replace(second=0, microsecond=0), ends=datetime.now().replace(month=datetime.now().month + 1, second=0, microsecond=0))
        for category in categories:
            item_instance.category.add(category)

        url = "/DefaultImage/noImageAvailable.png"
        Picture.objects.create(item=item_instance, url=url)

        return item_instance.id

    def parse_xml(self, filename, limit_count):
        tree = ET.parse(filename)
        root = tree.getroot()
        count = 0

        for item in root:
           
            categories = []
            for category in item.findall('Category'):
                Category.objects.get_or_create(name=category.text)
                categories.append(category.text)

            if item.find("Description") == None or len(categories) == 0 or item.find("Location") == None or item.find("Country") == None:
                continue

            seller_username = item.find("Seller").attrib.get("UserID")
            seller_rating = item.find("Seller").attrib.get("Rating")
            seller_location = item.find("Location").text
            seller_country = item.find("Country").text
            
            if seller_location == None or seller_country == None:
                continue

            self.create_user(seller_username, seller_rating, seller_location, seller_country)

            item_name = item.find("Name").text
            print("Item --> " + str(item_name))
            item_currenlty = Decimal(item.find("Currently").text.replace("$", ""))
            item_firstbid = Decimal(item.find("First_Bid").text.replace("$", ""))
            item_numberofbids= int(item.find("Number_of_Bids").text)
            
            
            item_buyprice = None
            if item.find("Buyprice"):
                item_buyprice= Decimal(item.find("Buyprice").text.replace("$", ""))

            item_description= item.find("Description").text
            item_latitude = item.find("Location").get('Latitude')
            item_longitude = item.find("Location").get('Longitude')
            item_Location = item.find("Location").text
            item_country = item.find("Country").text  

            if item_description == None or item_Location == None or item_country == None:
                continue

            seller = UserProfile.objects.get(user_id=User.objects.get(username=item.find('Seller').attrib.get('UserID')))

            item_id = self.create_item(item_name, categories, item_numberofbids, item_firstbid, item_currenlty, item_buyprice, item_description, item_Location, item_country, item_latitude, item_longitude, seller.id)

            bid_time = 1

            count += 1

            for bid in item.find("Bids"):                

                bidder = bid.find('Bidder')

                if bidder.find("Location") == None or bidder.find("Country") == None:
                    continue

                bidder_username = bidder.get("UserID")
                bidder_rating = int(bidder.get("Rating"))
                bidder_location = bidder.find("Location").text
                bidder_country = bidder.find("Country").text
                bid_amount = Decimal(bid.find("Amount").text.replace("$", ""))

                if bidder_country == None or bidder_location == None:
                    continue

                bidder_id = self.create_user(bidder_username, bidder_rating, bidder_location, bidder_country)
                self.create_bid(item_id, bidder_id, bid_amount, bid_time)

                bid_time += 1

            if count >= limit_count:
                break

    
    def handle(self, *args, **options):
        print("Parsing Auctions...")
        
        filename = os.path.join(settings.MANAGEMENT_ROOT, options['filename'])
        limit_count = options['limit_count']

        self.remove_apersands(filename)
        self.parse_xml(filename, limit_count)
