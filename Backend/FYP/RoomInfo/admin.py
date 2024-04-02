from django.contrib import admin
from .models import Room
from .models import Comments

class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_id', 'room_name', 'num_of_people', 'num_of_comments', 'created_at','created_by')
    search_fields = ('room_id', 'room_name')  # Enable searching by these fields

admin.site.register(Room, RoomAdmin)

class CommentsAdmin(admin.ModelAdmin):
    list_display = ('room', 'no_of_comment', 'comments','upvoted_comments')
    search_fields = ('room','comments','upvoted_comments',)

admin.site.register(Comments, CommentsAdmin) 