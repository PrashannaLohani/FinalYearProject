from django.db import models
from CRM.models import Signup


# Create your models here.
class PollCode(models.Model):
    poll_id = models.CharField( editable=False)
    user = models.ForeignKey(Signup, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return str(self.poll_id)


class Option(models.Model):
    poll = models.ForeignKey(PollCode, on_delete=models.CASCADE, related_name='options')
    question = models.CharField(max_length=255)
    option = models.CharField(max_length=255, blank=True, null=True)
    vote = models.IntegerField(default=0)

    def __str__(self):
        return self.question


class Poll(models.Model):
    poll_id = models.OneToOneField(PollCode, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    option = models.CharField(max_length=255, default=None)
    num_of_people = models.IntegerField(default=0)
    num_of_vote = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

    def to_dict(self):
        return {
            'poll_id': str(self.poll_code.poll_id),
            'question': self.question,
            'options': [{'option': option.option, 'vote': option.vote} for option in self.poll_code.options.all()],
            'user': self.poll_code.user.username,
            'num_of_people': self.num_of_people,
            'num_of_vote': self.num_of_vote
        }