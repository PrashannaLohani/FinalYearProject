# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class PollConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.poll_id = self.scope['url_route']['kwargs']['poll_id']
        self.poll_group_name = f'poll_{self.poll_id}'

        # Join poll group
        await self.channel_layer.group_add(
            self.poll_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave poll group
        await self.channel_layer.group_discard(
            self.poll_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        question = text_data_json['question']
        options = text_data_json['options']

        # Send message to poll group
        await self.channel_layer.group_send(
            self.poll_group_name,
            {
                'type': 'poll_message',
                'question': question,
                'options': options
            }
        )

    # Receive message from poll group
    async def poll_message(self, event):
        question = event['question']
        options = event['options']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'question': question,
            'options': options
        }))