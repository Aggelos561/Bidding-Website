from django.urls import path
from . import userLogin
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [

    path('login/', userLogin.MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]