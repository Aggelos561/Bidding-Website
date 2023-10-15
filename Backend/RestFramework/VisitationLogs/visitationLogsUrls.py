from django.urls import path
from . import visitationLog


urlpatterns = [

    path('visitation-log/', visitationLog.VisitationLogList.as_view()),
    path('visitation-log-matrix/', visitationLog.AcquireRecommendations.as_view()),

]
