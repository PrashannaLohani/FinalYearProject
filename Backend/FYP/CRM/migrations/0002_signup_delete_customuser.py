# Generated by Django 5.0.1 on 2024-02-05 08:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CRM', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Signup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=30)),
                ('Cpassword', models.CharField(max_length=30)),
            ],
        ),
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]
