# Generated by Django 5.0.1 on 2024-02-06 08:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0009_login'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='login',
            name='fullname',
        ),
    ]