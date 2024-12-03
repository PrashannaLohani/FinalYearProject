from django.db import models
from CRM.models import Signup

class Room(models.Model):
    user = models.ForeignKey(Signup,on_delete=models.CASCADE,default=None)
    room_id = models.CharField(editable=False)
    room_name = models.CharField(max_length=255)
    limit_people_num =  models.IntegerField(default=9999)
    num_of_people = models.IntegerField(default=0)
    num_of_comments = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True) 
    active = models.BooleanField(default=True)
    

    def __str__(self):
        return self.room_name
    
    def to_dict(self):
        return {
            'room_id': self.room_id,
            'user':self.user.full_name,
            'room_name': self.room_name,
            'limit_people_num': self.limit_people_num,
            'num_of_people': self.num_of_people,
            'num_of_comments': self.num_of_comments,
            'active':self.active
        }
    
class Comment(models.Model):
    room = models.IntegerField(default=None)
    user = models.CharField(default=None, max_length=255)
    message = models.CharField(max_length=500, default=None)
    vote= models.IntegerField(default=0)

    def __str__(self):
        return self.message  


class RoomPoll(models.Model):
    user = models.ForeignKey(Signup, on_delete=models.CASCADE, default=None)
    poll = models.CharField(max_length=255,default=None)
    question = models.CharField(max_length=255)
    options = models.CharField(max_length=255, default=None)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.question
    def to_dict(self):
        return {
            'user': self.user.id,
            "poll": self.poll,
            "question": self.question,
            "options": self.options,
            "votes": self.votes,
        }