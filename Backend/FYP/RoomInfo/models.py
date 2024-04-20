from django.db import models
from CRM.models import Signup


class Room(models.Model):
    room_id = models.CharField(editable=False)
    room_name = models.CharField(max_length=255)
    limit_people_num =  models.IntegerField(default=9999)
    num_of_people = models.IntegerField(default=0)
    num_of_comments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True) 
    

    def __str__(self):
        return self.room_name
    
class Comments(models.Model):
    room = models.CharField(default=None)
    user = models.CharField(default=None,max_length=255)
    message = models.CharField(max_length=500, default=None)

    def __str__(self):
        return self.room
