from django.contrib import admin
from .models import PollCode, Option

class OptionAdmin(admin.ModelAdmin):
    list_display = ('poll', 'question', 'options', 'votes')
    search_fields = ('poll__poll_code__poll_id', 'question')  

admin.site.register(Option, OptionAdmin)

class PollCodeAdmin(admin.ModelAdmin):
    list_display = ('poll_id', 'user','num_of_people','active')
    search_fields = ('poll_id',)  

admin.site.register(PollCode, PollCodeAdmin)
