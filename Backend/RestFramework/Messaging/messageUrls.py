from django.urls import path
from . import message


urlpatterns = [

    path('list-messages/', message.ListMessages.as_view()),
    path('receiver-messages-card/', message.ReceiverMessageCard.as_view()),
    path('sender-messages-card/', message.SenderMessageCard.as_view()),
    path('receiver-message-details/<int:message_id>/', message.ReceiverMessageDetails.as_view()),
    path('sender-message-details/<int:message_id>/', message.SenderMessageDetails.as_view()),
    path('delete-message/<int:message_id>/', message.DeleteMessage.as_view()),
    path('list-receivers/', message.ListReceivers.as_view()),
    path('unread-messages/', message.CountUnreadMessages.as_view()),

]

