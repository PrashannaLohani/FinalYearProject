# Generated by Django 5.0.1 on 2024-02-14 04:16

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0017_delete_login'),
    ]

    operations = [
        migrations.AddField(
            model_name='signup',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
