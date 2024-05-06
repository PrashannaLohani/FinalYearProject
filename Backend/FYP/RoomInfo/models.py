from django.db import models
from CRM.models import Signup

class Room(models.Model):
    # user = models.ForeignKey(Signup,on_delete=models.CASCADE,default=None)
    room_id = models.CharField(editable=False)
    room_name = models.CharField(max_length=255)
    limit_people_num =  models.IntegerField(default=9999)
    num_of_people = models.IntegerField(default=0)
    num_of_comments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True) 
    

    def __str__(self):
        return self.room_name
    
class Comment(models.Model):
    room = models.IntegerField(default=None)
    user = models.CharField(default=None, max_length=255)
    message = models.CharField(max_length=500, default=None)

    def __str__(self):
        return self.message  # Returning message as a string representation

    def get_unique_identifier(self):
        return f"{self.room}-{self.message}"  # Creating a unique identifier

class Upvote(models.Model):
    user = models.CharField(max_length=255)
    comment_identifier = models.CharField(max_length=255,default=None)  # Storing the composite key
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    def __str__(self):
        return self.Upvote