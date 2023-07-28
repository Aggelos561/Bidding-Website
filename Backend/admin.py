from django.contrib import admin
from .models import UserProfile, Seller, Bidder, Item, Category, Picture, Message, HideMessage

# Register your models here.

admin.site.register(UserProfile)
admin.site.register(Seller)
admin.site.register(Item)
admin.site.register(Bidder)
admin.site.register(Category)
admin.site.register(Picture)
admin.site.register(Message)
admin.site.register(HideMessage)
