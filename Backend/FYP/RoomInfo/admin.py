from django.contrib import admin
from .models import Room
from .models import Comment, RoomPoll

class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_id','user', 'room_name', 'num_of_people','limit_people_num', 'num_of_comments', 'created_at','active')
    search_fields = ('room_id', 'room_name')  # Enable searching by these fields
    readonly_fields = ('room_id',)

admin.site.register(Room, RoomAdmin)

class CommentsAdmin(admin.ModelAdmin):
    list_display = ('room','user','message','vote')
    search_fields = ('room',)

    def Read(self, obj):
        return obj.read

admin.site.register(Comment, CommentsAdmin) 
admin.site.register(RoomPoll) 

