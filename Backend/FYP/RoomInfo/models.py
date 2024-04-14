from django.db import models
from CRM.models import Signup
from django.contrib.auth.models import User

class Room(models.Model):
    room_id = models.CharField(editable=False)
    room_name = models.CharField(max_length=255)
    limit_people_num =  models.IntegerField(default=0)
    num_of_people = models.IntegerField(default=0)
    num_of_comments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.room_name
    
class Comments(models.Model):
    room = models.ForeignKey('RoomInfo.Room', on_delete=models.CASCADE, default= None)
    no_of_comment = models.IntegerField(default=0)
    comments = models.CharField(max_length = 255)
    no_upvoted_comments = models.IntegerField(default=0)
    upvoted_comments = models.CharField(max_length = 225, default ='')

    def __str__(self):
        return f"Comment on Room {self.room_id}"
