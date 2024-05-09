from django.db import models
import random
from CRM.models import Signup

# Create your models here.
class Poll(models.Model):
    user = models.ForeignKey(Signup,on_delete=models.CASCADE,default=None)
    poll_id = models.CharField(editable=False)
    question = models.CharField(max_length=255)
    options = models.CharField(max_length=255,blank=True, null=True )
    num_of_people = models.IntegerField(default=0)
    num_of_vote = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True) 
    

    def __str__(self):
        return self.poll_id
    
    def to_dict(self):
        return {
            'poll_id': self.room_id,
            'question': self.question,
            'options': [option.text for option in self.options.all()],
            'num_of_people': self.num_of_people,
            'num_of_vote': self.num_of_vote
        }