# Generated by Django 5.0.1 on 2024-02-21 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0027_remove_signup_created_at_remove_signup_is_admin_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='signup',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
    ]