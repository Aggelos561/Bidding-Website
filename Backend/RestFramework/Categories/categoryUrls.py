
from django.urls import path
from . import category


urlpatterns = [

    path('category/', category.CategoryList.as_view()),

]

