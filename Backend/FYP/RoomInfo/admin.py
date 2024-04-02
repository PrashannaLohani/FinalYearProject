from django.contrib import admin
from .models import Room

class RoomAdmin(admin.ModelAdmin):
    list_display = ('room_id', 'room_name', 'num_of_people', 'num_of_comments', 'created_at','created_by')
    search_fields = ('room_id', 'room_name')  # Enable searching by these fields

admin.site.register(Room, RoomAdmin)