from django.db import models
from CRM.models import Signup
from django.db.models import JSONField


# Create your models here.
class PollCode(models.Model):
    poll_id = models.CharField( editable=False)
    user = models.ForeignKey(Signup, on_delete=models.CASCADE, default=None)
    num_of_people= models.IntegerField(default=0)
    active = models.BooleanField(default=True)

    def __str__(self):
        return str(self.poll_id)


class Option(models.Model):
    poll = models.CharField(max_length=255,default=None)
    question = models.CharField(max_length=255)
    options = models.CharField(max_length=255, default=None)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.question
