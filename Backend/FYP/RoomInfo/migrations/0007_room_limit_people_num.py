# Generated by Django 5.0.1 on 2024-04-14 02:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RoomInfo', '0006_remove_room_created_by_alter_comments_no_of_comment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='limit_people_num',
            field=models.IntegerField(default=0),
        ),
    ]
