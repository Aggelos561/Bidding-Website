from django.urls import path
from . import visitationLog


urlpatterns = [

    path('visitation-log/', visitationLog.VisitationLogList.as_view()),
    path('visitation-log-matrix/<int:user_id>/', visitationLog.AcquireRecommendations.as_view()),

]
