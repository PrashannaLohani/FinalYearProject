# Generated by Django 5.0.1 on 2024-02-19 11:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0019_alter_signup_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='signup',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
