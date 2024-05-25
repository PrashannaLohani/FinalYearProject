"""
ASGI config for FYP project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer
from Poll.routings import Poll_websocket_urlpatterns
from RoomInfo.routings import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FYP.settings')

# Combine the URL patterns into a single list
combined_websocket_urlpatterns = Poll_websocket_urlpatterns + websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            combined_websocket_urlpatterns
        )
    ),
})

channel_layer = get_channel_layer()
