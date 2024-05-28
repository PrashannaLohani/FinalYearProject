from django.urls import re_path
from . import consumers

Poll_websocket_urlpatterns = [
    re_path(r'ws/poll/(?P<poll_id>\w+)/(?P<qid>[\w-]+)/$', consumers.PollConsumer.as_asgi()),
]