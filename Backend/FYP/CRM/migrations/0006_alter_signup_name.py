# Generated by Django 5.0.1 on 2024-02-06 04:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0005_remove_signup_cpassword_alter_signup_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signup',
            name='name',
            field=models.CharField(max_length=300),
        ),
    ]