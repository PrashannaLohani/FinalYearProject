from django.db import models
from CRM.models import Signup

class Room(models.Model):
    room_id = models.CharField(max_length=100)
    room_name = models.CharField(max_length=255)
    num_of_people = models.IntegerField()
    num_of_comments = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(Signup, on_delete = models.CASCADE, default = None)

    def __str__(self):
        return self.room_name