# Generated by Django 5.0.1 on 2024-02-19 11:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0021_signup_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]