# Generated by Django 5.0.1 on 2024-02-21 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0033_remove_signup_fullname_remove_signup_is_staff_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='signup',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='signup',
            name='is_superuser',
            field=models.BooleanField(default=False),
        ),
    ]