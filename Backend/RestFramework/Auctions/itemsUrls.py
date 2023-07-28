from django.urls import path
from . import item


urlpatterns = [

    path('admin-list-items/', item.AdminListItems.as_view()),
    
    path('create-items/', item.CreateItems.as_view()),
    
    path('list-items/', item.ListItems.as_view()),
    
    path('my-items-list/', item.MyItemsList.as_view()),
    
    path('item/<int:pk>/', item.ItemDetails.as_view()),
    
    path('item-bid/<int:pk>/', item.ItemBidAPI.as_view()),
    
    path('update-item/<int:pk>/', item.UpdateItemAPI.as_view()),
    
    path('item-checker/<int:item_id>/', item.ItemChecker.as_view())

]


