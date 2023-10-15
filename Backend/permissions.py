from rest_framework import permissions


class IsSeller(permissions.BasePermission):

    def has_permission(self, request, view):
        try:
            return request.user.id == request.data['seller_user']
        
        except KeyError:
            return True
        

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.seller_user.user.id == request.user.id



class IsBidder(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.seller_user.user.id != request.user.id



class IsMessageWriter(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.id == request.data['sender_id']



class IsMessageReceiver(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.receiver_id.id == request.user.id or obj.sender_id.id == request.user.id
