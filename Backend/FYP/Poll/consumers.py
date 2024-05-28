import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PollConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.poll_id = self.scope['url_route']['kwargs']['poll_id']
        self.qid = self.scope['url_route']['kwargs']['qid']
        self.room_group_name = f'poll_{self.poll_id}_{self.qid}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Broadcast the new vote to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'poll_vote',
                'message': data
            }
        )

    async def poll_vote(self, event):
        message = event['message']
        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))