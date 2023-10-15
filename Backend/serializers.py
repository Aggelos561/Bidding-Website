from rest_framework import serializers
from .models import Bidder, Seller, Bid, Item, Picture, Category, UserProfile, Message, HideMessage, VisitationLog
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone


class UserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, max_length=50, validators=[UniqueValidator(queryset=User.objects.all())])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs
    
    def validate_email(self, email_val):
        if len(email_val) > 50:
            raise serializers.ValidationError({"Email cannot be more than 50 characters."})
        return email_val
    
    def validate_first_name(self, value):
        if not 0 < len(value) <= 20:
            raise serializers.ValidationError({"First name must be between 1 and 20 characters."})
        return value

    def validate_last_name(self, value):
        if not 0 < len(value) <= 20:
            raise serializers.ValidationError({"Last name must be between 1 and 20 characters."})
        return value

    def validate_username(self, value):
        if not 0 < len(value) <= 20:
            raise serializers.ValidationError({"Username must be between 1 and 20 characters."})
        return value

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'password2', 'is_active']
    

class UserProfileRegisterSerializer(serializers.ModelSerializer):
    user_id = UserRegisterSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'

    def create(self, validated_data):
        user_prof = validated_data.pop('user_id')

        user_instance = User.objects.create(
            username=user_prof['username'],
            email=user_prof['email'],
            first_name=user_prof['first_name'],
            last_name=user_prof['last_name']
        )

        user_instance.is_active = False
        user_instance.set_password(user_prof['password'])
        user_instance.save()
        
        profile = UserProfile.objects.create(user_id=user_instance, **validated_data)
        
        Seller.objects.create(user=profile, rating=0)
        
        Bidder.objects.create(user=profile, rating=0)

        return profile


class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField(max_length=50)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'is_active']

    def validate_first_name(self, first_name):
        if not 0 < len(first_name) <= 20:
            raise serializers.ValidationError({"First name must be between 1 and 20 characters."})
        return first_name

    def validate_last_name(self, last_name):
        if not 0 < len(last_name) <= 20:
            raise serializers.ValidationError({"Last name must be between 1 and 20 characters."})
        return last_name

    def validate_username(self, username):
        if not 0 < len(username) <= 20:
            raise serializers.ValidationError({"Username must be between 1 and 20 characters."})
        return username

    def validate_email(self, email):
        if not 0 < len(email) < 50:
            raise serializers.ValidationError({"Email cannot be more than 50 characters or 0 characters."})
        return email

    def validate(self, data):
        instance = getattr(self, 'instance', None)
        if instance and instance.pk:
            data['username'] = instance.username
            data['email'] = instance.email

        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    user_id = UserUpdateSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'
    
    def validate_TIN(self, tin):
        if not 0 < len(tin) <= 10:
            raise serializers.ValidationError({"TIN cannot be more than 10 characters."})
        return tin

    def validate_phoneNumber(self, number):
        if not 0 < len(number) <= 10:
            raise serializers.ValidationError({"Phone number cannot be more than 20 characters."})
        return number

    def validate_location(self, location):
        if not 0 < len(location) <= 20:
            raise serializers.ValidationError({"Location cannot be more than 20 characters."})
        return location

    def validate_country(self, country):
        if not 0 < len(country) <= 20:
            raise serializers.ValidationError({"Country cannot be more than 20 characters."})
        return country

    def update(self, instance, validated_data):  

        user_prof = validated_data.pop('user_id')

        instance.username = user_prof['username']
        instance.email = user_prof['email']
        instance.first_name = user_prof['first_name']
        instance.last_name = user_prof['last_name']
        instance.is_active = user_prof['is_active']
        instance.save()

        profile = UserProfile.objects.get(user_id=instance)

        profile.TIN = validated_data['TIN']
        profile.phoneNumber = validated_data['phoneNumber']
        profile.location = validated_data['location']
        profile.country = validated_data['country']

        profile.save()
        
        return profile


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        profile = UserProfile.objects.get(user_id=user)
        
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['profile_id'] = profile.id

        return token


class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bid
        fields = '__all__'

    def validate_amount(self, amount):
        if not 0 < int(amount) <= 10000:
            raise serializers.ValidationError({"Amount cannot be more than 10000"})
        return amount


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

    def validate_name(self, name):
        if not 0 < len(name) <= 20:
            raise serializers.ValidationError("Name length cannot be more than 20.")
        return name

    def validate_location(self, location):
        if not 0 < len(location) <= 20:
            raise serializers.ValidationError("Location length cannot be more than 20.")
        return location

    def validate_country(self, country):
        if not 0 < len(country) <= 20:
            raise serializers.ValidationError("Country length cannot be more than 20.")
        return country

    def validate_ends(self, ended):
        if ended <= timezone.now():
            raise serializers.ValidationError("End time must be in the future.")
        return ended

    def validate_description(self, desc):
        if len(desc) > 2000:
            raise serializers.ValidationError({"Description cannot be more than 2000 characters."})
        return desc
    
    def validate_numberofbids(self, bids):
        if int(bids) > 0:
            raise serializers.ValidationError({"Cannot update auction since bids have been made"})
        return bids
    
    def validate(self, data):
        if data['started'] >= data['ends']:
            raise serializers.ValidationError("Start time must be smaller than end time.")
        return data
        


class ItemBidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'country', 'latitude', 'longitude', 'currently', 'buyprice', 'firstbid', 'started', 'ends', 'description', 'seller_user', 'category']
    
    def validate_ends(self, ends_time):
        if ends_time <= timezone.now():
            raise serializers.ValidationError("The bidding has already ended.")
        return ends_time


class ItemAsFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "name", "location", "country", "currently", "firstbid", "numberofbids", "started", "ends", "description", "category", "latitude", "longitude"]


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class MessageDetailedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

    def validate_message(self, message):
        if not 0 < len(message) <= 1000:
            raise serializers.ValidationError({"Message length cannot be more than 1000 characters"})
        return message
    
    def validate_subject(self, subject):
        if not 0 < len(subject) <= 100:
            raise serializers.ValidationError({"Subject length cannot be more than 100 characters"})
        return subject


class MessageCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'subject', 'time', 'receiver_id', 'sender_id', 'read']


class ListReceiversSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['sender_id']


class VisitationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitationLog
        fields = "__all__"
