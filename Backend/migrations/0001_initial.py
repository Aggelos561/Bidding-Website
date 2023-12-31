# Generated by Django 4.0.3 on 2022-09-07 18:54

import Backend.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('name', models.CharField(db_column='Name', max_length=100, primary_key=True, serialize=False)),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'db_table': 'category',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('location', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('latitude', models.CharField(blank=True, max_length=255, null=True)),
                ('longitude', models.CharField(blank=True, max_length=255, null=True)),
                ('currently', models.DecimalField(decimal_places=2, max_digits=8)),
                ('buyprice', models.DecimalField(blank=True, db_column='buyPrice', decimal_places=2, max_digits=8, null=True)),
                ('firstbid', models.DecimalField(db_column='firstBid', decimal_places=2, max_digits=8)),
                ('numberofbids', models.IntegerField(db_column='numberOfBids')),
                ('started', models.DateTimeField()),
                ('ends', models.DateTimeField()),
                ('description', models.TextField()),
                ('active', models.BooleanField(default=False)),
                ('category', models.ManyToManyField(db_column='Category_Name', to='Backend.category')),
            ],
            options={
                'db_table': 'item',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('TIN', models.CharField(max_length=20)),
                ('phoneNumber', models.CharField(max_length=20)),
                ('location', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('user_id', models.ForeignKey(db_column='id_user', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'UserProfile',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Bidder',
            fields=[
                ('user', models.OneToOneField(db_column='User_ID', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='Backend.userprofile')),
                ('rating', models.IntegerField()),
            ],
            options={
                'db_table': 'bidder',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Seller',
            fields=[
                ('user', models.OneToOneField(db_column='User_ID', on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='Backend.userprofile')),
                ('rating', models.IntegerField()),
            ],
            options={
                'db_table': 'seller',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='VisitationLog',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('count', models.IntegerField(default=0)),
                ('recommendation', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('item_id', models.ForeignKey(db_column='item_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.item')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.userprofile')),
            ],
            options={
                'db_table': 'visitation_log',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('url', models.ImageField(upload_to=Backend.models.upload_path)),
                ('item', models.ForeignKey(db_column='Item_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.item')),
            ],
            options={
                'db_table': 'pictures',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('time', models.DateTimeField()),
                ('subject', models.TextField()),
                ('read', models.BooleanField(default=False)),
                ('receiver_id', models.ForeignKey(db_column='receiver_id', on_delete=django.db.models.deletion.CASCADE, related_name='message_receiver_id', to='Backend.userprofile')),
                ('sender_id', models.ForeignKey(db_column='sender_id', on_delete=django.db.models.deletion.CASCADE, related_name='message_sender_id', to='Backend.userprofile')),
            ],
            options={
                'db_table': 'message',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='HideMessage',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('message_id', models.ForeignKey(db_column='message_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.message')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.userprofile')),
            ],
            options={
                'db_table': 'hide_message',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='item',
            name='seller_user',
            field=models.ForeignKey(db_column='Seller_User_ID', on_delete=django.db.models.deletion.CASCADE, to='Backend.seller'),
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('amount', models.DecimalField(decimal_places=2, max_digits=8)),
                ('item', models.ForeignKey(db_column='Item_id', on_delete=django.db.models.deletion.CASCADE, to='Backend.item')),
                ('bidder_user', models.ForeignKey(db_column='Bidder_User_ID', on_delete=django.db.models.deletion.CASCADE, to='Backend.bidder')),
            ],
            options={
                'db_table': 'bid',
                'managed': True,
            },
        ),
        migrations.AlterUniqueTogether(
            name='item',
            unique_together={('id', 'seller_user')},
        ),
    ]
