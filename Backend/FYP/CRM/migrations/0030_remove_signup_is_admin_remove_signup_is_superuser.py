# Generated by Django 5.0.1 on 2024-02-21 05:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0029_signup_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='signup',
            name='is_admin',
        ),
        migrations.RemoveField(
            model_name='signup',
            name='is_superuser',
        ),
    ]