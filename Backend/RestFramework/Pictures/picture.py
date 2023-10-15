from rest_framework.response import Response
from rest_framework.views import APIView
from Backend.models import Picture
from ...serializers import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from BiddingWebsite.settings import *
from ...permissions import *

class CreatePictures(APIView):

    serializer_class = PictureSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def post(self, request, format=None):
  
        url = request.data['url']
        
        if url == False:
            url = "/DefaultImage/noImageAvailable.png"

        item_id = request.data['item']
        item_obj = Item.objects.get(id=item_id)

        self.check_object_permissions(request, item_obj)

        Picture.objects.create(item=item_obj, url=url)
        
        return Response({'message': 'Pictures Created'}, status = 200)



class ItemPictures(APIView):

    def get(self, request, item_id, format=None):
        item = Item.objects.get(id=item_id)
        snippets = Picture.objects.filter(item=item)
        serializer = PictureSerializer(snippets, many=True)
        return Response(serializer.data)


class UploadNewPictures(APIView):

    serializer_class = PictureSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsSeller]

    def put(self, request, item_id, format=None):
        url = request.data['url']
        item_obj = Item.objects.get(id=item_id)

        self.check_object_permissions(request, item_obj)

        Picture.objects.create(item=item_obj, url=url)
        return Response({'message': 'Pictures Updated'}, status = 200)
    
    def delete(self, request, item_id, format=None):
        item_obj = Item.objects.get(id=item_id)
        
        self.check_object_permissions(request, item_obj)
        
        if (Picture.objects.filter(item=item_id).delete()):
            return Response({'message': 'Pictures Deleted'}, status = 200)
        return Response({'message': 'Default Picture Deleted'}, status = 200)

