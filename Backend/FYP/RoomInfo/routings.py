from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_id>\w+)/$', consumers.CommentConsumer.as_asgi()),
    re_path(r'ws/poll/(?P<poll_id>\w+)/$', consumers.PollConsumer.as_asgi()),  # New poll consumer route
]