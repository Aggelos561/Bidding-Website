from django.urls import path
from . import picture


urlpatterns = [
    
    path('list-pictures/', picture.ListPictures.as_view()),
    path('create-pictures/', picture.CreatePictures.as_view()),
    path('update-pictures/<int:item_id>/', picture.UploadNewPictures.as_view()),
    path('item-pictures/<int:item_id>/', picture.ItemPictures.as_view()),

]