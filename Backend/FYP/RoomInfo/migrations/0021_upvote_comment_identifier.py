# Generated by Django 5.0.1 on 2024-04-26 05:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RoomInfo', '0020_rename_comments_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='upvote',
            name='comment_identifier',
            field=models.CharField(default=None, max_length=255),
        ),
    ]
