from django.urls import path
from . import userRegistration


urlpatterns = [

    path('register/', userRegistration.UserProfileRegister.as_view()),

]