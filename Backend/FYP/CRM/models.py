from django.db import models
from django.contrib.auth.hashers import make_password

class Signup (models.Model):
    fullname=models.CharField(max_length = 300)
    email = models.EmailField(max_length = 100)
    password = models.CharField(max_length = 300 )
    extra_kwargs = {
        'password': {"write_only":True}
    }
   

    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.password = make_password(self.password)
       
        super().save(*args, **kwargs)

class Login (models.Model):
    email = models.EmailField(max_length = 100)
    password = models.CharField(max_length = 300 )
    extra_kwargs = {
        'password': {"write_only":True}
    }
   

    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.password = make_password(self.password)
       
        super().save(*args, **kwargs)


