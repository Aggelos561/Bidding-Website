from django.urls import path
from . import userProfile


urlpatterns = [

    path('profile-id-details/<int:profile_id>/', userProfile.IdProfileDetail.as_view()),
    path('userprofile/<str:username>/', userProfile.UsernameProfileDetail.as_view()),
    path('update-userprofile/<str:username>/', userProfile.UpdateUserProfile.as_view()),
    path('userprofiles/', userProfile.UserProfileList.as_view()),

]