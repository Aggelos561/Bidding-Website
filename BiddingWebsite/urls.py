from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from Backend.RestFramework.Users.usersUrls import urlpatterns as usersUrls
from Backend.RestFramework.Authentication.authenticationUrls import urlpatterns as authenticationUrls
from Backend.RestFramework.Registration.registrationUrls import urlpatterns as registrationUrls
from Backend.RestFramework.Auctions.itemsUrls import urlpatterns as itemsUrls
from Backend.RestFramework.Categories.categoryUrls import urlpatterns as categoriesUrls
from Backend.RestFramework.Bid.bidUrls import urlpatterns as bidUrls
from Backend.RestFramework.Filtering.filtersUrls import urlpatterns as filtersUrls
from Backend.RestFramework.Messaging.messageUrls import urlpatterns as messageUrls
from Backend.RestFramework.Pictures.picturesUrls import urlpatterns as picturesUrls
from Backend.RestFramework.VisitationLogs.visitationLogsUrls import urlpatterns as visitationLogsUrls
from Backend.RestFramework.AuctionsFiles.auctionsFilesUrls import urlpatterns as auctionFilesUrls


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += itemsUrls + messageUrls + picturesUrls + auctionFilesUrls + bidUrls + filtersUrls + categoriesUrls + visitationLogsUrls + usersUrls + authenticationUrls + registrationUrls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)