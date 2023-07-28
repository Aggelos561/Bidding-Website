from django.db import models
from django.contrib.auth.models import User

class Bid(models.Model):
    time = models.DateTimeField()
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    bidder_user = models.ForeignKey('Bidder', on_delete=models.CASCADE, db_column='Bidder_User_ID')  # Field name made lowercase
    item = models.ForeignKey('Item', models.CASCADE, db_column='Item_id')  # Field name made lowercase.

    class Meta:
        managed = True
        db_table = 'bid'


class Bidder(models.Model):
    user = models.OneToOneField('UserProfile', on_delete=models.CASCADE, db_column='User_ID', primary_key=True)  # Field name made lowercase.
    rating = models.IntegerField()
    
    def __str__(self):
        return str(self.user)

    class Meta:
        managed = True
        db_table = 'bidder'


class Category(models.Model):
    name = models.CharField(db_column='Name', primary_key=True, max_length=100)  # Field name made lowercase.

    def __str__(self):
        return str(self.name)

    class Meta:
        managed = True
        db_table = 'category'
        verbose_name = ("Category")
        verbose_name_plural = ("Categories")


class Item(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)  # Field name made lowercase.
    seller_user = models.ForeignKey('Seller', on_delete=models.CASCADE, db_column='Seller_User_ID')  # Field name made lowercase.
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    latitude = models.CharField(max_length=255, blank=True, null=True)
    longitude = models.CharField(max_length=255, blank=True, null=True)
    currently = models.DecimalField(max_digits=8, decimal_places=2)
    buyprice = models.DecimalField(db_column='buyPrice', max_digits=8, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    firstbid = models.DecimalField(db_column='firstBid', max_digits=8, decimal_places=2)  # Field name made lowercase.
    numberofbids = models.IntegerField(db_column='numberOfBids')  # Field name made lowercase.
    started = models.DateTimeField()
    ends = models.DateTimeField()
    description = models.TextField()
    active = models.BooleanField(default=False, blank=False)
    category = models.ManyToManyField(Category, db_column='Category_Name')
    

    def __str__(self):
        return (str(self.name) + " (" + str(self.id) + ")")

    class Meta:
        managed = True
        db_table = 'item'
        unique_together = (('id', 'seller_user'),)



def upload_path(instance, filename):
    return '/'.join([str(instance.item), filename])


class Picture(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)  # Field name made lowercase.
    url = models.ImageField(null=False, blank=False, upload_to=upload_path)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, db_column='Item_id')  # Field name made lowercase.

    def __str__(self):
        return (type(self).__name__ + " For Item " + str(self.item))

    class Meta:
        managed = True
        db_table = 'pictures'


class Seller(models.Model):
    user = models.OneToOneField('UserProfile', on_delete=models.CASCADE, db_column='User_ID', primary_key=True)  # Field name made lowercase.
    rating = models.IntegerField()

    def __str__(self):
        return str(self.user)

    class Meta:
        managed = True
        db_table = 'seller'


class UserProfile(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)  # Field name made lowercase.
    TIN = models.CharField(max_length=20)
    phoneNumber = models.CharField(max_length=20)
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_user')

    class Meta:
        managed = True
        db_table = 'UserProfile'

    def __str__(self):
        return self.user_id.username


class Message(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)
    message = models.TextField()
    time = models.DateTimeField()
    receiver_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_column='receiver_id', related_name='message_receiver_id')
    sender_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_column='sender_id', related_name='message_sender_id')
    subject = models.TextField()
    read = models.BooleanField(default=False, blank=False)

    class Meta:
        managed = True
        db_table = 'message'

class HideMessage(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_column='user_id')
    message_id = models.ForeignKey(Message, on_delete=models.CASCADE, db_column='message_id')

    class Meta:
        managed = True
        db_table = 'hide_message'



class VisitationLog(models.Model):
    id = models.AutoField(db_column='id', primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_column='user_id')
    item_id = models.ForeignKey(Item, on_delete=models.CASCADE, db_column='item_id')
    count = models.IntegerField(default=0, blank=False)
    recommendation = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'visitation_log'