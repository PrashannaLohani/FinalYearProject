# Generated by Django 5.0.1 on 2024-04-20 12:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('RoomInfo', '0011_rename_room_comments_room_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comments',
            old_name='room_id',
            new_name='room',
        ),
    ]