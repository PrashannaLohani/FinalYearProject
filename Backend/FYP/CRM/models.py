from django.db import models

class Signup (models.Model):
    name=models.CharField(max_length = 100)
    email = models.CharField(max_length = 100)
    password = models.CharField(max_length = 30 )
    Cpassword = models.CharField(max_length = 30)

    
