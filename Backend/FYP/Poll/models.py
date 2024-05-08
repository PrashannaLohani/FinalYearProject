from django.db import models
from CRM.models import Signup

# Create your models here.
class Poll(models.Model):
    user = models.ForeignKey(Signup,on_delete=models.CASCADE,default=None)
    poll_id = models.CharField(editable=False)
    question = models.CharField(max_length=255)
    option = models.CharField(max_length=255)
    num_of_people = models.IntegerField(default=0)
    num_of_vote = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True) 
    

    def __str__(self):
        return self.poll_id
    
    def to_dict(self):
        return {
            'poll_id': self.room_id,
            'question': self.question,
            'option': self.option,
            'num_of_people': self.num_of_people,
            'num_of_vote': self.num_of_vote
        }