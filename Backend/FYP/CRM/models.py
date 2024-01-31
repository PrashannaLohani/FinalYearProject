from typing import Any
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractUser

class userManager(BaseUserManager):
    def create_user(self, username, email, password=None, confirm_password=None):
        
        user = self.model(username=username)
        email = self.normalize_email(email)
        user.set_password1(password)
        user.set_password2(confirm_password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, password=None):
        return self.create_user(username, password)

class CustomUser(AbstractUser):
    username= models.CharField(max_length = 200)
    email = models.EmailField(unique = True)
    objects = userManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def __str__(self):
        return self.email

