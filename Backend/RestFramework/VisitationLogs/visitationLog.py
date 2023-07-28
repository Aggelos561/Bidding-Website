from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import VisitationLog, Item
from ...serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status


class VisitationLogList(APIView):

    serializer_class = VisitationLogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):

        try:
            snippets = VisitationLog.objects.all()
            visitationLogSerializer = VisitationLogSerializer(snippets, many=True)
            return Response(visitationLogSerializer.data)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def post(self, request, format=None):

        log_serializer = VisitationLogSerializer(data=request.data)

        if log_serializer.is_valid():

            seller_id = Item.objects.get(id=log_serializer.data['item_id']).seller_user_id

            if not seller_id == log_serializer.data['user_id']:
                try:
                    log = VisitationLog.objects.get(user_id_id=log_serializer.data['user_id'], item_id_id=log_serializer.data['item_id'])
                    log.count += 1
                    log.save()
                    return Response(status=status.HTTP_201_CREATED)

                except VisitationLog.DoesNotExist:
                    VisitationLog.objects.create(user_id_id=log_serializer.data['user_id'], item_id_id=log_serializer.data['item_id'], recommendation=log_serializer.data['recommendation'], count=1)
                    return Response(status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class AcquireRecommendations(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, format=None):

        try:
            top_recommendations = VisitationLog.objects.filter(user_id=user_id, count__lte=1).order_by("-recommendation").values()
            
            item_ids = []
            for rec in top_recommendations:
                item_ids.append(rec["item_id_id"])
            
            filtered_items = Item.objects.filter(id__in=item_ids).exclude(seller_user_id=user_id)

            recommendedItems = []
            rec_counter = 0

            for item_id in item_ids:
                if not Item.objects.filter(id=item_id, seller_user_id=user_id).exists():
                    recommendedItems.append(filtered_items.get(id=item_id))
                    rec_counter += 1
                if rec_counter == 6:
                    break

            serializer = ItemSerializer(recommendedItems, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as exc:
            return Response({"error": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)