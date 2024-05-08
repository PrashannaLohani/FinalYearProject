from django.contrib import admin

from .models import Poll


class PollAdmin(admin.ModelAdmin):
    list_display = ('poll_id','user', 'question', 'num_of_people','option', 'num_of_vote', 'created_at')
    search_fields = ('poll_id', 'question')  # Enable searching by these fields
    readonly_fields = ('poll_id',)

admin.site.register(Poll, PollAdmin)