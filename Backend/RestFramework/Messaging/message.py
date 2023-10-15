from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import Message, HideMessage
from django.http import Http404
from rest_framework import status
from ...serializers import *
from ...permissions import *


def isHiddenMessage(message_id):
	return HideMessage.objects.filter(message_id=message_id).exists()

def isVisible(message_id, user_id):
	return HideMessage.objects.filter(message_id=message_id, user_id=user_id).exists()



class ListMessages(APIView):

	serializer_class = MessageDetailedSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsMessageWriter]

	def post(self, request, *args, **kwargs):
		self.check_permissions(request)
		
		serializer = MessageDetailedSerializer(data=request.data)

		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ListReceivers(APIView):

	serializer_class = ListReceiversSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def manipulate_message(self, receiver):
		receiver["sender_user"] = UserProfile.objects.get(id=receiver["sender_id"]).user_id.username

	def get(self, request, format=None):
		snippets = Message.objects.filter(receiver_id=request.user.id)
		serializer = ListReceiversSerializer(snippets, many=True)

		for receiver in serializer.data:
			self.manipulate_message(receiver)

		return Response(serializer.data)


class ReceiverMessageCard(APIView):

	serializer_class = MessageCardSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def manipulate_message(self, message):
		message["receiver_user"] = UserProfile.objects.get(id=message["receiver_id"]).user_id.username
		message["sender_user"] = UserProfile.objects.get(id=message["sender_id"]).user_id.username

	def get(self, request, format=None):
		try:
			snippets = Message.objects.filter(receiver_id=request.user.id).order_by('-time')
			serializer = MessageCardSerializer(snippets, many=True)

			validMessages = snippets

			for message in validMessages:
				if (isVisible(message.id, request.user.id)):
					validMessages = validMessages.exclude(id=message.id)

			serializer = MessageCardSerializer(validMessages, many=True)
		
			for receiverMessage in serializer.data:
				self.manipulate_message(receiverMessage)

			return Response(serializer.data)
		
		except Exception:
			return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SenderMessageCard(APIView):

	serializer_class = MessageCardSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def manipulate_message(self, message):
		message["receiver_user"] = UserProfile.objects.get(id=message["receiver_id"]).user_id.username
		message["sender_user"] = UserProfile.objects.get(id=message["sender_id"]).user_id.username

	def get(self, request, format=None):
		try:
			snippets = Message.objects.filter(sender_id=request.user.id).order_by('-time')
			serializer = MessageCardSerializer(snippets, many=True)

			validMessages = snippets

			for message in validMessages:
				if (isVisible(message.id, request.user.id)):
					validMessages = validMessages.exclude(id=message.id)

			serializer = MessageCardSerializer(validMessages, many=True)

			for receiverMessage in serializer.data:
				self.manipulate_message(receiverMessage)

			return Response(serializer.data)
		
		except Exception:
			return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ReceiverMessageDetails(APIView):

	serializer_class = MessageDetailedSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def manipulate_message(self, message):
		message["receiver_user"] = UserProfile.objects.get(id=message["receiver_id"]).user_id.username
		message["sender_user"] = UserProfile.objects.get(id=message["sender_id"]).user_id.username

	def get(self, request, message_id, format=None):
		snippets = Message.objects.get(receiver_id=request.user.id, id=message_id)
		
		snippets.read = True
		snippets.save()

		serializer = MessageDetailedSerializer(snippets)
		
		data = serializer.data
		self.manipulate_message(data)
	
		return Response(data, status=status.HTTP_200_OK)



class SenderMessageDetails(APIView):

	serializer_class = MessageDetailedSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def manipulate_message(self, message):
		message["receiver_user"] = UserProfile.objects.get(id=message["receiver_id"]).user_id.username
		message["sender_user"] = UserProfile.objects.get(id=message["sender_id"]).user_id.username

	def get(self, request, message_id, format=None):
		snippets = Message.objects.get(sender_id=request.user.id, id=message_id)
		serializer = MessageDetailedSerializer(snippets)

		data = serializer.data
		self.manipulate_message(data)
	
		return Response(data, status=status.HTTP_200_OK)



class DeleteMessage(APIView):

	serializer_class = MessageDetailedSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def get_object(self, message_id):
		try:
			return Message.objects.get(id=message_id)
		except Message.DoesNotExist:
			raise Http404

	def delete(self, request, message_id, format=None):

		if (isHiddenMessage(message_id)):
			snippet = self.get_object(message_id)
			snippet.delete()
			return Response(status=status.HTTP_204_NO_CONTENT)

		HideMessage.objects.create(message_id_id=message_id, user_id_id=request.user.id)

		return Response(status=status.HTTP_200_OK)



class CountUnreadMessages(APIView):

	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		try:

			hiddenMessages = HideMessage.objects.filter(user_id_id=request.user.id).values()

			snippets = Message.objects.filter(receiver_id=request.user.id, read=False)

			for hiddenMessage in hiddenMessages:
				snippets = snippets.exclude(id=hiddenMessage['message_id_id'])

			return Response({"count" : len(snippets)}, status=status.HTTP_200_OK)
		
		except Exception:
			return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
