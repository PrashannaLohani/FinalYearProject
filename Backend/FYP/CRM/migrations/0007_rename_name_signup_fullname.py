# Generated by Django 5.0.1 on 2024-02-06 05:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0006_alter_signup_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='signup',
            old_name='name',
            new_name='fullname',
        ),
    ]
