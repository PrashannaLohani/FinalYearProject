# Generated by Django 5.0.1 on 2024-02-09 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0013_login'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Login',
        ),
        migrations.AlterField(
            model_name='signup',
            name='email',
            field=models.EmailField(max_length=100, unique=True),
        ),
    ]