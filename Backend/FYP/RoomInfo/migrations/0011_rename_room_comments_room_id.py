# Generated by Django 5.0.1 on 2024-04-20 12:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('RoomInfo', '0010_remove_comments_no_of_comment'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='room',
            new_name='room_id',
        ),
    ]
